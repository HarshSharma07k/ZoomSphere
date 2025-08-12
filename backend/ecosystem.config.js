export const config = {
  apps: [
    {
      name: 'ZoomSphere',
      script: './src/index.js',
      node_args: "-r dotenv/config",
      watch: false,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};