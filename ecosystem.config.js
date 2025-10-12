module.exports = {
  apps: [
    {
      name: 'tasktool-api',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
