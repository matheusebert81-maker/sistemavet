
import { db, Local } from './db';
import { supabase } from './supabase';
import { Table } from 'dexie';
import { checkRateLimit } from '../utils/security';

/**
 * SERVIÇO DE SINCRONIZAÇÃO AUTOMATIZADA
 * 
 * Este serviço gerencia o tráfego de dados entre o Dexie (Local) e o Supabase (Nuvem).
 * Ele otimiza o uso do tier gratuito fazendo batching de requisições.
 */

const TABLES_MAP = {
  tutors: 'tutores',
  animals: 'animais',
  appointments: 'agenda',
  medicalRecords: 'prontuarios',
  inventory: 'estoque',
  transactions: 'financeiro'
};

export const syncService = {
  
  // 1. PUSH: Envia dados locais pendentes para a nuvem
  pushChanges: async () => {
    if (!supabase) return;
    
    // Proteção contra ataques/loops infinitos de requisição
    if (!checkRateLimit()) return;

    console.log('[Sync] Iniciando Push...');

    for (const [localTable, remoteTable] of Object.entries(TABLES_MAP)) {
      try {
          // @ts-ignore
          const table: Table<Local<any>> = db[localTable];
          
          // Busca itens criados ou modificados offline
          const pendingItems = await table
            .filter(i => i.syncStatus === 'created' || i.syncStatus === 'updated')
            .toArray();

          if (pendingItems.length === 0) continue;

          console.log(`[Sync] Enviando ${pendingItems.length} itens de ${localTable}...`);

          // Limpa metadados internos antes de enviar para o Supabase
          const cleanItems = pendingItems.map(({ syncStatus, lastModified, ...item }) => item);

          // Upsert (Insert ou Update) em lote
          const { error } = await supabase.from(remoteTable).upsert(cleanItems);

          if (!error) {
            // Se sucesso, marca como sincronizado localmente
            await db.transaction('rw', table, async () => {
              for (const item of pendingItems) {
                await table.update(item.id, { syncStatus: 'synced' });
              }
            });
          } else {
            console.error(`[Sync] Erro ao enviar ${localTable}:`, error);
          }
      } catch (err) {
          console.error(`[Sync] Falha crítica ao processar tabela ${localTable}`, err);
      }
    }
  },

  // 2. PULL: Baixa dados novos da nuvem para local
  pullChanges: async (tenantId: string) => {
    if (!supabase) return;
    
    // Proteção de Rate Limit também no Pull
    if (!checkRateLimit()) return;

    console.log('[Sync] Iniciando Pull...');

    for (const [localTable, remoteTable] of Object.entries(TABLES_MAP)) {
        try {
            // Busca dados do tenant
            const { data, error } = await supabase
                .from(remoteTable)
                .select('*')
                .eq('tenant_id', tenantId);

            if (!error && data) {
                // @ts-ignore
                const table: Table<Local<any>> = db[localTable];
                
                await db.transaction('rw', table, async () => {
                    for (const remoteItem of data) {
                        // Verifica se temos uma versão local mais recente (conflito simples)
                        const localItem = await table.get(remoteItem.id);
                        
                        // Só sobrescreve se localmente estiver sincronizado (não modificado offline)
                        if (!localItem || localItem.syncStatus === 'synced') {
                            await table.put({
                                ...remoteItem,
                                syncStatus: 'synced',
                                lastModified: Date.now()
                            });
                        }
                    }
                });
            }
        } catch (err) {
            console.error(`[Sync] Falha ao baixar dados de ${remoteTable}`, err);
        }
    }
  },

  // 3. AUTO: Orquestrador
  startAutoSync: (tenantId: string) => {
    if (!supabase) return;
    
    // Sync inicial
    syncService.pushChanges().then(() => syncService.pullChanges(tenantId));

    // Intervalo de 2 minutos (otimizado para Free Tier e economia de banda)
    const intervalId = setInterval(async () => {
        if (navigator.onLine) {
            await syncService.pushChanges();
            await syncService.pullChanges(tenantId);
        }
    }, 120000); 

    // Listeners de rede
    const handleOnline = () => {
        console.log('[Sync] Online detectado. Sincronizando...');
        syncService.pushChanges();
    };

    window.addEventListener('online', handleOnline);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('online', handleOnline);
    };
  }
};
