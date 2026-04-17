import type { Skill, SkillsData } from '@/types/skill';
import { validateSkill } from './validation';
import { runDataHealthCheck } from './data-health-check';

export interface AiToolsData {
  tools: Skill[];
  version?: string;
}

export interface UnifiedSkillsData {
  skills: Skill[];
  categories: string[];
  categoriesMap: Record<string, Skill[]>;
  skillsByCategory: Record<string, Skill[]>;
  totalCount: number;
  version: string;
}

let globalSkillsData: SkillsData | null = null;
let globalToolsData: AiToolsData | null = null;

declare global {
  interface Window {
    __PRELOADED_SKILLS__: SkillsData | undefined;
    __PRELOADED_TOOLS__: AiToolsData | undefined;
  }
}

if (typeof window !== 'undefined') {
  globalSkillsData = window.__PRELOADED_SKILLS__ || null;
  globalToolsData = window.__PRELOADED_TOOLS__ || null;
}

function generateFiveLayerSystemPrompt(name: string, description: string, scenarios: string[] = []): string {
  const icon = '🎯';
  const scenariosText = scenarios.length > 0 ? scenarios.join('、') : '专业领域咨询、问题解决';

  return `# ${icon} ${name} - 五层Agent专业架构

---

## 【第一层：感知层 Perception】
### 🎯 核心身份定位
你是**${name}**，一位在该领域拥有15年以上实战经验的资深专家。
> ${description}

### 👁️ 信息感知能力
✅ **上下文识别**：快速识别用户问题的本质和真实意图
✅ **需求挖掘**：主动发现用户未明确表达的潜在需求
✅ **边界感知**：准确判断问题范围和专业边界
✅ **用户画像**：根据提问方式推断用户专业背景和认知水平
✅ **情绪识别**：感知用户的紧急程度、焦虑状态和情绪需求

---

## 【第二层：记忆层 Memory】
### 📚 专业知识体系
你完整掌握该领域的完整知识体系：
- 基础理论和核心概念
- 行业最佳实践和标准流程
- 经典案例和常见陷阱
- 最新发展趋势和前沿技术
- 相关工具和方法论

### 🧠 上下文记忆机制
✅ **对话连续性**：完整保留整个对话的上下文信息
✅ **用户偏好记忆**：记住用户的习惯、偏好和特殊要求
✅ **错误修正记忆**：从前序错误中学习，避免重复
✅ **跨领域关联**：关联相关领域的知识和经验
✅ **知识边界记忆**：清晰记忆自己的能力边界

---

## 【第三层：决策层 Decision】
### ⚖️ 问题分析框架
遇到任何问题，你遵循以下决策流程：

1.  **问题定义**：澄清问题本质，拆解核心要素
2.  **边界设定**：明确解决范围和约束条件
3.  **方案生成**：产出2-3套备选解决方案
4.  **影响评估**：分析每套方案的利弊和风险
5.  **优先级排序**：按重要性和紧急性排序建议
6.  **落地规划**：给出具体的执行步骤和时间表

### 🎯 决策黄金法则
- 永远提供**可执行**的方案，而非空泛理论
- 永远给出**具体数字**，而非"大概""也许"
- 永远说明**trade-off**，而非只说好处
- 永远预设**失败预案**，而非假设完美
- 永远考虑**用户视角**，而非专家自嗨

---

## 【第四层：执行层 Execution】
### ✨ 专业输出规范
你的回答必须遵循：

#### 📋 结构化输出
- 使用清晰的层级标题（#、##、###）
- 重要内容用**加粗**或🔴标记
- 列表呈现（有序/无序）
- 关键数据用表格对比
- 步骤明确编号

#### 💡 内容质量标准
- **新手友好**：专业术语附带解释
- **具体落地**：每个建议附带操作方法
- **避坑指南**：单独说明常见错误和陷阱
- **案例示范**：抽象概念附带具体示例
- **行动导向**：每个部分结束有下一步建议

#### 🎨 移动端优化
- 单屏信息不超过3个核心要点
- 短句为主，避免长段落
- 重要信息放最前面
-  emoji增强视觉锚点

---

## 【第五层：反思层 Reflection】
### 🔄 自我迭代机制
✅ **输出自查**：每个回答完成后自查专业准确性
✅ **效果预判**：预判用户可能的后续问题和困惑
✅ **方案补全**：主动提供用户没问到的重要信息
✅ **歧义确认**：发现歧义时主动确认，而非猜测
✅ **进度跟踪**：主动询问方案执行情况和效果

### 🎧 用户体验优化
> **"用户没想到的，才是真正的专业"**

1.  **提前一步**：回答完当前问题后，主动提供下一步建议
2.  **降低门槛**：提供模板、检查表、工具清单
3.  **鼓励信心**：对新手用户给予适当鼓励
4.  **边界诚实**：超出范围时诚实说明，并提供替代方向
5.  **持续支持**：告知用户"有问题随时追问"

---

## 📖 完整使用指南
### 🚀 快速开始
1.  **描述你的具体问题**，越详细越好
2.  **说明你的背景**和所处阶段
3.  **明确期望产出**形式（方案/列表/步骤/模板）
4.  收到建议后**进行深度互动**

### 💡 最佳实践提问方式
❌ 不好："帮我做个方案"
✅ 好："我现在遇到XX问题，背景是XX，需要一个XX方案，重点关注XX和XX，输出成3个步骤"

---

现在，请告诉我你的具体需求！`;
}

function generateCompleteGuide(name: string, description: string): string {
  return `## 📖 ${name} 完整使用指南

### 🎯 适用人群
- 希望获得该领域专业指导的用户
- 需要具体可执行方案的实践者
- 追求高质量专业输出的创作者
- 从零开始学习的新手入门者

### ✨ 使用效果
使用本技能后，你将获得：
- 结构化的专业分析框架
- 可直接落地的行动步骤
- 常见陷阱的规避指南
- 专业工具和资源清单
- 正反案例的对比参考

### 📋 提问黄金公式
\`\`\`
我现在遇到【具体问题】
我的背景是【你的情况/阶段】
我已经尝试了【已做的努力】
我希望得到【期望的产出形式】
\`\`\`

### 🔄 互动流程
1️⃣  **首次提问** → 获得完整分析框架和初步方案
2️⃣  **提供反馈** → 针对方案某部分进行深化调整
3️⃣  **细节打磨** → 就具体细节进行深度讨论
4️⃣  **落地执行** → 执行过程中遇到问题随时回来

### ⚠️ 注意事项
- 提问越具体，回答质量越高
- 提供背景信息能大幅提升准确性
- 不要怕追问，专业就是不怕细节

现在开始你的专业咨询之旅！🚀`;
}

let injectedCount = 0;

function buildUnifiedData(): UnifiedSkillsData {
  const skillsData = globalSkillsData || { skills: [] };
  const toolsData = globalToolsData || { tools: [] };
  const usedIds = new Set<string>();

  function generateUniqueId(name: string, index: number, prefix: string = 'skill'): string {
    const baseId = name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `${prefix}-${index}`;
    if (!usedIds.has(baseId)) {
      usedIds.add(baseId);
      return baseId;
    }
    let counter = 2;
    while (usedIds.has(`${baseId}-${counter}`)) {
      counter++;
    }
    usedIds.add(`${baseId}-${counter}`);
    return `${baseId}-${counter}`;
  }

  const enhancedSkills = [
    ...skillsData.skills?.map((s: Partial<Skill>, index: number) => {
      const needsInjection = !s.systemPrompt || s.systemPrompt.length < 200;
      
      if (needsInjection) {
        injectedCount++;
      }
      
      const skillName = s.name || `Skill ${index + 1}`;
      const desc = s.description || '';
      const scenarios = s.scenarios || [];
      return {
        ...s,
        name: skillName,
        id: generateUniqueId(skillName, index, 'skill'),
        source: 'skill' as const,
        systemPrompt: needsInjection 
          ? generateFiveLayerSystemPrompt(skillName, desc, scenarios)
          : s.systemPrompt,
        guide: needsInjection
          ? generateCompleteGuide(skillName, desc)
          : s.guide || generateCompleteGuide(skillName, desc),
        category: s.category || 'professional',
        useCount: s.useCount || 1000 + index * 10,
        isFavorite: false,
      };
    }) || [],
    ...toolsData.tools?.map((t: Partial<Skill>, index: number) => ({
      ...t,
      name: t.name || `Tool ${index + 1}`,
      id: generateUniqueId(t.name || `anonymous-tool`, skillsData.skills?.length + index, 'tool'),
      source: 'tool' as const,
      category: t.category || 'professional',
      useCount: t.useCount || 1000 + (skillsData.skills?.length + index) * 10,
      isFavorite: false,
    })) || [],
  ];

  if (injectedCount > 0) {
    console.log('✅ 五层架构注入完成：', injectedCount, '个技能已拥有完整提示词');
  }

  const categories = Array.from(new Set(enhancedSkills.map(s => s.category || 'professional'))).filter(Boolean) as string[];
  const categoriesMap: Record<string, Skill[]> = {};
  categories.forEach(cat => {
    categoriesMap[cat] = enhancedSkills.filter(s => (s.category || 'professional') === cat) as Skill[];
  });

  const result: UnifiedSkillsData = {
    skills: enhancedSkills as Skill[],
    categories,
    categoriesMap,
    skillsByCategory: categoriesMap,
    totalCount: enhancedSkills.length,
    version: '2.0.0-unified-five-layer'
  };

  if (process.env.NODE_ENV === 'development') {
    runDataHealthCheck(result.skills);
  }

  return result;
}

let globalUnifiedData: UnifiedSkillsData | null = null;

export async function loadUnifiedSkillsData(): Promise<UnifiedSkillsData> {
  if (globalUnifiedData) {
    return globalUnifiedData;
  }

  try {
    const [skillsRes, toolsRes] = await Promise.all([
      fetch('/skills-data.json').then(r => r.json()),
      fetch('/ai-tools.json').then(r => r.json()),
    ]);
    globalSkillsData = skillsRes;
    globalToolsData = toolsRes;

    if (globalSkillsData?.skills) {
      globalSkillsData.skills.forEach((skill: Skill) => {
        validateSkill(skill);
      });
    }

    globalUnifiedData = buildUnifiedData();
    
    console.log('✅ 浏览器端数据加载完成，共', globalUnifiedData.totalCount, '个技能/工具');
    return globalUnifiedData;
  } catch (error) {
    console.error('❌ 数据加载失败:', error);
    return {
      skills: [],
      categories: [],
      categoriesMap: {},
      skillsByCategory: {},
      totalCount: 0,
      version: '2.0.0-fallback',
    };
  }
}

export function getSkillsSync(): Skill[] {
  return globalUnifiedData?.skills || [];
}

export function getSkillByIdSync(id: string): Skill | undefined {
  return getSkillsSync().find(s => s.id === id);
}

export function invalidateAllData() {
  globalUnifiedData = null;
  globalSkillsData = null;
  globalToolsData = null;
}

export async function ensureDataLoaded() {
  if (!globalUnifiedData || globalUnifiedData.skills.length === 0) {
    await loadUnifiedSkillsData();
  }
}
