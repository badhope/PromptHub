# Contribution Guide

> 如何为 AI Agent Ecosystem 贡献新角色

---

## 角色贡献流程

### Step 1: 选择分类

根据角色的主要功能，选择对应的分类目录：

| 分类 | 目录 | 适用场景 |
|:---|:---|:---|
| Functional | `agents/functional/` | 任务执行、计划、总结 |
| Professional | `agents/professional/` | 法律、金融、医疗等专业咨询 |
| Design & Build | `agents/design-build/` | 架构、设计、技术方案 |
| Research | `agents/research/` | 调研、分析、报告 |
| Writing | `agents/writing/` | 文案、创意、内容 |
| Education | `agents/education/` | 教学、辅导、学习 |
| Lifestyle | `agents/lifestyle/` | 陪伴、生活、情感 |
| Entertainment | `agents/entertainment/` | 角色扮演、动漫互动 |

### Step 2: 选择模板

| 角色类型 | 模板文件 |
|:---|:---|
| 通用角色 | `templates/role-template.md` |
| 专业角色 | `templates/professional-template.md` |
| 娱乐角色 | `templates/entertainment-template.md` |

### Step 3: 创建角色文件

1. 在对应目录下创建新文件：`agents/[category]/[role-name].md`
2. 使用对应模板填充内容
3. 遵循命名规范：`kebab-case`（如 `code-architect.md`）

### Step 4: 完善内容

确保角色文件包含：

- [ ] Role / Identity（身份定义）
- [ ] Core Mission（核心使命）
- [ ] Core Capabilities（核心能力）
- [ ] Task Handling Logic（任务处理逻辑）
- [ ] Output Style（输出风格）
- [ ] Boundaries / Constraints（边界约束）
- [ ] Adaptation Rules（适应规则）
- [ ] 激活方式（Raw 链接）

### Step 5: 更新文档

1. 在 `README.md` 对应分类下添加角色信息
2. 更新仓库结构图
3. 更新角色数量统计

### Step 6: 提交 PR

1. 创建分支
2. 提交角色文件
3. 创建 Pull Request
4. 等待审核

---

## 角色质量标准

### 必须满足

- [ ] 角色身份清晰，不模糊
- [ ] 有明确的核心使命
- [ ] 包含具体的任务处理流程
- [ ] 有结构化的输出格式
- [ ] 有明确的边界约束
- [ ] 遵循统一的文件命名

### 专业角色额外要求

- [ ] 明确的领域边界
- [ ] 专业方法论体现
- [ ] 风险提示机制
- [ ] 结构化输出格式
- [ ] 免责声明（如适用）

### 娱乐角色额外要求

- [ ] 角色人设一致性
- [ ] 说话风格具体化
- [ ] 情绪触发点定义
- [ ] 多轮对话一致性
- [ ] 避免普通 AI 语气

---

## 命名规范

### 文件名
- 使用 `kebab-case`
- 示例：`code-architect.md`、`misaka-mikoto.md`

### 角色 ID
- 英文小写
- 与文件名一致
- 示例：`code-architect`、`misaka-mikoto`

### 目录名
- 使用 `kebab-case`
- 示例：`design-build`、`entertainment`

---

## 角色审核标准

提交的角色将基于以下标准审核：

| 标准 | 权重 | 说明 |
|:---|:---:|:---|
| 完整性 | 25% | 所有必需部分是否齐全 |
| 专业性 | 25% | 内容是否专业、深入 |
| 可执行性 | 20% | 任务处理逻辑是否清晰 |
| 一致性 | 15% | 角色设定是否前后一致 |
| 可读性 | 15% | 文档结构是否清晰 |

---

## 常见问题

### Q: 可以提交真实人物的角色吗？
A: 不可以。我们只接受虚拟角色或原创角色。

### Q: 可以提交 NSFW 内容吗？
A: 不可以。所有内容必须适合所有年龄段的受众。

### Q: 如何处理跨分类的角色？
A: 选择最主要的功能分类。如果难以判断，可以在 PR 中说明。

### Q: 角色需要支持多语言吗？
A: 目前主要支持中文角色。如需其他语言，请在 PR 中说明。

---

## 联系方式

如有疑问，请提交 Issue 或联系维护者。

---

**Last updated:** 2026-03-20