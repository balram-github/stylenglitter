module.exports = {
  apps: [
    {
      name: 'style-n-glitter-api',
      script: 'npm',
      args: 'run start:prod',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 