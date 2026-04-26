// pm2 进程守护配置文件
// 启动命令: pm2 start ecosystem.config.js

module.exports = {
  apps: [{
    name: 'prompthub',
    script: '.next/standalone/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    merge_logs: true,
    restart_delay: 4000,
    min_uptime: '10s',
    max_restarts: 10,
  }]
};
