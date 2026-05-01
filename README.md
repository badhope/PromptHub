<div align="center">
  <a href="https://skillora.ai">
    <img src="https://skillora.ai/og.png" alt="Skillora Banner" width="100%">
  </a>
</div>

<div align="center">
  <h1>Skillora</h1>
  <p><strong>The Next-Gen AI Prompt & Skill Marketplace</strong></p>
</div>

<div align="center">
  <a href="https://skillora.ai">
    <img src="https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/skillora/skillora/stargazers">
    <img src="https://img.shields.io/github/stars/skillora/skillora?style=for-the-badge" alt="GitHub Stars">
  </a>
  <a href="https://github.com/skillora/skillora/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/skillora/skillora/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-purple.svg?style=for-the-badge" alt="PRs Welcome">
  </a>
</div>

---

## ✨ Features

### 🎯 Core Platform
- **🔍 Smart Discovery** - AI-powered skill recommendations and semantic search
- **🏪 Marketplace** - Browse, discover, and install AI prompts & skills
- **📦 Categories** - 20+ specialized categories from coding to creative writing
- **⭐ Ratings** - Community-driven quality assessment system
- **💖 Favorites** - One-click bookmarking of your favorite skills

### 🚀 Developer Experience
- **⚡ Next.js 16** - App Router + React Server Components
- **🎨 UI/UX** - Framer Motion animations + Tailwind CSS v3
- **🌙 Dark Mode** - Built-in theme switching with smooth transitions
- **📱 Responsive** - Mobile-first design with native PWA support
- **🔐 Auth** - NextAuth.js with GitHub, Google, Discord OAuth
- **📊 Analytics** - Real-time download and usage metrics

### 🏗️ Architecture
- **TypeScript First** - Full type safety across the entire codebase
- **ESLint + Prettier** - Enforced code quality standards
- **PWA Ready** - Service worker + offline support
- **SEO Optimized** - Structured data + Open Graph metadata
- **Edge Runtime** - Global deployment ready

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.17.0
pnpm >= 8.0.0 or npm >= 9.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/skillora/skillora.git

# Navigate to project directory
cd skillora/web

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your credentials
# - AUTH_SECRET
# - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
# - DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
skillora/
├── web/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── modules/          # Feature modules (store, skills, etc.)
│   │   ├── shared/           # Shared components & utilities
│   │   ├── components/       # Global UI components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Core libraries & utilities
│   ├── public/               # Static assets
│   └── package.json
├── docs/                     # Documentation
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.0 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.x + CSS Variables |
| **Animations** | Framer Motion 11.x |
| **Icons** | Lucide React |
| **Authentication** | NextAuth.js 5.x (Auth.js) |
| **Database** | Any (Vercel Postgres, Supabase, PlanetScale) |
| **Deployment** | Vercel, Netlify, Docker |
| **Package Manager** | npm / pnpm / yarn |

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td colspan="2">
        <b>Homepage</b>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <img src="https://skillora.ai/screenshots/home.png" width="100%" alt="Homepage">
      </td>
    </tr>
    <tr>
      <td><b>Store</b></td>
      <td><b>Skill Detail</b></td>
    </tr>
    <tr>
      <td>
        <img src="https://skillora.ai/screenshots/store.png" width="100%" alt="Store">
      </td>
      <td>
        <img src="https://skillora.ai/screenshots/detail.png" width="100%" alt="Detail">
      </td>
    </tr>
  </table>
</div>

---

## 🤝 Contributing

Contributions are **always welcome**!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org) - For the amazing framework
- [Vercel](https://vercel.com) - For hosting and infrastructure
- [Shadcn UI](https://ui.shadcn.com) - For component inspiration
- All our amazing contributors!

---

---

## 🇨🇳 中文说明

---

## ✨ 功能特性

### 🎯 核心平台
- **🔍 智能发现** - AI驱动的技能推荐与语义搜索
- **🏪 应用商店** - 浏览、发现和安装AI提示词与技能
- **📦 分类体系** - 从编程到创意写作的20+专业分类
- **⭐ 评分系统** - 社区驱动的质量评估体系
- **💖 收藏功能** - 一键收藏你喜欢的技能

### 🚀 开发体验
- **⚡ Next.js 16** - App Router + React服务端组件
- **🎨 界面设计** - Framer Motion动画 + Tailwind CSS v3
- **🌙 深色模式** - 内置主题切换与平滑过渡
- **📱 响应式设计** - 移动优先设计 + 原生PWA支持
- **🔐 认证系统** - NextAuth.js集成GitHub、Google、Discord登录
- **📊 数据分析** - 实时下载量与使用指标统计

### 🏗️ 架构设计
- **纯TypeScript** - 全代码库类型安全
- **ESLint + Prettier** - 严格的代码质量标准
- **PWA就绪** - Service Worker + 离线支持
- **SEO优化** - 结构化数据 + Open Graph元数据
- **边缘运行时** - 全球化部署就绪

---

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18.17.0
pnpm >= 8.0.0 或 npm >= 9.0.0
```

### 安装

```bash
# 克隆仓库
git clone https://github.com/skillora/skillora.git

# 进入项目目录
cd skillora/web

# 安装依赖
npm install
```

### 环境配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 填入你的凭证信息
# - AUTH_SECRET
# - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
# - DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 生产环境构建
npm run build

# 启动生产服务器
npm run start
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览应用。

---

<div align="center">
  <br>
  <p>Built with ❤️ by the Skillora Team</p>
</div>
