-- =====================================================
-- SCRIPT PARA CRIAR TABELAS NO SUPABASE
-- Execute este SQL no painel do Supabase
-- =====================================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE TOKENS DE VERIFICAÇÃO
-- =====================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE SINAIS FOREX
-- =====================================================
CREATE TABLE IF NOT EXISTS forex_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pair VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('CALL', 'PUT')),
  timeframe VARCHAR(10) NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  expiration_time TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(10,2),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  result VARCHAR(10) DEFAULT 'PENDING' CHECK (result IN ('WIN', 'LOSS', 'PENDING')),
  profit_loss DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_used ON verification_tokens(used);

-- Índices para forex_signals
CREATE INDEX IF NOT EXISTS idx_forex_signals_user_id ON forex_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_forex_signals_created_at ON forex_signals(created_at);
CREATE INDEX IF NOT EXISTS idx_forex_signals_entry_time ON forex_signals(entry_time);
CREATE INDEX IF NOT EXISTS idx_forex_signals_result ON forex_signals(result);
CREATE INDEX IF NOT EXISTS idx_forex_signals_pair ON forex_signals(pair);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS PARA updated_at
-- =====================================================
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forex_signals_updated_at 
    BEFORE UPDATE ON forex_signals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERIR USUÁRIO DE TESTE
-- =====================================================
INSERT INTO users (name, email, password, verified) VALUES 
('Usuário Teste', 'mrochafeitosa@gmail.com', '$2b$10$exemplo', true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'verification_tokens', 'forex_signals'); 