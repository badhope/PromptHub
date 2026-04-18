# 🚀 PromptHub - AI 提示词聚合平台

> ✨ 精选高质量 AI 提示词库，支持扫码分享、对比分析、自定义创建，让 AI 秒变行业专家！

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-brightgreen)](https://turbo.build/)

---

## 🎯 项目简介

PromptHub 是一个现代化的 **AI 提示词聚合平台**，收录精心编写的各类 AI 提示词，支持分类浏览、模糊搜索、扫码分享、提示词对比和自定义创建。无需注册，打开即用，所有数据本地存储，保护隐私。

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🎯 **精选 Skills** | 涵盖角色扮演、创意创作、小说创作、功能助手、职业顾问 5 大分类 |
| 🧠 **智能搜索** | Fuse.js 模糊搜索，输入即匹配，支持关键词高亮 |
| 📱 **扫码分享** | 一键生成 QR Code，随时随地在手机端扫码查看 |
| 🔍 **提示词对比** | 对比不同提示词的效果差异，选出最优方案 |
| ✏️ **自定义创建** | 内置提示词编辑器，实时预览效果 |
| ⭐ **收藏夹** | 收藏常用提示词，本地持久化存储 |
| 🌙 **深色模式** | 自动跟随系统主题，支持手动切换 |
| 📦 **PWA 支持** | 可安装到桌面/手机，离线访问，无网络也能用 |
| 🛠️ **工具集** | 集成格式化、JSON 提取、变量替换等实用工具 |
| 🔐 **隐私优先** | 所有数据存储在本地，不上传任何服务器 |

---

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.x 或更高版本
- **包管理器**: npm / pnpm / yarn（推荐 pnpm）
- **浏览器**: Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+

### 安装

```bash
# 克隆仓库
git clone https://github.com/badhope/PromptHub.git
cd PromptHub

# 进入 web 目录
cd web

# 安装依赖
pnpm install
```

### 开发

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 构建

```bash
pnpm build
```

构建产物输出到 `out/` 目录，可直接部署到任意静态托管服务（Vercel、Netlify、Cloudflare Pages、GitHub Pages 等）。

---

## 📂 项目结构

```
PromptHub/
├── web/                         # Next.js 主应用
│   ├── src/
│   │   ├── app/                 # App Router 页面
│   │   │   ├── skills/         # 技能库主页
│   │   │   ├── skills/[slug]/   # 技能详情页
│   │   │   ├── categories/      # 分类浏览
│   │   │   ├── category/[id]/   # 分类详情
│   │   │   ├── search/          # 搜索页
│   │   │   ├── compare/         # 对比页
│   │   │   ├── custom/          # 自定义创建页
│   │   │   ├── favorites/       # 收藏夹
│   │   │   ├── tools/           # 工具集
│   │   │   ├── ai-tools/        # AI 工具集
│   │   │   ├── models/          # 模型配置
│   │   │   ├── settings/        # 设置页
│   │   │   ├── guide/           # 使用指南
│   │   │   ├── about/           # 关于页
│   │   │   └── api/             # API 路由
│   │   ├── components/          # React 组件
│   │   ├── lib/                 # 工具函数
│   │   ├── hooks/               # 自定义 Hooks
│   │   └── styles/              # 全局样式
│   ├── prisma/
│   │   └── schema.prisma        # 数据库 Schema
│   ├── public/                  # 静态资源
│   └── .env                     # 环境变量（不上传）
│
├── skills/                      # Skills 源码（提示词定义）
│   ├── character/               # 角色扮演类
│   ├── creative/                # 创意创作类
│   ├── fiction/                 # 小说创作类
│   ├── functional/              # 功能助手类
│   └── professional/           # 职业顾问类
│
├── templates/                   # 提示词模板
├── deploy/                      # 构建产物（预渲染静态站）
├── scripts/                    # 构建脚本
├── workflows/                  # GitHub Actions 工作流
└── .github/                    # GitHub 配置
```

---

## 🛠️ 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| **框架** | Next.js 16 (App Router) | 最新的 React 全栈框架 |
| **打包** | Turbopack | Vercel 出品的极速打包工具 |
| **语言** | TypeScript 5 | 类型安全的 JavaScript 超集 |
| **样式** | Tailwind CSS | 原子化 CSS 框架 |
| **动画** | Framer Motion 12 | 声明式动画库 |
| **图标** | Lucide React | 轻量级图标库 |
| **搜索** | Fuse.js | 零配置模糊搜索 |
| **数据库** | Prisma + SQLite | 类型安全的 ORM |
| **PWA** | @ducanh2912/next-pwa | 渐进式 Web 应用支持 |
| **Markdown** | react-markdown + rehype | 富文本渲染 |
| **语法高亮** | react-syntax-highlighter | 代码高亮显示 |
| **表单验证** | Zod | TypeScript 优先的 schema 验证 |

---

## 📊 Skills 系统

Skills 是 PromptHub 的核心数据单元，每一条 Skill 包含：

- **名称与描述** — 清晰的用途说明
- **提示词模板** — 结构化的 AI 提示词
- **使用场景** — 适用领域和最佳实践
- **变量系统** — 支持动态参数替换
- **效果示例** — 展示预期输出效果

### 五大分类

| 分类 | 图标 | 说明 |
|------|------|------|
| 🎭 **角色扮演** | 🥷 | 角色对话、人格扮演、情感陪伴 |
| 🎨 **创意创作** | 🎭 | 写作助手、音乐创作、艺术设计 |
| 📚 **小说创作** | 🌌 | 故事生成、世界观构建、角色设定 |
| ⚙️ **功能助手** | 🧑‍💻 | 数据分析、代码生成、翻译润色 |
| 💼 **职业顾问** | 👨‍⚖️ | 法律咨询、心理咨询、职业规划 |

---

## ⚙️ 环境变量

在 `web/` 目录创建 `.env.local` 文件：

```env
# 数据库（默认本地 SQLite）
DATABASE_URL="file:./dev.db"

# NextAuth 认证密钥（必填，请使用随机字符串）
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# NextAuth 访问地址
NEXTAUTH_URL="http://localhost:3000"
```

> ⚠️ `.env` 文件已被 `.gitignore` 忽略，不会提交到仓库。

---

## 🤝 贡献指南

欢迎提交 Skills！请参考 `templates/` 目录下的模板格式：

- `role-template.md` — 通用提示词模板
- `character-role-template.md` — 角色扮演类模板
- `professional-role-template.md` — 职业顾问类模板

提交前请确保：
- [ ] 遵循模板格式
- [ ] 通过 `pnpm typecheck` 类型检查
- [ ] 通过 `pnpm lint` 代码规范检查

---

## 📌 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| **1.0.0** | 2026-04-19 | 全新架构重构，Turbopack 支持，Skills 系统 2.0，扫码分享，对比分析，自定义创建，PWA 支持 |
| — | 2025 | 初版发布，387+ 提示词，20+ 分类 |

---

## 📄 License

MIT © [badhope](https://github.com/badhope)

---

## 🌐 资源链接

- **GitHub**: [https://kkgithub.com/badhope/PromptHub](https://kkgithub.com/badhope/PromptHub)
- **在线预览**: [https://badhope.github.io/PromptHub](https://badhope.github.io/PromptHub)（待部署）
