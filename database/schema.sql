
-- ==================================================================================
-- PET INFOCARE - ESTRUTURA DE BANCO DE DADOS (PostgreSQL)
-- Arquitetura Multi-Tenant para SaaS Veterinário
-- ==================================================================================

-- 1. Habilitar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Tenants (Clínicas/Hospitais)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    matricula VARCHAR(50) UNIQUE NOT NULL, -- Ex: CLI-1020
    plano VARCHAR(50) DEFAULT 'FREE', -- FREE, PRO, ENTERPRISE
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED
    storage_used BIGINT DEFAULT 0,
    max_storage BIGINT DEFAULT 1073741824, -- 1GB Default
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Unidades (Filiais)
CREATE TABLE unidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Usuários (Veterinários, Recepção, Admin)
-- Nota: Em produção, sincronizar com auth.users do Supabase
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unidade_id UUID REFERENCES unidades(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ADMIN, VET, RECEPTION
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tutores (Clientes)
CREATE TABLE tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    saldo_fidelidade DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Animais (Pacientes)
CREATE TABLE animais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- Canina, Felina
    raca VARCHAR(100),
    sexo CHAR(1),
    nascimento DATE,
    peso_atual DECIMAL(5, 2),
    microchip VARCHAR(100),
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Estoque e Serviços
CREATE TABLE estoque (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unidade_id UUID REFERENCES unidades(id),
    nome VARCHAR(255) NOT NULL,
    sku VARCHAR(50),
    categoria VARCHAR(50), -- VACINA, MEDICAMENTO, SERVICO
    quantidade INT DEFAULT 0,
    minimo INT DEFAULT 5,
    valor_custo DECIMAL(10, 2),
    valor_venda DECIMAL(10, 2),
    validade DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Agenda (Compromissos)
CREATE TABLE agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unidade_id UUID REFERENCES unidades(id),
    vet_id UUID REFERENCES users(id),
    animal_id UUID REFERENCES animais(id),
    tutor_id UUID REFERENCES tutores(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo VARCHAR(50), -- Consulta, Vacina, Cirurgia
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, FINISHED
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Prontuário Médico (Estrutura Complexa com JSONB)
CREATE TABLE prontuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    animal_id UUID REFERENCES animais(id),
    vet_id UUID REFERENCES users(id),
    agenda_id UUID REFERENCES agenda(id),
    data_atendimento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Armazena o SOAP (Subjetivo, Objetivo, Avaliação, Plano) em JSON estruturado
    -- Permite flexibilidade para adicionar campos novos sem mudar o esquema
    soap_data JSONB NOT NULL DEFAULT '{}', 
    
    diagnostico TEXT,
    procedimentos JSONB, -- Array de procedimentos realizados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Financeiro (Transações)
CREATE TABLE financeiro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unidade_id UUID REFERENCES unidades(id),
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo VARCHAR(10) NOT NULL, -- INCOME, EXPENSE
    categoria VARCHAR(100),
    data_movimento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'PENDING', -- PAID, PENDING
    metodo_pagamento VARCHAR(50), -- CASH, CARD, PIX
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES DE PERFORMANCE (Complexidade Otimizada)
CREATE INDEX idx_animais_tutor ON animais(tutor_id);
CREATE INDEX idx_agenda_range ON agenda(unidade_id, start_time, end_time);
CREATE INDEX idx_prontuarios_animal ON prontuarios(animal_id);
CREATE INDEX idx_estoque_busca ON estoque(tenant_id, nome);
CREATE INDEX idx_financeiro_data ON financeiro(tenant_id, data_movimento);

-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- Garante que um Tenant não veja dados de outro Tenant
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE animais ENABLE ROW LEVEL SECURITY;
-- (Aplicar para todas as tabelas em produção)
