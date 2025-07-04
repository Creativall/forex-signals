-- =====================================================
-- SETUP COMPLETO DO BANCO DE DADOS - FOREX SIGNALS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/gjfdtrmxinexrgxwixam

-- =====================================================
-- 1. TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. TABELA DE TOKENS DE VERIFICAÇÃO
-- =====================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  user_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TABELA DE SINAIS DE FOREX
-- =====================================================
CREATE TABLE IF NOT EXISTS forex_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair VARCHAR(10) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('CALL', 'PUT')),
  entry_time TIMESTAMP NOT NULL,
  expiry_time TIMESTAMP NOT NULL,
  entry_value DECIMAL(10,5),
  result VARCHAR(10) DEFAULT 'PENDING' CHECK (result IN ('WIN', 'LOSS', 'PENDING')),
  payout DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TABELA DE TRANSAÇÕES FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'PROFIT', 'LOSS', 'BONUS')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. TABELA DE CONFIGURAÇÕES DO USUÁRIO
-- =====================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  notifications BOOLEAN DEFAULT TRUE,
  language VARCHAR(5) DEFAULT 'pt-BR',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  risk_level VARCHAR(10) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  auto_signals BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================

-- Índices para tabela users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);

-- Índices para tabela verification_tokens
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);

-- Índices para tabela forex_signals
CREATE INDEX IF NOT EXISTS idx_forex_signals_pair ON forex_signals(pair);
CREATE INDEX IF NOT EXISTS idx_forex_signals_entry_time ON forex_signals(entry_time);
CREATE INDEX IF NOT EXISTS idx_forex_signals_result ON forex_signals(result);
CREATE INDEX IF NOT EXISTS idx_forex_signals_direction ON forex_signals(direction);
CREATE INDEX IF NOT EXISTS idx_forex_signals_created_at ON forex_signals(created_at);

-- Índices para tabela transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Índices para tabela user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- =====================================================
-- 7. FUNCTIONS E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forex_signals_updated_at BEFORE UPDATE ON forex_signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. INSERIR USUÁRIO DE TESTE
-- =====================================================
INSERT INTO users (name, email, password, verified) 
VALUES (
  'Usuário Teste', 
  'mrochafeitosa@gmail.com', 
  '$2b$10$RAvibzz1Fm2P/FYA1EDN7ua/qrJtJTQWFxGKywCXSHZIw9saVOyza', -- Senha: 123456789
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 9. INSERIR CONFIGURAÇÕES PADRÃO PARA O USUÁRIO
-- =====================================================
INSERT INTO user_settings (user_id, theme, notifications, language, auto_signals)
SELECT id, 'dark', TRUE, 'pt-BR', TRUE
FROM users 
WHERE email = 'mrochafeitosa@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- 10. INSERIR ALGUNS SINAIS DE EXEMPLO
-- =====================================================
INSERT INTO forex_signals (pair, direction, entry_time, expiry_time, entry_value, result, payout)
VALUES 
  ('EURUSD', 'CALL', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '56 minutes', 1.0850, 'WIN', 85.00),
  ('GBPUSD', 'PUT', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '116 minutes', 1.2650, 'LOSS', 0.00),
  ('USDJPY', 'CALL', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '5 minutes', 150.25, 'PENDING', NULL),
  ('AUDUSD', 'PUT', NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '20 minutes', 0.6750, 'PENDING', NULL),
  ('USDCAD', 'CALL', NOW() + INTERVAL '30 minutes', NOW() + INTERVAL '35 minutes', 1.3550, 'PENDING', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 11. INSERIR TRANSAÇÕES DE EXEMPLO
-- =====================================================
INSERT INTO transactions (user_id, type, amount, description)
SELECT 
  u.id,
  'DEPOSIT',
  1000.00,
  'Depósito inicial'
FROM users u
WHERE u.email = 'mrochafeitosa@gmail.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO transactions (user_id, type, amount, description)
SELECT 
  u.id,
  'PROFIT',
  85.00,
  'Lucro do sinal EURUSD CALL'
FROM users u
WHERE u.email = 'mrochafeitosa@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 12. VERIFICAR SE TUDO FOI CRIADO CORRETAMENTE
-- =====================================================
SELECT 'SETUP COMPLETO!' as status;

-- Verificar tabelas criadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar índices criados
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar dados inseridos
SELECT 'Usuários:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Sinais:', COUNT(*) FROM forex_signals
UNION ALL
SELECT 'Transações:', COUNT(*) FROM transactions
UNION ALL
SELECT 'Configurações:', COUNT(*) FROM user_settings; 