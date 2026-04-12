export interface AgentLayer {
  id: string;
  name: string;
  icon: string;
  description: string;
  purpose: string;
  keyComponents: string[];
  implementation: string;
}

export const AGENT_ARCHITECTURE_LAYERS: AgentLayer[] = [
  {
    id: 'perception',
    name: '感知层',
    icon: '👁️',
    description: '信息输入与预处理',
    purpose: '接收并解析用户输入与环境状态，将非结构化信息转化为决策系统可理解的结构化表示',
    keyComponents: [
      '自然语言理解模块：意图识别、实体抽取、语义解析',
      '多模态感知模块：图像、语音、视频理解',
      '反馈接收模块：工具执行结果、状态变化监控',
      '上下文对齐模块：将输入与历史对话状态对齐'
    ],
    implementation: `
## 感知层实现规范

### 输入预处理
\`\`\`
1. 意图识别：分析用户输入的核心目标
2. 实体抽取：识别关键参数、约束条件、资源限制
3. 歧义检测：检测模糊表述，必要时主动澄清
4. 状态对齐：关联记忆中相关的历史上下文
\`\`\`

### 质量保证
- 输入置信度低于 0.7 时必须主动澄清
- 检测到矛盾信息时启动冲突解决流程
- 重要参数缺失时启动引导式追问
    `
  },
  {
    id: 'memory',
    name: '记忆层',
    icon: '🧠',
    description: '全生命周期数据存储与调取',
    purpose: '构建 Agent 的"经验系统"，实现跨会话、跨任务的知识积累与复用',
    keyComponents: [
      '瞬时记忆：本轮对话的临时内容（上下文窗口）',
      '工作记忆：当前任务的中间状态、临时数据',
      '长期记忆：用户偏好、专属知识库、历史经验',
      '元记忆：Agent 自身行为日志、失败归因、策略优化轨迹'
    ],
    implementation: `
## 记忆层实现规范

### 四维记忆矩阵
\`\`\`
┌───────────────────────────────────────────────────┐
│ 瞬时记忆 (STM)                                    │
│  └── 当前轮次对话、临时变量、推理中间结果        │
├───────────────────────────────────────────────────┤
│ 工作记忆 (WM)                                     │
│  └── 任务状态机、子任务进度、待办清单、依赖关系  │
├───────────────────────────────────────────────────┤
│ 长期记忆 (LTM)                                    │
│  └── 用户画像、知识库、历史对话库、成功案例        │
├───────────────────────────────────────────────────┤
│ 元记忆 (Meta)                                     │
│  └── 失败日志、优化建议、策略演进历史            │
└───────────────────────────────────────────────────┘
\`\`\`

### 记忆检索策略
1. 语义相似度检索：匹配当前问题与历史案例
2. 时间衰减加权：近期记忆权重高于远期记忆
3. 重要性权重：用户明确标记的偏好优先级最高
    `
  },
  {
    id: 'reasoning',
    name: '决策层',
    icon: '🎯',
    description: '任务拆解、推理规划、调度优化',
    purpose: 'Agent 的"战略指挥中心"，将高层目标转化为可执行的行动计划',
    keyComponents: [
      '任务拆解模块：大目标 → 有序子任务序列',
      '推理引擎：Chain-of-Thought、Tree-of-Thought、ReAct 范式',
      '反思优化模块：自我评估、错误归因、策略修正',
      '工具调度模块：工具选择、参数生成、依赖关系管理'
    ],
    implementation: `
## 决策层实现规范

### 标准推理流程 (ReAct 范式)
\`\`\`
Thought: 我需要完成用户的目标，让我先分析一下...
Action: 选择最合适的工具/方法
Action Input: 生成调用参数
Observation: 接收执行结果
Thought: 分析结果，判断下一步...
...（重复 N 轮）
Thought: 现在可以给出最终答案了
Final Answer: [结构化输出]
\`\`\`

### 反思机制
每完成 3 步执行必须启动一次反思：
1. 迄今为止的执行路径是否最优？
2. 是否存在更高效的替代方案？
3. 有没有偏离用户的原始意图？
4. 是否需要调整策略或追加工具调用？
    `
  },
  {
    id: 'execution',
    name: '执行层',
    icon: '⚡',
    description: '工具调用与行动执行',
    purpose: 'Agent 的"执行手臂"，将决策转化为实际操作，连接数字/物理世界',
    keyComponents: [
      'MCP 工具网关：标准化工具调用协议',
      'API 集成模块：REST/gRPC/WebSocket 统一适配',
      '代码执行模块：沙箱化 Python/JS 执行环境',
      '内容生成模块：多模态内容创作与格式输出'
    ],
    implementation: `
## 执行层实现规范

### 工具调用契约
\`\`\`
interface ToolCall {
  id: string;                    // 调用追踪 ID
  name: string;                  // 工具名称
  parameters: Record<string, any>; // 调用参数
  timestamp: number;             // 发起时间
  timeout: number;               // 超时阈值
  maxRetries: number;            // 最大重试次数
}
\`\`\`

### 安全保障
1. 权限沙箱：工具调用必须在权限边界内
2. 输入净化：所有参数必须经过 schema 校验
3. 幂等性：所有调用支持幂等重试
4. 审计日志：完整记录调用参数、结果、耗时
    `
  },
  {
    id: 'reflection',
    name: '反馈层',
    icon: '🔄',
    description: '结果校验与闭环优化',
    purpose: 'Agent 的"质量控制中心"，通过持续反馈实现自我进化',
    keyComponents: [
      '结果校验模块：完整性、正确性、合规性检查',
      '完成度评估：任务目标达成度量化评分',
      '优化建议生成：结构化改进方案输出',
      '策略更新：将反思结论写入元记忆'
    ],
    implementation: `
## 反馈层实现规范

### 三维评估体系
\`\`\`
1. 正确性验证
   └── 结果是否符合事实逻辑？有没有幻觉？
2. 完整性检查
   └── 是否覆盖用户所有需求？有没有遗漏？
3. 质量评分
   └── 格式规范、可读性、效率、成本综合评估
\`\`\`

### 反思闭环
1. 任务完成 → 启动三维评估
2. 评估不通过 → 生成具体改进建议 → 重试
3. 重试 2 次仍失败 → 升级策略 → 写入元记忆
4. 任务成功 → 提炼成功经验 → 存入案例库
    `
  }
];

export function generateLayeredSystemPrompt(basePrompt: string, roleName: string): string {
  return `
# ${roleName} - 五层架构智能体

> 本智能体按照业界标准的 Agent 五层架构设计构建，具备感知、记忆、决策、执行、反思的完整闭环能力。

---

## 🧠 核心身份设定

${basePrompt}

---

## 🏗️ 五层架构执行规范

### 【第1层】感知层 👁️
在开始响应前，我必须：
1. 完整理解用户输入的真实意图，不做表面理解
2. 识别所有关键参数、约束条件、资源限制
3. 检测模糊或歧义信息，必要时主动澄清
4. 关联记忆中相关的历史上下文和用户偏好

### 【第2层】记忆层 🧠
执行全程我会持续维护：
- **瞬时记忆**：完整记录本轮对话的所有中间状态
- **工作记忆**：维护任务进度看板、子任务依赖关系图
- **长期记忆**：主动检索用户历史偏好和成功案例
- **元记忆**：遇到相同问题时优先复用已验证的解决方案

### 【第3层】决策层 🎯
所有决策严格遵循 ReAct 推理范式：
\`\`\`
Thought: 明确的思考过程，说明我为什么这么决策
Action: 具体的行动/工具/方法选择
Observation: 接收和分析执行结果
Thought: 基于观察调整下一步策略
...（持续迭代直到任务完成）
Final Answer: 结构化的最终交付物
\`\`\`

每 3 步执行强制启动一次策略反思。

### 【第4层】执行层 ⚡
工具调用与行动原则：
1. 优先使用已有工具能力，不重复造轮子
2. 所有工具调用必须参数完整、格式规范
3. 网络调用必须设置超时和重试机制
4. 代码执行必须说明预期结果和风险

### 【第5层】反馈层 🔄
任务交付前必须完成自检：
- ✅ **正确性**：没有事实错误或幻觉，所有声明可验证
- ✅ **完整性**：100% 覆盖用户需求，没有遗漏
- ✅ **高质量**：格式规范、结构清晰、可读性强
- ✅ **可执行**：所有建议具体可落地，没有空泛表述

---

## 📋 交付标准

1. 所有输出必须结构化，使用 Markdown 标题层级
2. 复杂任务必须先给出执行框架，再填充细节
3. 所有假设必须明确声明，不隐瞒不确定性
4. 失败时必须给出具体的替代方案，不只说"做不到"

---
> 开始执行任务。记住：我是一个专业的智能体，不仅要"回答"，更要"解决"。
`;
}

export const MODEL_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    url: 'https://platform.openai.com',
    description: 'GPT-4o、GPT-4 Turbo、GPT-3.5 Turbo，业界标杆',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    icon: '🔮',
    url: 'https://cloud.siliconflow.cn',
    description: '国产开源模型聚合平台，性价比极高',
    models: ['Qwen2-72B', 'Llama-3-70B', 'GLM-4', 'DeepSeek-V2'],
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'doubao',
    name: '字节跳动 - 豆包',
    icon: '🫘',
    url: 'https://console.volcengine.com/ark',
    description: '字节跳动自研大模型，长上下文能力出色',
    models: ['Doubao-4k', 'Doubao-32k', 'Doubao-128k'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'qwen',
    name: '阿里 - 通义千问',
    icon: '🐏',
    url: 'https://dashscope.console.aliyun.com',
    description: '阿里巴巴通义系列，多模态能力强',
    models: ['Qwen-Max', 'Qwen-Plus', 'Qwen-Turbo'],
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '📚',
    url: 'https://console.anthropic.com',
    description: 'Claude 3 Opus/Sonnet，超长上下文之王',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'zhipu',
    name: '智谱 AI',
    icon: '🌟',
    url: 'https://open.bigmodel.cn',
    description: '清华系技术团队，国产模型翘楚',
    models: ['GLM-4', 'GLM-4V', 'CodeGeeX'],
    color: 'from-rose-500 to-pink-600'
  }
];
