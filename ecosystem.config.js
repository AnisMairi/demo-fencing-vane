// Configuration PM2 pour le déploiement
module.exports = {
  apps: [
    {
      name: 'demo-fencing-vane',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/demo-fencing-vane',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/demo-fencing-vane-error.log',
      out_file: '/var/log/pm2/demo-fencing-vane-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
}

