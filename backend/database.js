require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL não está definida no arquivo .env');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY não está definida no arquivo .env');
  process.exit(1);
}

console.log('✅ Variáveis Supabase carregadas com sucesso');
console.log('🔗 URL:', supabaseUrl);

// Configuração do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
const testConnection = async () => {
  try {
    // Testar conexão com uma query simples
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(0);
    
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // PGRST116 = tabela não encontrada
      // 42P01 = relation "users" does not exist
      throw error;
    }
    
    console.log('✅ Conectado ao Supabase com sucesso!');
    console.log('🕒 URL do projeto:', supabaseUrl);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error.message);
    return false;
  }
};

// Função para executar queries SQL raw (quando necessário)
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    // Para queries SQL raw, usamos rpc se disponível
    const { data, error } = await supabase.rpc('execute_sql', {
      query: text,
      parameters: params
    });
    
    const duration = Date.now() - start;
    
    if (error) {
      throw error;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Query executada:', { text: text.substring(0, 50) + '...', duration, rows: data?.length || 0 });
    }
    
    return { rows: data || [] };
  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    throw error;
  }
};

// Função para obter o cliente Supabase
const getClient = async () => {
  return supabase;
};

// Função de cleanup (não necessária para Supabase)
const closePool = async () => {
  console.log('🔒 Conexão Supabase finalizada');
};

// Função para inicializar o banco de dados
const initializeDatabase = async () => {
  try {
    console.log('🚀 Inicializando banco de dados...');
    
    // Verificar se as tabelas existem usando uma abordagem mais simples
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'verification_tokens']);
    
    if (error) {
      console.log('⚠️ Não foi possível verificar tabelas existentes. Isso é normal se as tabelas ainda não foram criadas.');
      console.log('💡 Vamos tentar criar as tabelas...');
      await createTables();
    } else if (!tables || tables.length === 0) {
      console.log('⚠️ Tabelas não encontradas. Criando tabelas...');
      await createTables();
    } else {
      console.log('✅ Tabelas do banco de dados encontradas:', tables.map(r => r.table_name));
    }
    
    return true;
  } catch (error) {
    console.log('ℹ️ Erro ao verificar tabelas (isso é normal na primeira execução):', error.message);
    console.log('💡 Tentando criar tabelas...');
    await createTables();
    return true;
  }
};

// Função para criar tabelas usando SQL direto
const createTables = async () => {
  try {
    console.log('📝 Criando tabelas do banco de dados...');
    
    // Tentar criar as tabelas usando SQL direto
    // Nota: Como estamos usando chaves anônimas, não podemos criar tabelas
    // As tabelas precisam ser criadas no painel do Supabase
    console.log('ℹ️ Para criar as tabelas, acesse o painel do Supabase em:');
    console.log('🌐 https://supabase.com/dashboard/project/gjfdtrmxinexrgxwixam');
    console.log('📝 E execute o seguinte SQL no SQL Editor:');
    console.log(`
-- Tabela de usuários
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

-- Tabela de tokens de verificação
CREATE TABLE IF NOT EXISTS verification_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  user_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);
    `);
    
    console.log('✅ Instruções para criação de tabelas exibidas!');
    
  } catch (error) {
    console.log('ℹ️ Tabelas serão criadas quando necessário:', error.message);
  }
};

// Funções de conveniência para o Supabase
const supabaseClient = () => supabase;

module.exports = {
  pool: null, // Mantido para compatibilidade
  query,
  getClient,
  testConnection,
  closePool,
  initializeDatabase,
  supabase,
  supabaseClient
}; 