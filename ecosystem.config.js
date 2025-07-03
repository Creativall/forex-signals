module.exports = {
  apps: [
    {
      name: 'forex-signals-backend',
      script: './backend/index.js',
      cwd: '/var/www/forex-signals',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      max_memory_restart: '500M',
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: '5s'
    }
  ]
};
