
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Animal, Appointment, Tutor, Transaction, SOAPRecord, InventoryItem, 
  Tenant, PlanoType, User, UserRole, AppointStatus, VacinaRecord, Comanda,
  WorkflowItem, WorkflowStage
} from '../types';
import { MOCK_ANIMAIS, MOCK_TUTORES, MOCK_AGENDA, MOCK_TRANSACAOS, MOCK_ESTOQUE, MOCK_USER, MOCK_VACINAS, MOCK_COMANDAS, MOCK_WORKFLOW } from '../constants';
import { db, saveToLocal } from '../services/db';
import { syncService } from '../services/syncService';
import { checkConnection } from '../services/supabase';
import { generateUUID } from '../utils/security';

interface AppState {
  tenant: Tenant;
  currentUser: User | null;
  tutors: Tutor[];
  animals: Animal[];
  appointments: Appointment[];
  transactions: Transaction[];
  medicalRecords: SOAPRecord[];
  inventory: InventoryItem[];
  vacinas: VacinaRecord[];
  comandas: Comanda[];
  workflowItems: WorkflowItem[];
  lastSaved: Date | null;
  isOnline: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, pass: string, matricula?: string) => boolean;
  logout: () => void;
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: AppointStatus) => void;
  saveMedicalRecord: (record: Omit<SOAPRecord, 'id' | 'date'>) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addVacina: (vac: Omit<VacinaRecord, 'id'>) => Promise<void>;
  updateVacina: (vac: VacinaRecord) => Promise<void>;
  updateWorkflowItemStage: (id: string, stage: WorkflowStage) => void;
  isFeatureLocked: (feature: 'ANALYTICS' | 'MULTI_USER') => boolean;
  forceSave: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant] = useState<Tenant>({
    id: 't1', nome: 'Minha Clínica (Free)', cnpj: '00.000.000/0001-00', 
    plano: PlanoType.FREE, plan: PlanoType.FREE, maxUsers: 1, activeUsers: 1 
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('petinfocare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<SOAPRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vacinas, setVacinas] = useState<VacinaRecord[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let stopSync: (() => void) | undefined;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const init = async () => {
      const count = await db.animals.count();
      if (count === 0) {
        await db.tutors.bulkAdd(MOCK_TUTORES.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.animals.bulkAdd(MOCK_ANIMAIS.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.appointments.bulkAdd(MOCK_AGENDA.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.inventory.bulkAdd(MOCK_ESTOQUE.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.transactions.bulkAdd(MOCK_TRANSACAOS.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.vacinas.bulkAdd(MOCK_VACINAS.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.comandas.bulkAdd(MOCK_COMANDAS.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
        await db.workflowItems.bulkAdd(MOCK_WORKFLOW.map(i => ({...i, syncStatus: 'created', lastModified: Date.now()})));
      }
      refreshStateFromDb();
      
      const hasSupabase = await checkConnection();
      if (hasSupabase) {
        setIsOnline(true);
        stopSync = syncService.startAutoSync(tenant.id);
      }
    };
    
    init();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Retorna a função de limpeza
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (stopSync) {
        stopSync();
      }
    };
  }, [tenant.id]);

  const refreshStateFromDb = async () => {
    setTutors(await db.tutors.toArray());
    setAnimals(await db.animals.toArray());
    setAppointments(await db.appointments.toArray());
    setTransactions(await db.transactions.toArray());
    setMedicalRecords(await db.medicalRecords.toArray());
    setInventory(await db.inventory.toArray());
    setVacinas(await db.vacinas.toArray());
    setComandas(await db.comandas.toArray());
    setWorkflowItems(await db.workflowItems.toArray());
  };

  const login = (email: string, pass: string, matricula?: string) => {
    // Acesso Administrativo via Matrícula 01 (Solicitado)
    if (matricula === '01') {
      const adminUser: User = {
        id: 'admin-01',
        name: 'ADMIN',
        nome: 'ADMIN',
        email: email || 'admin@sistema.com',
        role: UserRole.ADMIN,
        unidadeId: 'u-1'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('petinfocare_user', JSON.stringify(adminUser));
      return true;
    }

    if (email && pass) {
      const user = { ...MOCK_USER, email };
      setCurrentUser(user);
      localStorage.setItem('petinfocare_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('petinfocare_user');
  };

  const addAppointment = async (apt: Omit<Appointment, 'id'>) => {
    const newApt = { ...apt, id: generateUUID() };
    // @ts-ignore
    await saveToLocal(db.appointments, newApt, 'created');
    refreshStateFromDb();
    setLastSaved(new Date());
  };

  const updateAppointmentStatus = async (id: string, status: AppointStatus) => {
    const apt = await db.appointments.get(id);
    if (apt) {
      const updated = { ...apt, status };
      await saveToLocal(db.appointments, updated, 'updated');
      refreshStateFromDb();
    }
  };

  const saveMedicalRecord = async (record: Omit<SOAPRecord, 'id' | 'date'>) => {
    try {
        const newRecord: SOAPRecord = {
          ...record,
          id: generateUUID(),
          date: new Date().toISOString()
        };
        await saveToLocal(db.medicalRecords, newRecord, 'created');
        if (record.appointmentId) {
          updateAppointmentStatus(record.appointmentId, AppointStatus.FINISHED);
        }
        refreshStateFromDb();
        setLastSaved(new Date());
    } catch (error) {
        console.error("Falha crítica ao salvar registro médico:", error);
        throw error;
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: generateUUID() };
    await saveToLocal(db.transactions, newTx, 'created');
    refreshStateFromDb();
  };

  const addVacina = async (vac: Omit<VacinaRecord, 'id'>) => {
    const newVac = { ...vac, id: generateUUID() };
    await saveToLocal(db.vacinas, newVac, 'created');
    refreshStateFromDb();
  };

  const updateVacina = async (vac: VacinaRecord) => {
    await saveToLocal(db.vacinas, vac, 'updated');
    refreshStateFromDb();
  };
  
  const updateWorkflowItemStage = async (id: string, stage: WorkflowStage) => {
    const item = await db.workflowItems.get(id);
    if (item) {
      const updated = { ...item, currentStage: stage };
      await saveToLocal(db.workflowItems, updated, 'updated');
      refreshStateFromDb();
    }
  };

  const isFeatureLocked = (feature: 'ANALYTICS' | 'MULTI_USER') => {
    // Se for ADMIN, libera tudo
    if (currentUser?.role === UserRole.ADMIN) return false;

    if (tenant.plano === PlanoType.ENTERPRISE) return false;
    if (tenant.plano === PlanoType.PRO && feature === 'ANALYTICS') return false;
    return true; 
  };

  return (
    <AppContext.Provider value={{
      tenant, currentUser, tutors, animals, appointments, transactions, medicalRecords, inventory, vacinas, comandas, workflowItems, lastSaved, isOnline,
      login, logout, addAppointment, updateAppointmentStatus, saveMedicalRecord, addTransaction, addVacina, updateVacina, updateWorkflowItemStage, isFeatureLocked, 
      forceSave: () => syncService.pushChanges()
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
