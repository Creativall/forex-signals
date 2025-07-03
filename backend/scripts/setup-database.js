require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuração da conexão
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    // Ler o arquivo de schema
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Executando script de schema...');
    
    // Executar o schema
    await client.query(schema);
    
    console.log('✅ Schema executado com sucesso!');
    
    // Verificar se as tabelas foram criadas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'verification_tokens')
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas criadas:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Verificar estrutura da tabela users
    const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Estrutura da tabela users:');
    usersColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Verificar estrutura da tabela verification_tokens
    const tokensColumns = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'verification_tokens' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Estrutura da tabela verification_tokens:');
    tokensColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Inserir dados de teste (opcional)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Inserindo dados de teste...');
      
      // Verificar se já existem usuários
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      
      if (parseInt(userCount.rows[0].count) === 0) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        await client.query(`
          INSERT INTO users (name, email, password, verified) 
          VALUES ($1, $2, $3, $4)
        `, ['Usuário Teste', 'teste@email.com', hashedPassword, true]);
        
        console.log('✅ Usuário de teste criado: teste@email.com / 123456');
      } else {
        console.log('ℹ️ Usuários já existem, pulando criação de dados de teste');
      }
    }
    
    console.log('🎉 Configuração do banco de dados concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para verificar conexão
async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
    }
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version()');
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('🕒 Hora do servidor:', result.rows[0].current_time);
    console.log('🗄️ Versão do PostgreSQL:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    return false;
  }
}

// Executar setup
async function run() {
  try {
    // Verificar variáveis de ambiente
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não encontrada no arquivo .env');
      console.log('💡 Copie o arquivo env.example para .env e configure suas credenciais');
      process.exit(1);
    }
    
    // Testar conexão primeiro
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      console.log('💡 Verifique suas credenciais do Supabase no arquivo .env');
      process.exit(1);
    }
    
    // Configurar banco
    await setupDatabase();
    
    console.log('✨ Setup completo! Você pode agora iniciar o servidor com: npm start');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  run();
}

module.exports = { setupDatabase, testConnection }; 