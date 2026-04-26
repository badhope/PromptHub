# PromptHub 服务器部署指南

## 🚀 部署方式概览

| 部署方式 | 适用场景 | 复杂度 | 推荐指数 |
|---------|---------|--------|---------|
| Docker 部署 | 生产服务器 | 低 | ⭐⭐⭐⭐⭐ |
| Node.js 直接运行 | 开发/小型服务器 | 低 | ⭐⭐⭐ |
| Nginx 静态文件 | CDN/静态托管 | 最低 | ⭐⭐⭐⭐ |

---

## 🐳 Docker 部署 (推荐)

### 前置要求
- 服务器已安装 Docker & Docker Compose
- 服务器配置：最低 2C4G，推荐 4C8G

### 一键部署命令

```bash
# 1. 克隆代码
git clone https://github.com/your-username/PromptHub.git
cd PromptHub/web

# 2. 构建并启动
docker-compose up -d --build

# 3. 查看运行状态
docker-compose ps
docker-compose logs -f
```

### 常用 Docker 命令

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f prompthub-web

# 更新版本
git pull
docker-compose up -d --build
```

---

## 📦 Node.js 原生部署

### 前置要求
- Node.js 20.x 或更高版本
- npm 或 yarn 包管理器

### 部署步骤

```bash
# 1. 克隆代码
git clone https://github.com/your-username/PromptHub.git
cd PromptHub/web

# 2. 安装依赖
npm ci

# 3. 构建生产版本
npm run build:standalone

# 4. 使用 PM2 管理进程 (推荐)
npm install -g pm2
pm2 start npm --name "prompthub" -- run start:prod

# 或直接运行
npm run start:prod
```

### PM2 常用命令

```bash
pm2 list
pm2 logs prompthub
pm2 restart prompthub
pm2 stop prompthub
pm2 startup
pm2 save
```

---

## 🌐 Nginx 静态文件部署

适用于将静态文件部署到任何支持静态文件的服务器或 CDN。

```bash
# 1. 构建静态文件
cd PromptHub/web
npm run build:static

# 2. 静态文件输出在 out/ 目录
ls -la out/

# 3. 将 out/ 目录上传到服务器
# 示例使用 scp:
scp -r out/* user@your-server:/var/www/prompthub/
```

### Nginx 虚拟主机配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/prompthub;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔒 HTTPS 配置 (SSL)

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取并安装证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## ✅ 部署验证清单

### 部署后检查

- [ ] 访问 `http://your-server-ip` 网站正常打开
- [ ] 所有页面路由正常（/workspace, /skills 等）
- [ ] 静态资源加载正常
- [ ] Workspace 页面功能测试:
  - [ ] Ollama 本地模型检测正常
  - [ ] API Key 输入并验证正常
  - [ ] 发送消息功能正常
  - [ ] Prompt 变量自动提取和替换正常

---

## 📊 服务器监控

### 端口检查

```bash
# 检查 3000 端口是否监听
netstat -tlnp | grep 3000

# 或使用 ss
ss -tlnp | grep 3000
```

### 进程检查

```bash
# 检查 Node.js 进程
ps aux | grep node

# 检查 Docker 容器
docker ps
```

### 日志查看

```bash
# Node.js PM2 日志
pm2 logs prompthub --lines 100

# Docker 日志
docker logs -f --tail 100 prompthub-web
```

---

## 🔧 常见问题

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 2. 构建失败

```bash
# 清理缓存重新构建
rm -rf .next node_modules
npm ci
npm run build
```

### 3. 内存不足

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 4. 跨域问题

所有 LLM API 调用都是客户端直接发起，服务器端不需要处理跨域，用户浏览器直接与 LLM 服务商通信。

---

## 📈 性能优化建议

1. **启用 Gzip/Brotli 压缩** - 已在 Nginx 和 Next.js 配置
2. **配置 CDN** - 静态资源使用 Cloudflare 等 CDN
3. **开启浏览器缓存** - 已在 Nginx 配置静态资源缓存
4. **进程守护** - 使用 PM2 或 Docker restart 策略
5. **负载均衡** - 高流量时可配置多个实例+Nginx负载均衡

---

## 🚨 紧急回滚

```bash
# 回滚到上一个 Git 版本
git reset --hard HEAD~1
docker-compose up -d --build

# 或使用特定版本号
git checkout <commit-hash>
docker-compose up -d --build
```
