
import { 
  UserRole, Tenant, Unidade, User, Tutor, Animal, Appointment, AppointStatus, 
  InventoryItem, Transaction, BedStatus, EstoqueCategoria, PlanoType, WorkflowStage, 
  WorkflowItem, VacinaRecord, Bed, Internamento, SurgeryQueueItem, 
  TenantStatus, Comanda
} from './types';

export const MOCK_TENANT: Tenant = {
  id: 't-1',
  nome: 'Pet InfoCare Social',
  cnpj: '12.345.678/0001-90',
  plano: PlanoType.COMMUNITY,
  plan: PlanoType.COMMUNITY,
  matricula: 'SOC-2024',
  status: TenantStatus.ACTIVE,
  createdAt: '2023-01-01T00:00:00Z',
  storageUsed: 250 * 1024 * 1024,
  maxStorage: 5 * 1024 * 1024 * 1024
};

export const MOCK_UNIDADES: Unidade[] = [
  { id: 'u-1', tenantId: 't-1', nome: 'Unidade Popular Centro', endereco: 'Rua dos Veterinários, 100' },
  { id: 'u-2', tenantId: 't-1', nome: 'Posto de Vacinação Zona Sul', endereco: 'Av. Cidadania, 500' }
];

export const MOCK_USER: User = {
  id: 'usr-1',
  email: 'vet@infocaresocial.com.br',
  nome: 'Dr. Lucas Amorim',
  name: 'Dr. Lucas Amorim',
  role: UserRole.VET,
  unidadeId: 'u-1'
};

export const MOCK_TUTORES: Tutor[] = [
  { id: 'tut-1', nome: 'Ana Clara Souza', cpf: '123.456.789-00', email: 'ana.clara@gmail.com', telefone: '(11) 99999-1111', saldo_fidelidade: 20, limiteCredito: 500 },
  { id: 'tut-2', nome: 'Carlos Eduardo', cpf: '234.567.890-11', email: 'carlos.edu@hotmail.com', telefone: '(11) 98888-2222', saldo_fidelidade: 50, limiteCredito: 1000 },
  { id: 'tut-3', nome: 'Dona Maria de Lurdes', cpf: '345.678.901-22', email: 'filha.maria@gmail.com', telefone: '(11) 97777-3333', saldo_fidelidade: 100, limiteCredito: 300 },
  { id: 'tut-4', nome: 'Pedro Henrique', cpf: '456.789.012-33', email: 'pedro.h@uol.com.br', telefone: '(11) 96666-4444', saldo_fidelidade: 0, limiteCredito: 800 },
  { id: 'tut-5', nome: 'Juliana Paes', cpf: '567.890.123-44', email: 'ju.paes@terra.com.br', telefone: '(11) 95555-5555', saldo_fidelidade: 10, limiteCredito: 1500 }
];

export const MOCK_ANIMAIS: Animal[] = [
  { id: 'ani-1', tutorId: 'tut-1', matricula: 'PET-001', nome: 'Thor', especie: 'Canina', raca: 'SRD (Vira-lata)', peso: 15.5, pesoAtual: 15.5, idade: '5 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a79o7e9de1?w=400', temperamento: 'Dócil' },
  { id: 'ani-2', tutorId: 'tut-2', matricula: 'PET-002', nome: 'Luna', especie: 'Felina', raca: 'Siamês', peso: 3.2, pesoAtual: 3.2, idade: '2 anos', sexo: 'F', fotoUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400', temperamento: 'Arisco' },
  { id: 'ani-3', tutorId: 'tut-3', matricula: 'PET-003', nome: 'Paçoca', especie: 'Canina', raca: 'Poodle', peso: 6.0, pesoAtual: 6.0, idade: '10 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400', temperamento: 'Idoso' },
  { id: 'ani-4', tutorId: 'tut-1', matricula: 'PET-004', nome: 'Mel', especie: 'Canina', raca: 'Golden Retriever', peso: 28.0, pesoAtual: 28.0, idade: '1 ano', sexo: 'F', fotoUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', temperamento: 'Agitado' },
  { id: 'ani-5', tutorId: 'tut-4', matricula: 'PET-005', nome: 'Garfield', especie: 'Felina', raca: 'Persa', peso: 5.5, pesoAtual: 5.5, idade: '4 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', temperamento: 'Preguiçoso' },
  { id: 'ani-6', tutorId: 'tut-5', matricula: 'PET-006', nome: 'Simba', especie: 'Canina', raca: 'Labrador', peso: 32.0, pesoAtual: 32.0, idade: '3 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?w=400', temperamento: 'Dócil' },
  { id: 'ani-7', tutorId: 'tut-3', matricula: 'PET-007', nome: 'Mingau', especie: 'Felina', raca: 'SRD', peso: 4.0, pesoAtual: 4.0, idade: '3 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', temperamento: 'Carinhoso' },
  { id: 'ani-8', tutorId: 'tut-2', matricula: 'PET-008', nome: 'Frajola', especie: 'Felina', raca: 'Frajola', peso: 5.0, pesoAtual: 5.0, idade: '5 anos', sexo: 'M', fotoUrl: 'https://images.unsplash.com/photo-1520315342629-6ea920342047?w=400', temperamento: 'Brincalhão' }
];

export const MOCK_AGENDA: Appointment[] = [
  { id: 'apt-1', animalId: 'ani-1', tutorId: 'tut-1', vetId: 'usr-1', startTime: new Date().toISOString(), endTime: new Date(new Date().getTime() + 3600000).toISOString(), type: 'Consulta', status: AppointStatus.PENDING },
  { id: 'apt-2', animalId: 'ani-2', tutorId: 'tut-2', vetId: 'usr-1', startTime: new Date(new Date().getTime() + 7200000).toISOString(), endTime: new Date(new Date().getTime() + 10800000).toISOString(), type: 'Retorno', status: AppointStatus.CONFIRMED },
  { id: 'apt-3', animalId: 'ani-3', tutorId: 'tut-3', vetId: 'usr-1', startTime: new Date(new Date().getTime() + 10800000).toISOString(), endTime: new Date(new Date().getTime() + 14400000).toISOString(), type: 'Vacina', status: AppointStatus.FINISHED },
];

export const MOCK_ESTOQUE: InventoryItem[] = [
    { id: 'item-1', name: 'Vacina V10', nome: 'Vacina V10', sku: 'VAC-V10', category: 'Vacinas', categoria: EstoqueCategoria.VACINA, quantity: 50, quantidade: 50, minQuantity: 10, minimo: 10, costPrice: 25.0, valorCusto: 25.0, salePrice: 80.0, valorVenda: 80.0, expiryDate: '2025-12-31', validade: '2025-12-31', unidadeMedida: 'dose' },
    { id: 'item-2', name: 'Consulta Geral', nome: 'Consulta Geral', sku: 'SERV-001', category: 'Serviços', categoria: EstoqueCategoria.SERVICO, quantity: 9999, quantidade: 9999, minQuantity: 0, minimo: 0, costPrice: 0, valorCusto: 0, salePrice: 150.0, valorVenda: 150.0, expiryDate: '2099-12-31', validade: '2099-12-31', unidadeMedida: 'un' },
    { id: 'item-3', name: 'Dipirona Gotas', nome: 'Dipirona Gotas', sku: 'MED-001', category: 'Medicamentos', categoria: EstoqueCategoria.MEDICAMENTO, quantity: 20, quantidade: 20, minQuantity: 5, minimo: 5, costPrice: 5.0, valorCusto: 5.0, salePrice: 15.0, valorVenda: 15.0, expiryDate: '2024-10-10', validade: '2024-10-10', unidadeMedida: 'frasco' },
];

export const MOCK_TRANSACAOS: Transaction[] = [
    { id: 'tx-1', description: 'Venda de Balcão #102', amount: 150.00, type: 'INCOME', category: 'Vendas', date: new Date().toISOString(), status: 'PAID' },
    { id: 'tx-2', description: 'Conta de Energia', amount: 350.00, type: 'EXPENSE', category: 'Despesas Fixas', date: new Date().toISOString(), status: 'PENDING' },
];

export const MOCK_COMANDAS: Comanda[] = [
  { id: 'com-1', numero: 19347, animalId: 'ani-1', tutorId: 'tut-1', status: 'FECHADA', dataAbertura: '2026-01-29T15:38:00', dataFechamento: '2026-01-29T16:24:00', total: 150.00 },
  { id: 'com-2', numero: 19348, animalId: 'ani-2', tutorId: 'tut-2', status: 'ABERTA', dataAbertura: '2026-01-29T16:00:00', dataFechamento: null, total: 85.00 },
];

export const MOCK_BEDS: Bed[] = [
    { id: 'bed-1', name: 'Canil 01', type: 'Canil', status: BedStatus.OCCUPIED },
    { id: 'bed-2', name: 'Canil 02', type: 'Canil', status: BedStatus.AVAILABLE },
    { id: 'bed-3', name: 'Gatil 01', type: 'Gatil', status: BedStatus.AVAILABLE },
];

export const MOCK_INTERNAMENTOS: Internamento[] = [
    {
        id: 'int-1',
        animalId: 'ani-1',
        bedId: 'bed-1',
        status: 'ACTIVE',
        entryDate: new Date().toISOString(),
        reason: 'Gastroenterite',
        medicacoes: [
            { id: 'med-1', nome: 'Dipirona', dosagem: '1ml', horario: '08:00', status: 'ADMINISTERED' },
            { id: 'med-2', nome: 'Ondansetrona', dosagem: '0.5ml', horario: '14:00', status: 'PENDING' },
        ],
        evolucoes: []
    }
];

export const MOCK_SURGERIES: SurgeryQueueItem[] = [
    {
        id: 'surg-1',
        animalId: 'ani-4',
        procedure: 'Ovariohisterectomia (Castração)',
        vet: 'Dr. Lucas',
        anesthesist: 'Dra. Ana',
        status: 'IN_SURGERY',
        room: 'Sala 1',
        date: new Date().toISOString(),
        surgicalRecord: undefined
    }
];

export const MOCK_WORKFLOW: WorkflowItem[] = [
    { id: 'wf-1', animalId: 'ani-5', unidadeId: 'u-1', currentStage: WorkflowStage.TRIAGE, startTime: new Date().toISOString(), priority: 'MEDIUM' },
    { id: 'wf-2', animalId: 'ani-6', unidadeId: 'u-1', currentStage: WorkflowStage.RECEPTION, startTime: new Date().toISOString(), priority: 'LOW' },
];

export const MOCK_VACINAS: VacinaRecord[] = [
    { id: 'vac-1', animalId: 'ani-1', nome: 'V10', dataPrevista: '2023-10-15', status: 'OVERDUE' },
    { id: 'vac-2', animalId: 'ani-4', nome: 'Antirrábica', dataPrevista: '2024-05-20', status: 'PENDING' },
];
