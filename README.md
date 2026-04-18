# 🚀 PromptHub - AI 提示词聚合平台

> ✨ 精选 387+ 高质量 AI 提示词，一键复制即用。让 ChatGPT、Claude、文心一言立刻变身行业专家，效率提升 10 倍！

## ✨ 平台特性

| 特性 | 说明 |
|------|------|
| 🎯 **387+ 精选提示词** | 涵盖工作、创意、学术、编程、角色等 20+ 专业分类 |
| 🧠 **专业级标准** | 五层架构标准，经过大量场景效果验证 |
| 🔧 **专业工具库** | 覆盖各个领域的实用提示词 |
| 📱 **完美移动端** | 专为触摸操作优化，支持手势导航 |
| 🎨 **现代化 UI** | Framer Motion 动画，毛玻璃效果，深色/浅色模式 |
| 💾 **本地持久化** | 收藏夹、主题设置自动保存 |
| 🌍 **一键部署** | 纯静态导出，支持任何服务器/CDN |
| 💽 **数据库支持** | SQLite 数据库，支持高性能查询和统计分析 |

## 🚀 快速开始

```bash
cd web
npm install
npm run dev
```

打开 http://localhost:3333 即可预览。

## 📦 构建部署

```bash
npm run build
```

构建产物在 `web/out` 目录，可直接部署到任何静态托管服务。

## 🔧 技术栈

- **框架**: Next.js 15 (App Router + Webpack)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **数据库**: Prisma + SQLite

## 📱 移动端优化

- ✅ 48x48px 最小触控区域
- ✅ `touch-manipulation` 消除点击延迟
- ✅ 底部安全区域适配
- ✅ 滑动手势导航
- ✅ 触觉反馈动画
- ✅ 响应式网格布局

## 📂 项目结构

```
├── web/
│   ├── src/
│   │   ├── app/           # 页面路由
│   │   ├── components/    # UI 组件
│   │   ├── hooks/         # React Hooks
│   │   ├── lib/           # 工具库
│   │   └── types/         # 类型定义
│   ├── public/
│   │   └── skills-data.json  # 提示词数据
│   └── prisma/
│       └── schema.prisma  # 数据库 Schema
└── .github/workflows/
    └── deploy.yml         # GitHub Actions 自动部署
```

## 🌐 官方地址

- **仓库**: https://kkgithub.com/badhope/PromptHub
- **在线预览**: https://badhope.github.io/mobile-skills

## 📄 License

MIT © PromptHub Team
