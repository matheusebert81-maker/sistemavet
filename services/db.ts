
import Dexie, { Table } from 'dexie';
import { Animal, Tutor, Appointment, SOAPRecord, Transaction, InventoryItem, User, Tenant } from '../types';

// Definição estendida para suportar controle de sincronização
export interface SyncMetadata {
  syncStatus: 'synced' | 'created' | 'updated' | 'deleted';
  lastModified: number;
}

export type Local<T> = T & SyncMetadata;

class PetInfoDatabase extends Dexie {
  tenants!: Table<Local<Tenant>>;
  users!: Table<Local<User>>;
  tutors!: Table<Local<Tutor>>;
  animals!: Table<Local<Animal>>;
  appointments!: Table<Local<Appointment>>;
  medicalRecords!: Table<Local<SOAPRecord>>;
  inventory!: Table<Local<InventoryItem>>;
  transactions!: Table<Local<Transaction>>;

  constructor() {
    super('PetInfoCareDB');
    
    // Definição dos índices (Primary Key e índices de busca)
    this.version(1).stores({
      tenants: 'id, syncStatus',
      users: 'id, email, syncStatus',
      tutors: 'id, nome, cpf, syncStatus',
      animals: 'id, tutorId, nome, syncStatus',
      appointments: 'id, date, status, syncStatus',
      medicalRecords: 'id, animalId, date, syncStatus',
      inventory: 'id, nome, category, syncStatus',
      transactions: 'id, date, type, syncStatus'
    });
  }
}

export const db = new PetInfoDatabase();

// Helper para marcar dados para sincronização
export const saveToLocal = async <T extends { id: string }>(
  table: Table<Local<T>>, 
  data: T, 
  status: 'created' | 'updated' = 'updated'
) => {
  const existing = await table.get(data.id);
  
  // Se já existe e está pendente de criação, mantemos como 'created'
  // Se já existe e estava 'synced', vira 'updated'
  let newStatus = status;
  if (existing && existing.syncStatus === 'created') {
    newStatus = 'created';
  }

  await table.put({
    ...data,
    syncStatus: newStatus,
    lastModified: Date.now()
  });
};
