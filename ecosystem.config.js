module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/server.js',
      instances: 0,
      exec_mode: 'cluster',
    },
  ],
};
