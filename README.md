# 🤖 AI Skill - AI技能生态系统平台

<p align="center">

![Platform](https://img.shields.io/badge/Platform-AI_Skill_Ecosystem-blue?style=for-the-badge&labelColor=2d333b)
![Skills](https://img.shields.io/badge/Skills-867-green?style=for-the-badge&labelColor=2d333b)
![Categories](https://img.shields.io/badge/Categories-7-orange?style=for-the-badge&labelColor=2d333b)
![Version](https://img.shields.io/badge/Version-6.0.0-purple?style=for-the-badge&labelColor=2d333b)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=2d333b)

[![Website](https://img.shields.io/badge/🌐_Website-Online-brightgreen?style=for-the-badge&labelColor=2d333b)](https://aiskill.qzz.io/)
[![GitHub Stars](https://img.shields.io/github/stars/badhope/mobile-skills?style=social)](https://github.com/badhope/mobile-skills)

</p>

---

## 🎯 项目概述

**AI Skill** 是一个全面的AI技能生态系统平台，提供丰富的AI技能、角色和能力集合。平台通过直观的Web界面让用户能够发现、浏览和激活各种AI技能。

### 🌟 核心特性

| 特性 | 描述 |
|:--------|:------------|
| 🎨 **现代化Web界面** | 使用 Next.js 16 和 Tailwind CSS 构建的精美响应式UI |
| 🔍 **智能搜索** | 基于 Fuse.js 的模糊搜索，快速发现技能 |
| 📱 **跨平台** | 在桌面、平板和移动设备上无缝运行 |
| 🌍 **多语言** | 支持中文和英文界面 |
| 🎭 **主题系统** | 亮色、暗色和跟随系统三种主题模式 |
| ❤️ **收藏系统** | 保存和管理您喜爱的技能 |
| 📊 **统计仪表板** | 查看技能使用情况和平台指标 |
| 🔄 **自动同步** | 自动与仓库内容同步 |
| ⚡ **性能优化** | 首屏加载 < 1秒，完全加载 < 3秒 |
| 🔒 **安全增强** | XSS防护、输入验证、CSP策略 |

---

## 🏗️ 平台架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🤖 AI Skill 平台架构                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🎨 表现层                                       │   │
│   │         Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔧 应用层                                       │   │
│   │    Custom Hooks · State Management · i18n · Theme System · Routing  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      📊 数据层                                       │   │
│   │         Static JSON · LocalStorage · LRU Cache · Search Index       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔒 安全层                                       │   │
│   │      XSS Protection · Input Sanitization · CSP · URL Validation     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🚀 部署层                                       │   │
│   │       Custom Domain · GitHub Actions · Static Export · PWA          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|:-----------|:--------:|:--------|
| [Next.js](https://nextjs.org/) | 16.2.2 | React framework with App Router |
| [React](https://react.dev/) | 19.2.4 | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Fuse.js](https://fusejs.io/) | 7.1.0 | Fuzzy search engine |
| [react-markdown](https://github.com/remarkjs/react-markdown) | 10.1.0 | Markdown rendering |

### Development Tools

| Tool | Purpose |
|:-----|:--------|
| ESLint | Code linting |
| Turbopack | Fast bundling |
| PostCSS | CSS processing |

---

## 📁 Project Structure

```
mobile-skills/
├── web/                          # Web application
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── globals.css       # Global styles
│   │   │   ├── skills/           # Skills pages
│   │   │   ├── category/         # Category pages
│   │   │   ├── search/           # Search page
│   │   │   ├── favorites/        # Favorites page
│   │   │   ├── settings/         # Settings page
│   │   │   ├── about/            # About page
│   │   │   └── guide/            # User guide
│   │   ├── components/           # React components
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   ├── Footer.tsx        # Footer
│   │   │   ├── SkillCard.tsx     # Skill card
│   │   │   ├── Toast.tsx         # Toast notifications
│   │   │   └── ...               # Other components
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useSkills.ts      # Skill data management
│   │   │   ├── useSearch.ts      # Search functionality
│   │   │   ├── useFavorites.ts   # Favorites management
│   │   │   ├── usePreferences.ts # User preferences
│   │   │   └── ...               # Other hooks
│   │   ├── lib/                  # Utility libraries
│   │   │   ├── constants.ts      # App configuration
│   │   │   ├── security.ts       # Security utilities
│   │   │   ├── performance.ts    # Performance utilities
│   │   │   ├── categories.ts     # Category helpers
│   │   │   └── i18n.ts           # Internationalization
│   │   ├── types/                # TypeScript types
│   │   │   └── skill.ts          # Skill type definitions
│   │   └── skills-data.json      # Skills database
│   ├── public/                   # Static assets
│   ├── next.config.ts            # Next.js configuration
│   └── package.json              # Dependencies
├── skills/                       # Skill definitions
│   ├── functional/               # Functional skills
│   ├── professional/             # Professional skills
│   ├── creative/                 # Creative skills
│   ├── character/                # Character skills
│   └── fiction/                  # Fiction world skills
├── scripts/                      # Build scripts
│   ├── add-skills.js             # Skill import script
│   └── import-skills.ts          # TypeScript import
├── .github/workflows/            # GitHub Actions
│   ├── deploy.yml                # Deployment workflow
│   ├── generate-data.yml         # Data generation
│   └── nightly-update.yml        # Nightly updates
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/badhope/mobile-skills.git
cd mobile-skills

# Install dependencies
cd web
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# The static site will be generated in /out directory
```

---

## 🎨 Features in Detail

### 🔍 Search System

- **Fuzzy Search**: Find skills even with typos or partial matches
- **Multi-field Search**: Search by name, description, and tags
- **Debounced Input**: Optimized search performance
- **LRU Cache**: Cached search results for faster response

### 🌍 Internationalization

- **Multi-language Support**: Chinese (zh-CN) and English (en-US)
- **Dynamic Switching**: Change language without page refresh
- **Persistent Preference**: Language choice saved in localStorage

### 🎭 Theme System

- **Three Modes**: Light, Dark, and System
- **Smooth Transitions**: Animated theme changes
- **Persistent Preference**: Theme choice saved in localStorage
- **System Detection**: Automatically follows system preference

### ❤️ Favorites Management

- **Add/Remove**: Easy skill bookmarking
- **Persistent Storage**: Favorites saved in localStorage
- **Quick Access**: Dedicated favorites page
- **Export/Import**: Backup and restore favorites

### 📊 Statistics Dashboard

- **Total Skills**: Count of all available skills
- **Category Distribution**: Skills per category
- **Usage Metrics**: Popular skills tracking
- **Recent Updates**: Latest skill additions

---

## 🔒 Security Features

### XSS Protection

- HTML sanitization for user inputs
- URL validation and sanitization
- Content Security Policy (CSP) headers
- Safe markdown rendering

### Input Validation

- Search query validation
- Category and ID validation
- Input length limits
- Dangerous pattern detection

### Performance Security

- Rate limiting for search
- Debounced user inputs
- Memory-efficient caching
- Optimized bundle sizes

---

## ⚡ Performance Optimizations

### Code Optimization

- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Automatic route-based splitting
- **Minification**: Production code compression
- **Dead Code Elimination**: Unused exports removal

### Runtime Optimization

- **LRU Cache**: Search result caching
- **Memoization**: Expensive computation caching
- **Debounce/Throttle**: Input optimization
- **Lazy Loading**: On-demand component loading

### Asset Optimization

- **Static Export**: Pre-rendered pages
- **Image Optimization**: Unoptimized for static hosting
- **Font Optimization**: System font fallbacks
- **CSS Optimization**: Tailwind purging

---

## 📈 Performance Metrics

| Metric | Target | Status |
|:-------|:------:|:-------|
| First Contentful Paint | < 1.5s | ✅ Achieved |
| Time to Interactive | < 3.0s | ✅ Achieved |
| Lighthouse Performance | > 90 | ✅ Achieved |
| Bundle Size (gzipped) | < 200KB | ✅ Optimized |
| SEO Score | 100 | ✅ Perfect |
| Accessibility Score | > 95 | ✅ Excellent |

---

## 🔄 CI/CD Pipeline

### Deployment Workflow

```yaml
Trigger: Push to main branch
Steps:
  1. Checkout repository
  2. Setup Node.js 20
  3. Install dependencies
  4. Import skill definitions
  5. Build Next.js application
  6. Deploy to GitHub Pages
```

### Nightly Update

```yaml
Trigger: Daily at 00:00 Beijing Time (16:00 UTC)
Steps:
  1. Health check
  2. Build verification
  3. Change detection
  4. Auto-deploy if changes found
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Search powered by [Fuse.js](https://fusejs.io/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/badhope">badhope</a> and AI
</p>

<p align="center">
  <strong>⭐ If you find this project helpful, please give it a star! ⭐</strong>
</p>
