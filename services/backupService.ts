
import { db } from './db';

/**
 * SERVIÇO DE REDUNDÂNCIA E BACKUP DE SISTEMA
 * 
 * Gera um pacote completo (.json) contendo:
 * 1. Dados estruturados do IndexedDB (Pacientes, Financeiro, etc)
 * 2. Configurações do LocalStorage (Sessão, Preferências)
 * 
 * Formato otimizado para importação/restauração em nova instância.
 */

export const backupService = {
  createFullBackup: async () => {
    try {
      // 1. Coleta dados do Banco de Dados
      const dbData = {
        animals: await db.animals.toArray(),
        tutors: await db.tutors.toArray(),
        appointments: await db.appointments.toArray(),
        medicalRecords: await db.medicalRecords.toArray(),
        transactions: await db.transactions.toArray(),
        inventory: await db.inventory.toArray(),
        users: await db.users.toArray(),
        tenants: await db.tenants.toArray(),
      };

      // 2. Coleta dados do LocalStorage (Configurações e Cache)
      const localStoreData: Record<string, string | null> = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pet_infocare_')) {
            localStoreData[key] = localStorage.getItem(key);
        }
      });

      // 3. Monta o Pacote
      const backupPackage = {
        metadata: {
            system: "Pet InfoCare",
            version: "2.5.0",
            timestamp: new Date().toISOString(),
            exportedBy: "System Backup Service",
            type: "FULL_DUMP"
        },
        database: dbData,
        settings: localStoreData
      };

      // 4. Gera o Arquivo para Download
      const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      // Nome do arquivo com timestamp para organização
      a.download = `PET_INFOCARE_FULL_BACKUP_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.info("[Backup] Download completo iniciado com sucesso.");
      return true;
    } catch (error) {
      console.error("[Backup] Falha crítica ao gerar backup completo:", error);
      alert("Erro ao gerar backup. Verifique o console para detalhes.");
      return false;
    }
  }
};
