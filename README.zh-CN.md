# 🌐 AI Skill 生态系统

<!-- 徽章行 -->
<p align="center">

![Skills](https://img.shields.io/badge/Skills-601+-blue?style=for-the-badge&labelColor=2d333b)
![Categories](https://img.shields.io/badge/Categories-7-orange?style=for-the-badge&labelColor=2d333b)
![Platform](https://img.shields.io/badge/Platform-Cross--platform-orange?style=for-the-badge&labelColor=2d333b)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=2d333b)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&labelColor=2d333b)
![Last Update](https://img.shields.io/badge/Last_Update-2026--04--06-red?style=for-the-badge&labelColor=2d333b)

</p>

<!-- 居中英雄区域 -->
<div align="center">

## 🚀 通过 Raw 链接激活 AI Skill

**跨平台 · 无障碍 · 即时使用 · 无需安装**

*[English](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja-JP.md)*

---

### 🎯 快速演示

```markdown
# 激活 TaskMaster Skill
"请读取以下文件并切换到任务管理模式："
https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/smart-planner/SKILL.md
```

[![GitHub Stars](https://img.shields.io/github/stars/badhope/mobile-skills?style=social)](https://github.com/badhope/mobile-skills)
[![GitHub Forks](https://img.shields.io/github/forks/badhope/mobile-skills?style=social)](https://github.com/badhope/mobile-skills)

</div>

---

## 📑 目录

<details open="open">
<summary><b>📖 点击展开</b></summary>

| 章节 | 描述 | 徽章 |
|:--------|:------------|:------|
| [🆕 Skill 系统架构](#-skill-系统架构) | 新一代技能系统 | 🔥 重点 |
| [🚀 快速开始](#-快速开始) | 3步激活流程 | 🟢 新手 |
| [📂 Skills 索引](#-skills-索引) | 所有可用技能 | 🔍 浏览 |
| [🛠️ 功能型](#-功能型-skill) | 任务执行与规划 | 🔧 工具 |
| [💼 专业型](#-专业型-skill) | 法律、商业专家 | 💼 专家 |
| [🎨 创意型](#-创意型-skill) | 写作、音乐创作 | 🎨 创意 |
| [🎭 角色型](#-角色型-skill) | 角色扮演互动 | 🎭 扮演 |
| [📖 虚构世界](#-虚构世界-skill) | 互动小说世界 | 📖 世界 |
| [📁 仓库结构](#-仓库结构) | 完整文件树 | 📦 文件 |
| [📱 移动端测试](#-移动端测试) | 移动端激活指南 | 📱 移动 |
| [🤝 贡献指南](#-贡献指南) | 如何贡献 | 🤝 帮助 |

</details>

---

## 🆕 Skill 系统架构

### 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🏗️ Mobile-Skills 架构                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🎯 Commander Layer                              │   │
│   │              任务分解 · 意图识别 · 结果整合                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔄 Orchestrator Layer                           │   │
│   │           DAG引擎 · 技能编排 · 工作流管理 · 依赖解析                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      📋 Coordinator Layer                            │   │
│   │          领域协调 · 技能分组 · 上下文管理 · 状态追踪                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔌 Protocol Layer                               │   │
│   │              MCP协议 · ACP协议 · Mobile协议                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🎯 Skill Pool                                   │   │
│   │    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│   │    │Functional│ │Profess. │ │Creative │ │Character│ │ Fiction │     │   │
│   │    │   6     │ │   4     │ │   2     │ │   2     │ │   1     │     │   │
│   │    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### ✨ 核心特性

| 特性 | 描述 |
|:-----|:-----|
| **🎯 混合架构** | Skills-First + 层次化编排，兼顾灵活性与可控性 |
| **🔄 DAG工作流** | 有向无环图引擎，支持复杂任务编排与依赖管理 |
| **🔌 协议集成** | MCP/ACP/Mobile协议，实现跨平台互操作 |
| **📱 移动优化** | 针对移动端AI服务进行专项优化 |
| **🔙 向后兼容** | 完全兼容现有Agent系统，平滑迁移 |

### 📊 Skill 元数据结构

```yaml
skill_id: smart-planner
skill_name: TaskMaster - 任务管理专家
skill_version: 2.0.0
skill_category: functional

description: 任务管理与拆解专家，帮助用户高效规划和执行复杂任务
best_for:
  - 任务管理
  - 项目规划
  - 时间管理
  - GTD工作流

activation:
  raw_url: https://raw.githubusercontent.com/.../SKILL.md
  prompt_template: |
    请读取以下技能定义并切换到任务管理模式：
    {RAW_URL}
    {USER_REQUEST}
  min_context: 3000
  mobile_optimized: true

capabilities:
  input_types:
    - text/plain
    - text/markdown
  output_types:
    - text/markdown
  dependencies: []
  conflicts: []

execution:
  mode: atomic
  timeout: 60000
  retry: 2

metadata:
  author: mobile-skills-team
  created_at: 2024-01-15
  updated_at: 2026-03-28
  tags:
    - productivity
    - planning
    - gtd
  rating: 4.8
```

---

## 🚀 快速开始

### ⚡ 3步激活

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           🚀 SKILL 激活流程                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │
│   │  1️⃣ 复制    │ ──▶ │  2️⃣ 粘贴   │ ──▶ │  3️⃣ 开始   │              │
│   │  Raw 链接   │     │  发送给 AI  │     │  使用 Skill │              │
│   └──────────────┘     └──────────────┘     └──────────────┘              │
│                                                                             │
│        ▼                    ▼                     ▼                         │
│   选择任意 Skill     发送给任意 AI         开始使用技能！                    │
│   复制 Raw URL       支持网页访问的AI                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🎯 分步指南

| 步骤 | 操作 | 技巧 |
|:----:|:-------|:-----|
| 1️⃣ | **浏览Skills索引** | 使用目录快速访问 |
| 2️⃣ | **复制 Raw 链接** | 链接格式：`skills/[category]/[name]/SKILL.md` |
| 3️⃣ | **发送给 AI** | Claude、ChatGPT、Gemini 等 |
| 4️⃣ | **开始使用** | AI 将激活对应的 Skill 模式 |

### 💬 推荐激活语

```
请读取以下技能定义并切换到对应模式：
https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/[category]/[skill-id]/SKILL.md
```

---

## 📂 Skills 索引

### 📊 统计概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           📊 SKILL 生态系统统计                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Skill 总数:   ████████████████                   15                       │
│   分类数:       █████                             5                        │
│   支持语言:     ████                               2+ (EN, ZH)             │
│                                                                             │
│   分类分布:                                                                 │
│   🛠️ 功能型      ████████████                   6                        │
│   💼 专业型      ████████                        4                        │
│   🎨 创意型      ████                            2                        │
│   🎭 角色型      ████                            2                        │
│   📖 虚构世界    ██                              1                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 📋 分类矩阵

| 图标 | 分类 | 数量 | 描述 |
|:----:|:---------|:-----:|:------------|
| 🛠️ | [功能型](#-功能型-skill) | 6 | 任务执行、规划工具 |
| 💼 | [专业型](#-专业型-skill) | 4 | 法律、医疗、投资、心理 |
| 🎨 | [创意型](#-创意型-skill) | 2 | 写作、音乐创作 |
| 🎭 | [角色型](#-角色型-skill) | 2 | 角色扮演互动 |
| 📖 | [虚构世界](#-虚构世界-skill) | 1 | 东方玄幻修仙世界 |

---

## 🛠️ 功能型 Skill

> *任务执行、规划、代码、翻译、生存、体育*

| 标签 | Skill | 角色 | 擅长领域 | Raw 链接 |
|:---:|:------|:-----|:---------|:---------|
| 🔥 | **TaskMaster** | 任务管理与拆解专家 | 计划制定、GTD、任务拆解 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/smart-planner/SKILL.md) |
| 📊 | **DataAnalyst** | 数据分析与可视化专家 | 数据分析、图表制作、趋势洞察 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/data-analyst/SKILL.md) |
| 💻 | **CodeMaster** | 全栈工程师 | 代码编写、技术方案、bug排查 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/programmer/SKILL.md) |
| 🌐 | **Translator** | 翻译专家 | 翻译润色、语言学习、跨文化沟通 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/translator/SKILL.md) |
| 🏕️ | **SurvivalExpert** | 野外生存专家 | 野外生存、应急技能、装备选择 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/survival-expert/SKILL.md) |
| 🏃 | **SportsCoach** | 体育教练 | 运动训练、技能提升、赛事分析 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/sports-coach/SKILL.md) |

---

## 💼 专业型 Skill

> *法律、医疗、投资、心理咨询*

| 标签 | Skill | 角色 | 擅长领域 | Raw 链接 |
|:---:|:------|:-----|:---------|:---------|
| ⚖️ | **LegalAdvisor** | 法律顾问 | 合同审查、风险评估、合规建议 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/legal-advisor/SKILL.md) |
| 🏥 | **MedicalAdvisor** | 医疗健康顾问 | 症状分析、就医建议、药物常识 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/medical-advisor/SKILL.md) |
| 📈 | **InvestmentAdvisor** | 投资顾问 | 投资规划、资产配置、基金选择 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/investment-advisor/SKILL.md) |
| 🧠 | **Psychologist** | 心理咨询师 | 情绪疏导、压力管理、人际关系 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/psychologist/SKILL.md) |

---

## 🎨 创意型 Skill

> *写作、音乐创作*

| 标签 | Skill | 角色 | 擅长领域 | Raw 链接 |
|:---:|:------|:-----|:---------|:---------|
| ✍️ | **Writer** | 专业写手 | 文案创作、内容策划、编辑润色 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/creative/writer/SKILL.md) |
| 🎵 | **MusicComposer** | 音乐作曲家 | 歌曲创作、编曲建议、音乐理论 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/creative/music-composer/SKILL.md) |

---

## 🎭 角色型 Skill

> *角色扮演、动漫角色、沉浸式体验*

| 标签 | Skill | 角色 | 擅长领域 | Raw 链接 |
|:---:|:------|:-----|:---------|:---------|
| 💖 | **Kaguya** | 四宫辉夜 | 傲娇大小姐、角色扮演、恋爱互动 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/character/kaguya/SKILL.md) |
| 🕶️ | **GojoSatoru** | 五条悟 | 咒术最强、傲娇老师、强者风范 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/character/gojo-satoru/SKILL.md) |

---

## 📖 虚构世界 Skill

> *沉浸式互动小说世界，拥有完整的游戏系统*

### 🌍 什么是虚构世界？

虚构世界是完整的、独立的互动小说世界，基于核心设计理念：**万物皆对象，万物有数值，万物可演化**。

每个世界模板包含：
- 📜 完整的世界设定和背景
- 🎮 完整的游戏系统（属性、技能、物品、事件）
- 🎭 NPC和关系系统
- 📊 数据驱动的机制与JSON Schema
- 📖 AI执行指南

### 🚀 如何进入世界

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🌍 世界激活流程                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1️⃣ 复制世界模板的 Raw 链接                                                 │
│   2️⃣ 发送给 AI 并附带激活语                                                  │
│   3️⃣ AI 引导你创建角色                                                      │
│   4️⃣ 开始你的冒险！                                                         │
│                                                                             │
│   激活语：                                                                   │
│   "请读取以下世界设定，并引导我进入这个世界：[Raw Link]"                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 📋 可用世界

| 标签 | 世界 | 主题 | 特色 | Raw 链接 |
|:---:|:------|:------|:---------|:---------|
| 🐉 | **九州仙途** | 东方玄幻/修仙 | 修仙、宗门、长生、因果系统 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/fiction/eastern-fantasy/SKILL.md) |
| 🔥 | **全球觉醒** | 末日/异能 | 生存、异能、真相、势力博弈 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/fiction/global-awakening/SKILL.md) |

---

## 📁 仓库结构

```
📦 mobile-skills/
├── 📂 skills/                           🎯 Skill 技能文件 (15+)
│   ├── 📂 functional/                   功能型技能 (6)
│   │   ├── smart-planner/SKILL.md      ✅ 任务管理
│   │   ├── data-analyst/SKILL.md       ✅ 数据分析
│   │   ├── programmer/SKILL.md         ✅ 编程助手
│   │   ├── translator/SKILL.md         ✅ 翻译专家
│   │   ├── survival-expert/SKILL.md    ✅ 生存专家
│   │   └── sports-coach/SKILL.md       ✅ 体育教练
│   │
│   ├── 📂 professional/                 专业型技能 (4)
│   │   ├── legal-advisor/SKILL.md      ✅ 法律顾问
│   │   ├── medical-advisor/SKILL.md    ✅ 医疗顾问
│   │   ├── investment-advisor/SKILL.md ✅ 投资顾问
│   │   └── psychologist/SKILL.md       ✅ 心理咨询
│   │
│   ├── 📂 creative/                     创意型技能 (2)
│   │   ├── writer/SKILL.md             ✅ 专业写手
│   │   └── music-composer/SKILL.md     ✅ 音乐作曲
│   │
│   ├── 📂 character/                    角色型技能 (2)
│   │   ├── kaguya/SKILL.md             ✅ 四宫辉夜
│   │   └── gojo-satoru/SKILL.md        ✅ 五条悟
│   │
│   ├── 📂 fiction/                      虚构世界 (2)
│   │   ├── eastern-fantasy/SKILL.md    ✅ 东方玄幻
│   │   └── global-awakening/SKILL.md   ✅ 全球觉醒
│   │
│   └── INDEX.md                        📋 技能索引
│
├── 📂 orchestrator/                     🔄 编排层
│   ├── __init__.py                     初始化
│   ├── dag_engine.py                   DAG工作流引擎
│   └── registry.py                     技能注册表
│
├── 📂 protocols/                        🔌 协议层
│   ├── __init__.py                     初始化
│   ├── mcp_protocol.py                 MCP协议
│   ├── acp_protocol.py                 ACP协议
│   └── mobile_protocol.py              Mobile协议
│
├── 📂 agents/                           📦 Agent 角色文件 (77+)
│   ├── 🛠️ functional/                   功能型 (6)
│   ├── 💼 professional/                 专业型 (1)
│   ├── 💊 healthcare/                   医疗健康 (3)
│   ├── 💰 finance/                      金融 (2)
│   ├── 🧠 psychology/                   心理 (2)
│   ├── 🎨 design-build/                 设计构建 (2)
│   ├── 🔬 research-analysis/            研究分析 (1)
│   ├── ✍️ writing-creative/              写作创意 (1)
│   ├── 📚 learning-education/           学习教育 (1)
│   ├── 📖 subject-tutoring/             学科辅导 (5)
│   ├── 🏠 lifestyle-companion/          生活陪伴 (4)
│   ├── 🎭 entertainment-character/      娱乐角色 (35)
│   ├── 🎲 gaming/                       游戏 (2)
│   ├── 🏛️ historical-culture/           历史文化 (3)
│   ├── 👔 social-vocation/              社会职业 (5)
│   └── 🎨 creative-arts/                创意艺术 (3)
│
├── 📂 fiction-worlds/                   📖 互动虚构世界
│   ├── WORLD-TEMPLATE-GUIDE.md         📚 设计指南
│   ├── eastern-fantasy.md              🐉 东方玄幻世界
│   └── 📂 world-systems/               📊 世界系统文档
│
├── 📂 migration/                        🔄 迁移工具
│   └── agent_to_skill.py               Agent迁移脚本
│
├── 📂 templates/                        📋 角色模板
│   ├── role-template.md                📄 通用模板
│   ├── professional-role-template.md   💼 专业模板
│   └── character-role-template.md      🎭 角色模板
│
├── 📂 docs/                             📚 文档
│   ├── SKILL-SYSTEM-ARCHITECTURE.md    🏗️ 架构设计
│   ├── expansion-guide.md              🔄 扩展指南
│   ├── prompt-standards.md             ✏️ Prompt标准
│   └── repository-structure.md         🏗️ 架构文档
│
├── 📄 README.md                         🌐 英文主入口
├── 📄 README.zh-CN.md                   🌸 中文入口
├── 📄 LICENSE                           📜 MIT 许可证
└── 📄 CONTRIBUTING.md                   🤝 贡献指南
```

---

## 📱 移动端测试

### ✅ 已测试平台

| 平台 | 状态 | 备注 |
|:---------|:------:|:------|
| 📱 iOS Safari | ✅ 已验证 | 完美运行 |
| 📱 Android Chrome | ✅ 已验证 | 完美运行 |
| 📱 iPadOS Safari | ✅ 已验证 | 完美运行 |

### 📲 移动端激活指南

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        📱 移动端激活指南                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  步骤 1️⃣ : 打开 GitHub                                                      │
│            导航至: github.com/badhope/mobile-skills                          │
│                      ⬇️                                                      │
│  步骤 2️⃣ : 浏览 Skill                                                       │
│            进入: skills/[category]/[skill-name]/SKILL.md                    │
│                      ⬇️                                                      │
│  步骤 3️⃣ : 查看 Raw                                                         │
│            在文件视图中点击"Raw"按钮                                        │
│                      ⬇️                                                      │
│  步骤 4️⃣ : 复制 URL                                                         │
│            长按并复制链接                                                    │
│                      ⬇️                                                      │
│  步骤 5️⃣ : 打开 AI 应用                                                     │
│            打开 Claude/ChatGPT/Gemini 应用                                   │
│                      ⬇️                                                      │
│  步骤 6️⃣ : 粘贴并发送！🎉                                                   │
│            粘贴链接并添加激活语                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤝 贡献指南

### 🎯 贡献方式

| 类型 | 描述 | 如何开始 |
|:-----|:------------|:-------------|
| 🆕 **添加新 Skill** | 创建新的 Skill 文件 | 按照 `docs/expansion-guide.md` 操作 |
| 📝 **改进文档** | 增强文档和注释 | 编辑 `docs/` 中的 `.md` 文件 |
| 🐛 **报告 Bug** | Issue 报告 | 使用 GitHub Issues |
| ✨ **请求功能** | 建议新的 Skill/功能 | 使用 GitHub Issues |
| 🔄 **迁移 Agent** | 将 Agent 迁移到 Skill | 使用 `migration/agent_to_skill.py` |

### 📐 Skill 标准

| 标准 | 要求 |
|:---------|:------------|
| **命名** | 目录使用 kebab-case：`skill-name/SKILL.md` |
| **元数据** | YAML 块包含完整的 skill 元数据 |
| **结构** | 遵循现有 Skill 模板 |
| **内容** | 包含所有必需部分 |
| **链接** | 提交前测试 Raw 链接 |

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 🏆 项目统计

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           📊 项目统计                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   🎯 Skills:       ████████████████                   16                    │
│   📦 Agents:       ████████████████████████████████   77+                   │
│   📂 分类:         ████████████                       5                     │
│   📚 文档行数:     ████████████████████               15,000+               │
│                                                                             │
│   ⭐ Stars:        增长中!                                                     │
│   🍴 Forks:        分享中!                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<p align="center">

**[⬆ 返回顶部](#-目录)** · **[🌐 English](README.md)** · **[中文](README.zh-CN.md)**

*由社区用心打造，为社区服务*

**© 2026 badhope. 保留所有权利。 | MIT 许可证**

</p>
