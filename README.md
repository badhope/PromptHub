# 🧠 Mobile Skills - 移动端技能聚合平台

一个专为移动端优化的 Agent 智能体和专业工具聚合平台，集成 165+ 高质量技能，支持一键复制使用。

## ✨ 特性

- 🎯 **165+ 高质量技能** - 涵盖专业、编程、创意、学术、角色扮演、生活、游戏等 7 大分类
- 🧠 **五层 Agent 架构** - 每个智能体都具备完整的身份、能力、工作流、约束、工具集
- 🔧 **专业工具库** - 覆盖各个领域的实用提示词
- 📱 **完美移动端适配** - 专为触摸操作优化，支持手势导航
- 🎨 **现代化 UI** - Framer Motion 动画，毛玻璃效果，深色/浅色模式
- 💾 **本地持久化** - 收藏夹、主题设置自动保存
- 🚀 **静态导出** - 支持 GitHub Pages 一键部署

## 🚀 快速开始

```bash
cd web
npm install
npm run dev
```

打开 http://localhost:3000 即可预览。

## 📦 构建部署

```bash
npm run build
```

构建产物在 `web/out` 目录，可直接部署到任何静态托管服务。

## 🔧 技术栈

- **框架**: Next.js 16 (App Router + Turbopack)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **部署**: GitHub Pages

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
│   └── public/
│       └── skills-data.json  # 技能数据
└── .github/workflows/
    └── deploy.yml         # GitHub Actions 自动部署
```

## 📄 License

MIT
