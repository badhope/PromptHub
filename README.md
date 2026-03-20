# AI Agent Ecosystem

> Activate AI agents via Raw links — cross-platform, barrier-free, instant use

---

## AI Metadata

```yaml
repo: badhope/mobile-skills
type: AI Agent Navigation System
version: 3.0
language: en
entry_type: Primary Entry
categories: 8
total_agents: 10
```

**[English](./README.md) | [中文](./README_zh.md)**

---

## How to Use (3 Steps)

| Step | Action | Description |
|:---:|:---:|:---|
| 1 | Copy Agent Raw Link | Select any agent below and copy its Raw link |
| 2 | Send to AI | Send the link to any AI with web access |
| 3 | Start Chatting | AI will activate the corresponding agent mode |

**Recommended Activation Phrase**:
```
Please read the following file and switch to the corresponding agent mode:
[Raw URL]
```

---

## Category Index

| Category | English Name | Description | Agents |
|:---|:---|:---|:---:|
| 🛠️ | Functional | Task execution, planning, summarization | 1 |
| 💼 | Professional | Legal, business analysis | 1 |
| 🎨 | Design & Build | Architecture, product strategy | 2 |
| 🔬 | Research | Investigation, data insight | 1 |
| ✍️ | Writing | Content creation, copywriting | 1 |
| 📚 | Education | Teaching, learning planning | 1 |
| 🏠 | Lifestyle | Wisdom, habit support | 1 |
| 🎭 | Entertainment | Role-play, anime characters | 2 |

---

## 🛠️ Functional Agents

解决通用任务执行、结构化协助、计划、总结、问题拆解等高频功能需求。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **TaskMaster** | 任务管理与拆解专家 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/functional/task-master.md` | ✅ |

---

## 💼 Professional Domain Agents（专业领域）

具备明显专业边界、专业风格、方法论、风险意识和结构化输出能力的职业型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Legal** | 法律顾问 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/professional/legal.md` | ✅ |

---

## 🎨 Design & Build Agents（设计构建）

帮助用户做架构、仓库、项目、模块、技术方案、Prompt 设计、实施路径规划的设计型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Code Architect** | 系统架构师 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/design-build/code-architect.md` | ✅ |
| **ProductStrat** | 产品策略师 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/design-build/product-strat.md` | ✅ |

---

## 🔬 Research & Analysis Agents（研究分析）

负责调研、信息归纳、比较、洞察、证据组织、分析报告、结论提炼的分析型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Research Analyst** | 研究分析师 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/research/analyst.md` | ✅ |

---

## ✍️ Writing & Creative Agents（写作创作）

负责写作、创作、改写、风格迁移、叙事构建、表达优化的内容型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Writer** | 专业写手 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/writing/writer.md` | ✅ |

---

## 📚 Learning & Education Agents（学习教育）

负责讲解、教学、启发、训练、学习规划、知识理解支持的教育型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Tutor** | 私人导师 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/education/tutor.md` | ✅ |

---

## 🏠 Lifestyle & Companion Agents（生活陪伴）

负责陪伴、日常建议、情绪支持、反思、习惯支持、生活交流的轻陪伴型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Wise Sage** | 智者/贤者 | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/lifestyle/wise-sage.md` | ✅ |

---

## 🎭 Entertainment & Character Agents（娱乐角色）

负责沉浸式角色扮演、动漫角色互动、设定陪聊、人格沉浸、娱乐互动的角色型智能体。

| 角色 | 定位 | Raw 链接 | 状态 |
|:---|:---|:---|:---:|
| **Kaguya** | 四宫辉夜（傲娇大小姐） | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/entertainment/kaguya.md` | ✅ |
| **Misaka Mikoto** | 御坂美琴（傲娇学姐） | `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/entertainment/misaka-mikoto.md` | ✅ |

---

## 📁 Repository Structure

```
agents/
├── functional/           # Task execution
│   └── task-master.md   ✅
├── professional/         # Professional domain
│   └── legal.md         ✅
├── design-build/        # Design & build
│   ├── code-architect.md ✅
│   └── product-strat.md ✅
├── research/            # Research & analysis
│   └── analyst.md       ✅
├── writing/             # Writing & creative
│   └── writer.md        ✅
├── education/           # Learning & education
│   └── tutor.md         ✅
├── lifestyle/           # Lifestyle & companion
│   └── wise-sage.md    ✅
└── entertainment/       # Entertainment & character
    ├── kaguya.md        ✅
    └── misaka-mikoto.md ✅

templates/
├── role-template.md
├── professional-template.md
└── entertainment-template.md

docs/
├── prompt-standard.md
├── interaction-example.md
├── contribution-guide.md
├── stage2-design.md
└── stage3-design.md
```

---

## 📱 Mobile Testing

1. Open GitHub repository
2. Navigate to target agent file (e.g. `agents/entertainment/kaguya.md`)
3. Click **Raw** to get link
4. Copy and send to AI
5. Start chatting

---

## Category Overview

| Category | Description | Representative | Count |
|:---|:---|:---|:---:|
| 🛠️ Functional | Task execution | TaskMaster | 1 |
| 💼 Professional | Professional domain | Legal | 1 |
| 🎨 Design & Build | Design & architecture | Code Architect, ProductStrat | 2 |
| 🔬 Research | Research & analysis | Research Analyst | 1 |
| ✍️ Writing | Writing & creative | Writer | 1 |
| 📚 Education | Learning & education | Tutor | 1 |
| 🏠 Lifestyle | Lifestyle & companion | Wise Sage | 1 |
| 🎭 Entertainment | Entertainment & character | Kaguya, Misaka | 2 |

**Total Agents**: 10 | **Completed**: 10 | **In Development**: 0

---

## Extension Guide

### Adding New Agents

1. Create new file based on `templates/role-template.md`
2. For professional agents use `templates/professional-template.md`
3. For entertainment agents use `templates/entertainment-template.md`
4. Place in appropriate category directory
5. Add agent info to this README
6. Update repository structure

### Naming Conventions

- Filename: `kebab-case` (e.g. `code-architect.md`)
- Agent ID: lowercase English (e.g. `code-architect`)
- Directory: `kebab-case` (e.g. `agents/design-build/`)

---

## Featured Agent Highlights

| Agent | Category | Highlights |
|:---|:---|:---|
| Code Architect | Design & Build | Complete architecture design workflow, standard technical documentation |
| ProductStrat | Design & Build | Product strategy, user value oriented |
| Legal | Professional | Professional legal analysis with risk assessment and disclaimer |
| Research Analyst | Research | Hypothesis-driven research, structured analysis reports |
| Writer | Writing | Multi-style writing, goal-oriented content creation |
| Tutor | Education | Heuristic teaching, personalized learning paths |
| Wise Sage | Lifestyle | Socratic questioning, deep thinking guidance |
| Kaguya | Entertainment | Tsundere大小姐, immersive roleplay |
| Misaka Mikoto | Entertainment | Tsundere学姐, electromagnetic少女 |

---

## Bilingual Statement

| Version | File | Purpose | Priority |
|:---|:---|:---|:---:|
| English Primary | `README.md` | AI primary index entry | P0 |
| Chinese Secondary | `README_zh.md` | Chinese user auxiliary reading | P1 |

**AI Recommendation**: Use English README for indexing and navigation for most stable parsing.

---

## License

MIT License

---

**[中文](./README_zh.md)**

**Last updated:** 2026-03-20