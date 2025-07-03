// Configuração de banco de dados
// Para testes: SQLite em memória
// Para produção: PostgreSQL

const config = {
  // Configuração atual (SQLite para testes)
  current: {
    type: 'sqlite',
    database: ':memory:', // Banco em memória para testes
    options: {
      verbose: true
    }
  },
  
  // Configuração para PostgreSQL (futuro)
  postgres: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'indicacoesforex',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    options: {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
};

module.exports = config; 