
export enum UserRole {
  ADMIN = 'ADMIN',
  VET = 'VET',
  AUX = 'AUX',
  RECEPTION = 'RECEPTION'
}

export enum PlanoType {
  FREE = 'FREE',       
  PRO = 'PRO',         
  ENTERPRISE = 'ENTERPRISE',
  COMMUNITY = 'COMMUNITY',
  CLOUD = 'CLOUD',
  CLOUD_START = 'CLOUD_START'
}
// Alias para compatibilidade retroativa e para corresponder a usos anteriores
export const PlanTier = PlanoType;
export type PlanTier = PlanoType;

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL'
}

export interface Tenant {
  id: string;
  nome: string;
  cnpj: string;
  plan: PlanoType; // Contexto usa 'plan'
  plano: PlanoType; // Constantes/Admin usam 'plano'
  maxUsers?: number;
  activeUsers?: number;
  matricula?: string;
  status?: TenantStatus;
  createdAt?: string;
  storageUsed?: number;
  maxStorage?: number;
  domain?: string;
  adminEmail?: string;
}

export interface Unidade {
  id: string;
  tenantId: string;
  nome: string;
  endereco: string;
}

// --- TIPOS CLÍNICOS PRINCIPAIS ---

export enum AppointStatus { 
  PENDING = 'PENDING', 
  CONFIRMED = 'CONFIRMED', 
  IN_PROGRESS = 'IN_PROGRESS', 
  FINISHED = 'FINISHED', 
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED'
}

export enum PaymentMethod { 
  CASH = 'CASH', 
  CARD = 'CARD', 
  PIX = 'PIX', 
  CREDIT_BOOK = 'CREDIT_BOOK' 
}

export interface User {
  id: string;
  name: string; // Contexto usa 'name'
  nome: string; // Constantes usam 'nome'
  email: string;
  role: UserRole;
  avatar?: string;
  unidadeId?: string;
}

export interface Tutor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco?: string;
  saldo_fidelidade?: number;
  limiteCredito?: number;
}

export interface Animal {
  id: string;
  tutorId: string;
  matricula?: string;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: number;
  pesoAtual?: number;
  sexo: 'M' | 'F';
  fotoUrl?: string;
  pelagem?: string;
  microchip?: string;
  temperamento?: string;
  nascimento?: string;
}

export interface Appointment {
  id: string;
  animalId: string;
  tutorId: string;
  vetId: string;
  unidadeId?: string;
  startTime: string; // String ISO
  endTime: string;
  type: string;
  status: AppointStatus;
  notes?: string;
}

export interface SOAPRecord {
  id: string;
  appointmentId: string;
  animalId: string;
  vetId: string;
  date: string;
  subjective: string; // Queixa (S)
  objective: string;  // Exame Físico (O)
  assessment: string; // Suspeita/Diagnóstico (A)
  plan: string;       // Prescrição/Tratamento (P)
  anamnese?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  animalId: string;
  vetId: string;
  date: string;
  soap: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
      anamnese?: string;
  };
  diagnosis?: string;
  procedimentos?: string[];
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  description: string;
  descricao?: string; // Alias (Apelido)
  amount: number;
  valor?: number; // Alias
  type: 'INCOME' | 'EXPENSE';
  tipo?: 'receita' | 'despesa'; // Alias
  category: string;
  categoria?: string; // Alias
  date: string;
  data?: string; // Alias
  status: 'PAID' | 'PENDING' | 'PAGO';
  paymentMethod?: PaymentMethod;
  unidadeId?: string;
}
// Alias
export type Transacao = Transaction;

export interface Comanda {
  id: string;
  numero: number;
  animalId: string;
  tutorId: string;
  status: 'ABERTA' | 'FECHADA';
  dataAbertura: string;
  dataFechamento: string | null;
  total: number;
}

export enum EstoqueCategoria {
  VACINA = 'VACINA',
  MEDICAMENTO = 'MEDICAMENTO',
  REVENDA = 'REVENDA',
  SERVICO = 'SERVICO',
  CIRURGIA = 'CIRURGIA',
  PROCEDIMENTO = 'PROCEDIMENTO',
  INS_CLINICO = 'INS_CLINICO'
}

export interface InventoryItem {
  id: string;
  unidadeId?: string;
  name: string;
  nome: string; // Alias
  sku: string;
  category: string;
  categoria?: EstoqueCategoria; // Alias
  quantity: number;
  quantidade?: number; // Alias
  minQuantity: number;
  minimo?: number; // Alias
  costPrice: number;
  valorCusto?: number; // Alias
  salePrice: number;
  valorVenda?: number; // Alias
  expiryDate: string;
  validade?: string; // Alias
  unidadeMedida?: string;
  codigo?: string;
  estoqueInicial?: string;
  precoVenda?: string;
  custo?: string;
}
export type EstoqueItem = InventoryItem;

// Internação
export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Bed {
  id: string;
  name: string;
  type: string;
  status: BedStatus;
}

export interface MedicationRecord {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  status: string;
}

export interface InternmentEvolution {
  id: string;
  date: string;
  description: string;
  vetId: string;
}

export interface Internamento {
  id: string;
  animalId: string;
  bedId: string;
  status: string;
  entryDate: string;
  reason: string;
  medicacoes: MedicationRecord[];
  evolucoes: InternmentEvolution[];
}

// Vacinas
export interface VacinaRecord {
  id: string;
  animalId: string;
  nome: string;
  dataPrevista: string;
  status: 'PENDING' | 'DONE' | 'OVERDUE';
}

// Fluxo de Trabalho (Workflow)
export enum WorkflowStage {
  RECEPTION = 'RECEPTION',
  TRIAGE = 'TRIAGE',
  CONSULTATION = 'CONSULTATION',
  EXAMS = 'EXAMS',
  CHECKOUT = 'CHECKOUT'
}

export interface WorkflowItem {
  id: string;
  animalId: string;
  unidadeId: string;
  currentStage: WorkflowStage;
  startTime: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Cirurgia
export enum ASAScore {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
  E = 'E'
}

export interface SurgicalRecord {
  id: string;
  surgeryId: string;
  asa: ASAScore;
  preOp?: {
    jejumHoras: number;
    examesPreCheck: boolean;
    tricotomia: boolean;
    acessoVenoso: string;
    observacoes: string;
  };
  intraOp?: {
    inicioAnestesia: string;
    inicioCirurgia: string;
    fimCirurgia: string;
    fimAnestesia: string;
    complicacoes: string;
    sangramentoEstimadoML: number;
  };
  monitoramento?: Array<{
    fc: string;
    spo2: string;
    pas: string;
    pad: string;
    temp: string;
  }>;
  posOp?: {
    instrucoes: string;
    antibiotico: string;
    analgesia: string;
    retornoDias: number;
  };
}

export interface SurgeryQueueItem {
  id: string;
  animalId: string;
  procedure: string;
  vet: string;
  anesthesist: string;
  status: 'IN_SURGERY' | 'RECOVERY' | 'FINISHED' | 'WAITING';
  room: string;
  date: string;
  surgicalRecord?: SurgicalRecord;
}

// Logs de Auditoria
export enum LogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export interface AuditLog {
  id: string;
  branchId: string;
  userId: string;
  action: LogAction;
  resource: string;
  targetId: string;
  oldData?: any;
  newData?: any;
  reason?: string;
  createdAt: string;
}
