
/**
 * PET INFOCARE - CONFIGURAÇÃO DE INFRAESTRUTURA LOCAL (OPEN SOURCE)
 * 
 * Este arquivo define os pontos de integração com o banco de dados e backend.
 * O sistema é projetado para rodar em ambientes Linux (Ubuntu/Debian/Alpine) com Docker.
 */

export const DATABASE_CONFIG = {
  driver: 'PostgreSQL', // Recomendado para produção Open Source
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'pet_infocare_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  
  // Compatível com Docker Compose
};

export const API_ENDPOINTS = {
  // Backend agnóstico (Node.js, Python, Go, PHP) rodando em container
  baseUrl: process.env.API_URL || 'http://localhost:3000/api/v1',
  
  // SETORES DE SINCRONIZAÇÃO
  syncInventory: '/inventory/sync',
  authLogin: '/auth/login',
  registerVet: '/vets/register',
  saveMedicalRecord: '/records/save'
};

/**
 * REGRAS DE ARMAZENAMENTO (LINUX/S3):
 * - Em produção, utilize montagem de volumes Docker em /var/lib/petinfocare/uploads
 * - Ou configure um bucket compatível com S3 (MinIO) para armazenamento de objetos.
 */
