# PromptHub 快速部署指南

> ✅ 下载后直接部署，无需额外配置

## 🚀 30 秒启动

### 方式一：Node.js 直接运行（推荐）

```bash
# 1. 解压进入目录
cd web

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 启动生产服务器
npm run start:prod
```

打开浏览器访问: **http://你的服务器IP:3000** ✨

---

## 🐳 方式二：Docker 一键运行

```bash
cd web
docker-compose up -d --build
```

---

## 📦 已包含的完整功能

| 模块 | 状态 | 说明 |
|------|------|------|
| ✅ 前端页面 | 完整 | 375+ 页面全部预渲染 |
| ✅ 后端 API | 完整 | LLM 聊天 + MCP 工具 |
| ✅ Skill 意图路由 | 完整 | 自动识别用户意图 |
| ✅ Agent 智能体引擎 | 完整 | ReAct 推理框架 |
| ✅ MCP 工具桥接 | 完整 | 7 种工具调用 |
| ✅ 多模型支持 | 完整 | OpenAI + Ollama + 云端 API |
| ✅ 上下文记忆 | 完整 | 多轮对话 |

---

## 🔧 模型配置

### 方式 A：用户本地 Ollama（推荐，隐私保护）

1. 用户电脑启动 Ollama
2. 浏览器设置面板配置
3. **数据 100% 在本地，不上传服务器

### 方式 B：云端 API

1. 聊天窗口右上角设置 OpenAI API Key
2. 后端自动代理，解决 CORS

---

## 📂 部署架构

```
web/                    # 这就是整个网站根目录，直接用
├── src/
│   ├── app/
│   │   ├── page.tsx          # 前端页面
│   │   ├── workspace/       # 智能体工作台
│   │   └── api/             # 后端 API
│   │       ├── llm/chat       # ✅ LLM 代理（解决 CORS）
│   │       └── mcp/         # ✅ MCP 工具执行
│   ├── components/
│   ├── hooks/
│   └── lib/
│       ├── agent/              # ✅ Agent 引擎
│       ├── llm/                # ✅ 模型层
│       └── mcp/              # ✅ 工具层
├── .next/standalone/         # npm run build 后自动生成
│   └── server.js             # ✅ 独立运行的 Node.js 服务器
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── next.config.ts             # ✅ 已修复为服务器模式
└── package.json
```

---

## ⚡ 性能优化配置

✅ **已内置最佳配置：

```typescript
output: 'standalone'    # 独立服务器，完整 API
compress: true       # Gzip 压缩
optimizePackageImports  # 包体积优化
productionBrowserSourceMaps: false  # 隐藏源码
```

---

## 📋 生产环境建议

使用 Nginx 反代配置参考（已包含 nginx.conf）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ 验证部署

访问 `/workspace` 页面，测试：
1. 发送消息测试聊天功能
2. 打开 Agent Debug 调试面板
3. 测试模型连接状态
4. 验证 Skill 自动匹配

---

**下载解压 → npm install && npm run build && npm run start:prod

**完成！** 🎉
