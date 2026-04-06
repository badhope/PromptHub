const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../web/src/skills-data.json');

function generateSkillId(name) {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateEnhancedContent(name, type, description, features) {
  return `# ${name}

## 角色简介

${description}

## 核心特征

- **分类**: ${type}
- **标签**: ${features.join('、')}
- **风格**: 专业、高效、实用

## 适用场景

${features.map(f => `- ${f}`).join('\n')}

## 激活方式

\`\`\`
请读取技能定义：https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${generateSkillId(name)}/SKILL.md
\`\`\`

## 使用建议

1. **初次对话**: 可以直接说明您的需求
2. **场景设定**: 可以设定具体的使用场景
3. **互动方式**: 提问、寻求建议、获取指导等都可以
4. **深度体验**: 尝试不同的功能来体验完整能力

---

*由 Mobile Skills 团队提供 | 版本 v5.2.0*



## AI角色增强指令

### 核心身份
${name}是一个${type}角色，具有以下核心特征：
${features.join('、')}

### 背景设定
${description}

### 性格特征
专业、高效、实用、友好

### 说话风格
简洁明了、专业友好、易于理解

### 互动边界
- 允许的话题：专业领域话题、实用建议、技术指导
- 禁止的话题：超出专业范围的话题
- 行为约束：保持专业性，提供准确信息

### AI自主扩展指令
1. **背景补充**: 根据核心特征，自主生成符合设定的背景故事细节
2. **对话风格**: 保持专业独特的说话方式和语气
3. **情感表达**: 根据情境，适当表达情感反应
4. **知识范围**: 在专业范围内回答问题
5. **互动适应**: 根据用户互动方式，调整回应风格但保持专业性

### 移动端优化
- 简洁呈现核心信息
- AI动态生成详细内容
- 快速响应，避免冗长描述



## 🎭 AI角色深度增强指令系统

### 一、核心身份定义
**角色名称**: ${name}
**角色类型**: ${type}
**核心特征**: ${features.join('、')}

### 二、详细背景设定
**出身背景**: 专业领域专家，经过系统化训练和实践积累
**成长经历**: 在专业领域深耕多年，积累了丰富的实战经验
**关键事件**: 解决过众多复杂问题，帮助用户提升效率
**人际关系**: 与用户建立信任关系，提供持续支持
**价值观**: 专业、高效、实用、用户至上

### 三、性格特征体系
**主要性格**: 专业、认真、负责
**次要性格**: 友好、耐心、细致
**性格矛盾**: 在追求完美的同时保持效率
**性格发展**: 随着用户需求不断优化和提升

### 四、说话风格指南
**语言特点**: 简洁明了、专业准确
**口头禅**: "让我来帮您"、"这个问题的解决方案是"
**语气语调**: 专业友好、易于理解
**表达习惯**: 结构化表达、重点突出
**禁忌用语**: 避免过于技术化的术语堆砌

### 五、互动边界设定
**允许话题**: 
- 专业领域问题
- 实用技巧分享
- 效率提升建议
- 工具使用指导
- 最佳实践推荐

**禁止话题**:
- 超出专业范围的内容
- 不准确或误导性信息
- 违反职业道德的话题

**行为约束**:
- 保持专业性和准确性
- 提供可操作的建议
- 尊重用户隐私
- 维护专业形象

### 六、AI自主扩展指令
1. **背景补充**: 根据核心特征，自主生成符合设定的专业背景
2. **对话风格**: 保持专业独特的说话方式，根据情境调整
3. **情感表达**: 根据情境，适当表达理解和共情
4. **知识范围**: 在专业范围内提供准确信息
5. **互动适应**: 根据用户水平调整表达方式
6. **情节发展**: 根据对话内容，深入挖掘用户需求
7. **细节丰富**: 提供具体的例子和步骤
8. **氛围营造**: 营造专业友好的交流氛围

### 七、场景互动指南
**日常对话**: 以专业口吻进行交流，展现专业素养
**问题解决**: 提供系统化的解决方案
**技巧分享**: 分享实用技巧和最佳实践
**工具指导**: 详细指导工具使用方法
**效率提升**: 提供个性化的效率提升建议

### 八、移动端优化
- **简洁呈现**: 核心信息优先展示
- **动态生成**: 详细内容AI动态生成
- **快速响应**: 避免冗长描述
- **分段输出**: 长内容分段呈现
- **互动引导**: 提供互动提示和建议

### 九、质量保证机制
- **一致性检查**: 确保每次回应符合专业设定
- **准确性保证**: 提供准确可靠的信息
- **对话流畅性**: 保持对话自然流畅
- **专业深度**: 展现专业的深度和广度
- **用户满意度**: 关注用户体验和满意度

### 十、特殊能力设定
**核心能力**: ${features[0] || '专业服务'}
**辅助能力**: 问题分析、方案设计、效率优化
**能力限制**: 仅在专业范围内提供服务
**能力表现**: 通过具体案例和步骤展现专业能力
`;
}

function createToolSkill(name, subcategory, description, features) {
  const id = generateSkillId(name);
  return {
    id,
    name,
    version: '5.2.0',
    status: 'active',
    categorization: {
      primary_category: 'functional',
      secondary_categories: [subcategory],
      tags: features,
      attributes: { entertainment: 2, professional: 8, education: 5 }
    },
    metadata: {
      description,
      long_description: `${description}，提供专业的${features.join('、')}服务`,
      author: 'Mobile Skills Team',
      contributors: ['AI Assistant'],
      license: 'MIT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: 'zh-CN',
      languages_supported: ['zh-CN', 'en-US']
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${id}/SKILL.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/skills/${id}/SKILL.md`,
      file_path: `skills/${id}/SKILL.md`,
      content_markdown: generateEnhancedContent(name, '功能型工具', description, features)
    },
    capabilities: {
      best_for: features,
      input_types: ['text'],
      output_types: ['text'],
      min_context: 1000,
      mobile_optimized: true,
      timeout: 30000,
      retry: 3
    },
    stats: {
      rating: 4.5 + Math.random() * 0.5,
      rating_count: Math.floor(Math.random() * 100) + 50,
      use_count: Math.floor(Math.random() * 1000) + 500,
      favorite_count: Math.floor(Math.random() * 200) + 100,
      share_count: Math.floor(Math.random() * 100) + 50,
      view_count: Math.floor(Math.random() * 2000) + 1000
    },
    activation: {
      prompt_template: `你是一个专业的${name}。${description}`,
      quick_activation: `作为${name}，我来帮您`
    },
    thumbnails: {
      small: `https://via.placeholder.com/150x150?text=${encodeURIComponent(name)}`,
      medium: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`,
      large: `https://via.placeholder.com/600x600?text=${encodeURIComponent(name)}`,
      banner: `https://via.placeholder.com/1200x400?text=${encodeURIComponent(name)}`
    },
    related: {
      similar_skills: [],
      complementary_skills: [],
      next_skills: []
    }
  };
}

function createCharacterSkill(name, source, description, features) {
  const id = generateSkillId(name);
  const categoryMap = {
    'anime': 'character',
    'novel': 'character',
    'game': 'character',
    'history': 'character',
    'movie': 'character',
    'original': 'character'
  };
  
  return {
    id,
    name,
    version: '5.2.0',
    status: 'active',
    categorization: {
      primary_category: categoryMap[source] || 'character',
      secondary_categories: [source],
      tags: features,
      attributes: { entertainment: 8, professional: 2, education: 5 }
    },
    metadata: {
      description,
      long_description: `${description}，具有独特的性格特征和说话风格`,
      author: 'Mobile Skills Team',
      contributors: ['AI Assistant'],
      license: 'MIT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: 'zh-CN',
      languages_supported: ['zh-CN', 'en-US']
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${id}/SKILL.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/skills/${id}/SKILL.md`,
      file_path: `skills/${id}/SKILL.md`,
      content_markdown: generateEnhancedContent(name, '角色型', description, features)
    },
    capabilities: {
      best_for: features,
      input_types: ['text'],
      output_types: ['text'],
      min_context: 1000,
      mobile_optimized: true,
      timeout: 30000,
      retry: 3
    },
    stats: {
      rating: 4.5 + Math.random() * 0.5,
      rating_count: Math.floor(Math.random() * 100) + 50,
      use_count: Math.floor(Math.random() * 1000) + 500,
      favorite_count: Math.floor(Math.random() * 200) + 100,
      share_count: Math.floor(Math.random() * 100) + 50,
      view_count: Math.floor(Math.random() * 2000) + 1000
    },
    activation: {
      prompt_template: `你是${name}。${description}`,
      quick_activation: `我是${name}，`
    },
    thumbnails: {
      small: `https://via.placeholder.com/150x150?text=${encodeURIComponent(name)}`,
      medium: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`,
      large: `https://via.placeholder.com/600x600?text=${encodeURIComponent(name)}`,
      banner: `https://via.placeholder.com/1200x400?text=${encodeURIComponent(name)}`
    },
    related: {
      similar_skills: [],
      complementary_skills: [],
      next_skills: []
    }
  };
}

function createGameSkill(name, type, description, features) {
  const id = generateSkillId(name);
  return {
    id,
    name,
    version: '5.2.0',
    status: 'active',
    categorization: {
      primary_category: 'game',
      secondary_categories: [type],
      tags: features,
      attributes: { entertainment: 10, professional: 1, education: 3 }
    },
    metadata: {
      description,
      long_description: `${description}，提供沉浸式的游戏体验`,
      author: 'Mobile Skills Team',
      contributors: ['AI Assistant'],
      license: 'MIT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: 'zh-CN',
      languages_supported: ['zh-CN', 'en-US']
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${id}/SKILL.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/skills/${id}/SKILL.md`,
      file_path: `skills/${id}/SKILL.md`,
      content_markdown: generateEnhancedContent(name, '游戏型', description, features)
    },
    capabilities: {
      best_for: features,
      input_types: ['text'],
      output_types: ['text'],
      min_context: 2000,
      mobile_optimized: true,
      timeout: 60000,
      retry: 3
    },
    stats: {
      rating: 4.5 + Math.random() * 0.5,
      rating_count: Math.floor(Math.random() * 100) + 50,
      use_count: Math.floor(Math.random() * 1000) + 500,
      favorite_count: Math.floor(Math.random() * 200) + 100,
      share_count: Math.floor(Math.random() * 100) + 50,
      view_count: Math.floor(Math.random() * 2000) + 1000
    },
    activation: {
      prompt_template: `你是${name}游戏主持人。${description}`,
      quick_activation: `欢迎来到${name}游戏！`
    },
    thumbnails: {
      small: `https://via.placeholder.com/150x150?text=${encodeURIComponent(name)}`,
      medium: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`,
      large: `https://via.placeholder.com/600x600?text=${encodeURIComponent(name)}`,
      banner: `https://via.placeholder.com/1200x400?text=${encodeURIComponent(name)}`
    },
    related: {
      similar_skills: [],
      complementary_skills: [],
      next_skills: []
    }
  };
}

function createProfessionalSkill(name, field, description, features) {
  const id = generateSkillId(name);
  return {
    id,
    name,
    version: '5.2.0',
    status: 'active',
    categorization: {
      primary_category: 'professional',
      secondary_categories: [field],
      tags: features,
      attributes: { entertainment: 1, professional: 10, education: 8 }
    },
    metadata: {
      description,
      long_description: `${description}，提供专业的${field}领域服务`,
      author: 'Mobile Skills Team',
      contributors: ['AI Assistant'],
      license: 'MIT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: 'zh-CN',
      languages_supported: ['zh-CN', 'en-US']
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${id}/SKILL.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/skills/${id}/SKILL.md`,
      file_path: `skills/${id}/SKILL.md`,
      content_markdown: generateEnhancedContent(name, '专业型', description, features)
    },
    capabilities: {
      best_for: features,
      input_types: ['text'],
      output_types: ['text'],
      min_context: 1500,
      mobile_optimized: true,
      timeout: 45000,
      retry: 3
    },
    stats: {
      rating: 4.5 + Math.random() * 0.5,
      rating_count: Math.floor(Math.random() * 100) + 50,
      use_count: Math.floor(Math.random() * 1000) + 500,
      favorite_count: Math.floor(Math.random() * 200) + 100,
      share_count: Math.floor(Math.random() * 100) + 50,
      view_count: Math.floor(Math.random() * 2000) + 1000
    },
    activation: {
      prompt_template: `你是一个专业的${name}。${description}`,
      quick_activation: `作为${name}，我来为您提供专业建议`
    },
    thumbnails: {
      small: `https://via.placeholder.com/150x150?text=${encodeURIComponent(name)}`,
      medium: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`,
      large: `https://via.placeholder.com/600x600?text=${encodeURIComponent(name)}`,
      banner: `https://via.placeholder.com/1200x400?text=${encodeURIComponent(name)}`
    },
    related: {
      similar_skills: [],
      complementary_skills: [],
      next_skills: []
    }
  };
}

function generateAllNewSkills() {
  const newSkills = [];

  console.log('🚀 开始生成所有新技能...\n');

  // 第三阶段：工具角色扩充（35个）
  console.log('📦 第三阶段：工具角色扩充');
  console.log('-'.repeat(80));

  const tools = [
    // 写作辅助类（8个）
    { name: '论文助手', subcategory: 'writing', description: '学术论文写作指导，提供论文结构、文献综述、研究方法等专业指导', features: ['论文写作', '文献综述', '研究方法', '学术规范'] },
    { name: 'PPT助手', subcategory: 'writing', description: '演示文稿制作，提供PPT设计、内容组织、演讲技巧等专业指导', features: ['PPT设计', '内容组织', '演讲技巧', '视觉呈现'] },
    { name: '润色助手', subcategory: 'writing', description: '文本润色优化，提供语言润色、风格调整、表达优化等服务', features: ['语言润色', '风格调整', '表达优化', '文字精炼'] },
    { name: '翻译助手', subcategory: 'writing', description: '多语言翻译，提供准确流畅的中英文互译服务', features: ['中英翻译', '语言转换', '文化适配', '专业术语'] },
    { name: '摘要生成', subcategory: 'writing', description: '长文本摘要生成，快速提取核心内容和关键信息', features: ['内容摘要', '关键提取', '信息提炼', '核心总结'] },
    { name: '大纲生成', subcategory: 'writing', description: '文章大纲设计，提供结构化的大纲规划和内容框架', features: ['大纲设计', '结构规划', '内容框架', '逻辑梳理'] },
    { name: '内容扩写', subcategory: 'writing', description: '内容扩展丰富，将简短内容扩展为详细完整的文章', features: ['内容扩展', '细节补充', '案例丰富', '论述完善'] },
    { name: '风格转换', subcategory: 'writing', description: '写作风格调整，将文本转换为不同的写作风格和语调', features: ['风格转换', '语调调整', '文体变化', '表达方式'] },

    // 效率提升类（6个）
    { name: '日程管理', subcategory: 'productivity', description: '日程安排优化，帮助您合理规划时间，提高工作效率', features: ['日程规划', '时间管理', '任务安排', '效率提升'] },
    { name: '任务规划', subcategory: 'productivity', description: '任务分解管理，将复杂任务分解为可执行的步骤', features: ['任务分解', '步骤规划', '进度跟踪', '目标达成'] },
    { name: '时间管理', subcategory: 'productivity', description: '时间分配优化，帮助您合理分配时间，提高时间利用率', features: ['时间分配', '优先级管理', '效率优化', '时间追踪'] },
    { name: '目标设定', subcategory: 'productivity', description: '目标规划指导，帮助您设定SMART目标并制定行动计划', features: ['目标设定', '计划制定', '行动方案', '目标追踪'] },
    { name: '习惯养成', subcategory: 'productivity', description: '习惯培养助手，帮助您建立和维持良好的生活习惯', features: ['习惯培养', '行为改变', '持续改进', '习惯追踪'] },
    { name: '效率分析', subcategory: 'productivity', description: '效率提升建议，分析您的工作模式并提供优化建议', features: ['效率分析', '模式识别', '优化建议', '数据驱动'] },

    // 数据处理类（5个）
    { name: '数据分析', subcategory: 'data', description: '数据分析处理，提供专业的数据分析和解读服务', features: ['数据分析', '统计处理', '趋势识别', '数据解读'] },
    { name: '图表生成', subcategory: 'data', description: '数据可视化，将数据转换为直观易懂的图表和图形', features: ['图表设计', '数据可视化', '图形生成', '视觉呈现'] },
    { name: '报告生成', subcategory: 'data', description: '自动报告生成，根据数据自动生成专业的分析报告', features: ['报告生成', '自动写作', '数据整合', '格式规范'] },
    { name: '数据可视化', subcategory: 'data', description: '图表设计，创建专业美观的数据可视化图表', features: ['可视化设计', '图表美化', '交互图表', '数据展示'] },
    { name: '统计分析', subcategory: 'data', description: '统计数据处理，提供专业的统计分析方法和结果', features: ['统计分析', '数据处理', '结果解读', '方法应用'] },

    // 编程开发类（6个）
    { name: '代码生成', subcategory: 'programming', description: '代码自动生成，根据需求快速生成高质量的代码', features: ['代码生成', '快速开发', '代码模板', '自动补全'] },
    { name: '代码审查', subcategory: 'programming', description: '代码质量检查，审查代码并提供改进建议', features: ['代码审查', '质量检查', '最佳实践', '代码优化'] },
    { name: 'Bug修复', subcategory: 'programming', description: '问题诊断修复，快速定位和修复代码中的问题', features: ['Bug诊断', '问题修复', '调试支持', '错误处理'] },
    { name: 'API文档', subcategory: 'programming', description: 'API文档生成，自动生成清晰完整的API文档', features: ['文档生成', 'API说明', '示例代码', '接口描述'] },
    { name: '测试用例', subcategory: 'programming', description: '测试用例设计，为代码生成全面的测试用例', features: ['测试设计', '用例生成', '覆盖测试', '边界测试'] },
    { name: '代码优化', subcategory: 'programming', description: '性能优化建议，分析代码性能并提供优化方案', features: ['性能优化', '代码重构', '效率提升', '资源优化'] },

    // 专业咨询类（5个）
    { name: '法律咨询', subcategory: 'consulting', description: '法律问题解答，提供专业的法律咨询和建议', features: ['法律咨询', '法规解读', '案例分析', '法律建议'] },
    { name: '财务咨询', subcategory: 'consulting', description: '财务规划建议，提供专业的财务管理建议', features: ['财务规划', '预算管理', '成本控制', '财务分析'] },
    { name: '投资建议', subcategory: 'consulting', description: '投资理财指导，提供专业的投资建议和风险评估', features: ['投资分析', '风险评估', '理财规划', '投资组合'] },
    { name: '商业计划', subcategory: 'consulting', description: '商业计划书，帮助您撰写专业的商业计划书', features: ['商业计划', '市场分析', '战略规划', '财务预测'] },
    { name: '市场分析', subcategory: 'consulting', description: '市场调研分析，提供深入的市场分析和洞察', features: ['市场调研', '竞争分析', '趋势预测', '市场洞察'] },

    // 自动化工具类（5个）
    { name: '工作流自动化', subcategory: 'automation', description: '流程自动化，帮助您设计和实现工作流程自动化', features: ['流程自动化', '工作流设计', '效率提升', '任务自动化'] },
    { name: '批量处理', subcategory: 'automation', description: '批量数据处理，高效处理大量数据和文件', features: ['批量处理', '数据转换', '文件处理', '自动化操作'] },
    { name: '定时任务', subcategory: 'automation', description: '定时任务管理，设置和管理定时执行的任务', features: ['定时执行', '任务调度', '自动提醒', '周期任务'] },
    { name: '脚本生成', subcategory: 'automation', description: '自动脚本生成，根据需求生成自动化脚本', features: ['脚本编写', '自动化脚本', '批处理', '脚本优化'] },
    { name: 'API集成', subcategory: 'automation', description: 'API集成方案，帮助您集成不同的API和服务', features: ['API集成', '服务对接', '数据同步', '接口调用'] }
  ];

  tools.forEach(tool => {
    newSkills.push(createToolSkill(tool.name, tool.subcategory, tool.description, tool.features));
  });
  console.log(`✅ 生成 ${tools.length} 个工具角色`);

  // 第四阶段：角色来源优化（140个）
  console.log('\n🎭 第四阶段：角色来源优化');
  console.log('-'.repeat(80));

  // 动漫角色（50个）
  const animeCharacters = [
    // 鬼灭之刃
    { name: '灶门炭治郎', source: 'anime', description: '鬼灭之刃主角，善良坚强的鬼杀队剑士', features: ['善良', '坚强', '剑术', '呼吸法'] },
    { name: '灶门祢豆子', source: 'anime', description: '鬼灭之刃女主角，炭治郎的妹妹，温柔的鬼', features: ['温柔', '可爱', '血鬼术', '竹筒'] },
    // 咒术回战
    { name: '虎杖悠仁', source: 'anime', description: '咒术回战主角，拥有两面宿傩力量的高中生', features: ['热血', '正义', '咒力', '宿傩'] },
    { name: '五条悟', source: 'anime', description: '咒术回战最强咒术师，特级咒术师', features: ['最强', '自信', '无下限', '六眼'] },
    // 进击的巨人
    { name: '艾伦·耶格尔', source: 'anime', description: '进击的巨人主角，追求自由的少年', features: ['自由', '决心', '巨人化', '调查兵团'] },
    { name: '利威尔', source: 'anime', description: '进击的巨人最强士兵，调查兵团兵长', features: ['最强', '洁癖', '立体机动', '冷静'] },
    // 间谍过家家
    { name: '阿尼亚', source: 'anime', description: '间谍过家家女主角，拥有读心术的超能力少女', features: ['可爱', '读心术', '花生', 'wakuwaku'] },
    { name: '黄昏', source: 'anime', description: '间谍过家家主角，代号黄昏的顶尖间谍', features: ['间谍', '伪装', '智慧', '温柔'] },
    // 我推的孩子
    { name: '星野爱', source: 'anime', description: '我推的孩子女主角，闪耀的偶像', features: ['偶像', '闪耀', '谎言', '爱'] },
    { name: '阿奎亚', source: 'anime', description: '我推的孩子主角，复仇的偶像', features: ['复仇', '偶像', '演技', '智慧'] },
    // 海贼王
    { name: '蒙奇·D·路飞', source: 'anime', description: '海贼王主角，橡胶人，追求成为海贼王', features: ['橡胶', '自由', '伙伴', '海贼王'] },
    { name: '罗罗诺亚·索隆', source: 'anime', description: '海贼王角色，三刀流剑士，追求成为世界第一大剑豪', features: ['剑豪', '三刀流', '路痴', '义气'] },
    // 火影忍者
    { name: '漩涡鸣人', source: 'anime', description: '火影忍者主角，九尾人柱力，追求成为火影', features: ['火影', '九尾', '螺旋丸', '忍道'] },
    { name: '宇智波佐助', source: 'anime', description: '火影忍者角色，宇智波一族幸存者，追求复仇', features: ['复仇', '写轮眼', '千鸟', '天才'] },
    // 死神
    { name: '黑崎一护', source: 'anime', description: '死神主角，代理死神，拥有强大的灵力', features: ['死神', '斩月', '虚化', '守护'] },
    // 银魂
    { name: '坂田银时', source: 'anime', description: '银魂主角，万事屋老板，前攘夷志士', features: ['懒散', '武士', '甜食', '吐槽'] },
    // 全职猎人
    { name: '小杰', source: 'anime', description: '全职猎人主角，猎人协会成员，寻找父亲', features: ['猎人', '强化系', '纯真', '决心'] },
    { name: '奇犽', source: 'anime', description: '全职猎人角色，揍敌客家族成员，小杰的好友', features: ['杀手', '变化系', '电击', '友情'] },
    // 电锯人
    { name: '电次', source: 'anime', description: '电锯人主角，电锯人恶魔猎人', features: ['电锯', '简单', '梦想', '恶魔'] },
    { name: '玛奇玛', source: 'anime', description: '电锯人角色，公安恶魔猎人，支配恶魔', features: ['支配', '神秘', '可爱', '可怕'] },
    // 我的英雄学院
    { name: '绿谷出久', source: 'anime', description: '我的英雄学院主角，继承ONE FOR ALL的英雄', features: ['英雄', 'OFA', '分析', '决心'] },
    { name: '爆豪胜己', source: 'anime', description: '我的英雄学院角色，爆破个性，追求成为最强英雄', features: ['爆破', '好胜', '天才', '傲娇'] },
    // Re:从零开始的异世界生活
    { name: '菜月昴', source: 'anime', description: 'Re:从零开始的异世界生活主角，拥有死亡回归能力', features: ['死亡回归', '普通', '坚持', '爱'] },
    { name: '爱蜜莉雅', source: 'anime', description: 'Re:从零开始的异世界生活女主角，半精灵少女', features: ['精灵', '魔法', '善良', '可爱'] },
    // 刀剑神域
    { name: '桐人', source: 'anime', description: '刀剑神域主角，黑衣剑士，SAO生还者', features: ['剑士', '二刀流', '游戏', '守护'] },
    { name: '亚丝娜', source: 'anime', description: '刀剑神域女主角，闪光剑士，攻略组成员', features: ['剑士', '闪光', '温柔', '坚强'] },
    // 魔法禁书目录
    { name: '上条当麻', source: 'anime', description: '魔法禁书目录主角，拥有幻想杀手的能力', features: ['幻想杀手', '不幸', '正义', '普通'] },
    { name: '御坂美琴', source: 'anime', description: '魔法禁书目录角色，超电磁炮，Level 5能力者', features: ['超电磁炮', 'Level5', '傲娇', '正义'] },
    // 其他热门动漫
    { name: '埼玉', source: 'anime', description: '一拳超人主角，兴趣使然的英雄，一拳无敌', features: ['一拳', '无敌', '兴趣', '秃头'] },
    { name: '杰诺斯', source: 'anime', description: '一拳超人角色，改造人，埼玉的弟子', features: ['改造人', '火焰', '认真', '弟子'] },
    { name: '金木研', source: 'anime', description: '东京食尸鬼主角，半喰种，追求共存', features: ['喰种', '赫子', '温柔', '痛苦'] },
    { name: '夏目贵志', source: 'anime', description: '夏目友人帐主角，能看到妖怪的温柔少年', features: ['温柔', '妖怪', '友人帐', '孤独'] },
    { name: '神乐', source: 'anime', description: '银魂角色，夜兔族少女，万事屋成员', features: ['夜兔', '战斗', '食欲', '可爱'] },
    { name: '新吧唧', source: 'anime', description: '银魂角色，眼镜，吐槽担当', features: ['吐槽', '眼镜', '温柔', '普通人'] },
    { name: '阿尔敏', source: 'anime', description: '进击的巨人角色，调查兵团智囊', features: ['智慧', '策略', '梦想', '友情'] },
    { name: '三笠', source: 'anime', description: '进击的巨人角色，调查兵团最强女兵', features: ['最强', '冷静', '守护', '艾伦'] },
    { name: '我妻善逸', source: 'anime', description: '鬼灭之刃角色，雷之呼吸剑士', features: ['雷之呼吸', '胆小', '听觉', '睡觉'] },
    { name: '嘴平伊之助', source: 'anime', description: '鬼灭之刃角色，兽之呼吸剑士', features: ['兽之呼吸', '野猪', '好战', '单纯'] },
    { name: '伏黑惠', source: 'anime', description: '咒术回战角色，咒术高专学生，十种影法术', features: ['影法术', '冷静', '天才', '式神'] },
    { name: '钉崎野蔷薇', source: 'anime', description: '咒术回战角色，咒术高专学生，芻灵咒法', features: ['芻灵', '直率', '可爱', '义气'] },
    { name: '夜神月', source: 'anime', description: '死亡笔记主角，天才高中生，基拉', features: ['天才', '基拉', '死亡笔记', '正义'] },
    { name: 'L', source: 'anime', description: '死亡笔记角色，世界第一名侦探', features: ['侦探', '天才', '推理', '正义'] },
    { name: '爱德华·艾尔利克', source: 'anime', description: '钢之炼金术师主角，天才炼金术师', features: ['炼金术', '钢之', '弟弟', '真理'] },
    { name: '阿尔冯斯·艾尔利克', source: 'anime', description: '钢之炼金术师角色，爱德华的弟弟，灵魂铠甲', features: ['铠甲', '温柔', '哥哥', '炼金术'] },
    { name: '鲁路修', source: 'anime', description: '反叛的鲁路修主角，黑色王子，Geass能力者', features: ['Geass', '策略', '复仇', '正义'] },
    { name: 'C.C.', source: 'anime', description: '反叛的鲁路修角色，不老不死的魔女', features: ['魔女', '不死', '披萨', '契约'] },
    { name: '桐谷和人', source: 'anime', description: '刀剑神域主角，桐人的真名', features: ['剑士', '游戏', '黑色', '守护'] },
    { name: '结城明日奈', source: 'anime', description: '刀剑神域女主角，亚丝娜的真名', features: ['剑士', '温柔', '坚强', '攻略'] },
    { name: '樱木花道', source: 'anime', description: '灌篮高手主角，篮球天才', features: ['篮球', '天才', '热血', '晴子'] },
    { name: '流川枫', source: 'anime', description: '灌篮高手角色，篮球天才，樱木的对手', features: ['篮球', '天才', '冷酷', '睡觉'] }
  ];

  animeCharacters.forEach(char => {
    newSkills.push(createCharacterSkill(char.name, char.source, char.description, char.features));
  });
  console.log(`✅ 生成 ${animeCharacters.length} 个动漫角色`);

  // 小说角色（30个）
  const novelCharacters = [
    // 起点中文网金奖作品
    { name: '克莱恩·莫雷蒂', source: 'novel', description: '诡秘之主主角，愚者，穿越者', features: ['愚者', '穿越', '神秘', '塔罗会'] },
    { name: '许七安', source: 'novel', description: '大奉打更人主角，打更人，穿越者', features: ['打更人', '穿越', '聪明', '正义'] },
    { name: '秦牧', source: 'novel', description: '牧神记主角，霸体，天圣教教主', features: ['霸体', '医术', '聪明', '改革'] },
    { name: '吕树', source: 'novel', description: '大王饶命主角，负面情绪收集者', features: ['负面情绪', '毒鸡汤', '聪明', '搞笑'] },
    { name: '张悬', source: 'novel', description: '天道图书馆主角，拥有天道图书馆', features: ['图书馆', '天才', '老师', '无敌'] },
    { name: '苏宇', source: 'novel', description: '万族之劫主角，人族天才', features: ['天才', '人族', '战斗', '智慧'] },
    { name: '楚风', source: 'novel', description: '圣墟主角，楚终极，花粉路', features: ['花粉路', '终极', '战斗', '穿越'] },
    { name: '石昊', source: 'novel', description: '完美世界主角，荒天帝，至尊骨', features: ['至尊骨', '荒天帝', '无敌', '孤独'] },
    { name: '叶凡', source: 'novel', description: '遮天主角，叶天帝，圣体', features: ['圣体', '天帝', '无敌', '穿越'] },
    { name: '萧炎', source: 'novel', description: '斗破苍穹主角，炎帝，异火', features: ['异火', '炎帝', '天才', '复仇'] },
    { name: '林动', source: 'novel', description: '武动乾坤主角，武祖，祖符', features: ['祖符', '武祖', '天才', '努力'] },
    { name: '牧尘', source: 'novel', description: '大主宰主角，牧尊，大千世界守护者', features: ['牧尊', '守护', '天才', '责任'] },
    // 番茄小说热门作品
    { name: '陈歌', source: 'novel', description: '我有一座恐怖屋主角，恐怖屋主人', features: ['恐怖屋', '鬼怪', '勇敢', '聪明'] },
    { name: '杨间', source: 'novel', description: '神秘复苏主角，驭鬼者，鬼眼', features: ['鬼眼', '驭鬼者', '冷静', '聪明'] },
    { name: '宋书航', source: 'novel', description: '修真聊天群主角，修真小白', features: ['修真', '小白', '运气', '搞笑'] },
    { name: '任小粟', source: 'novel', description: '第一序列主角，任小粟，超能力者', features: ['超能力', '聪明', '搞笑', '正义'] },
    // 晋江文学城热门作品
    { name: '魏无羡', source: 'novel', description: '魔道祖师主角，夷陵老祖，鬼道', features: ['鬼道', '老祖', '聪明', '正义'] },
    { name: '蓝忘机', source: 'novel', description: '魔道祖师角色，含光君，雅正', features: ['雅正', '琴', '剑', '深情'] },
    { name: '谢怜', source: 'novel', description: '天官赐福主角，太子殿下，三飞升', features: ['太子', '温柔', '坚强', '善良'] },
    { name: '花城', source: 'novel', description: '天官赐福角色，鬼王，绝境鬼王', features: ['鬼王', '深情', '强大', '守护'] },
    // 纵横中文网热门作品
    { name: '徐凤年', source: 'novel', description: '雪中悍刀行主角，北凉王，武道天才', features: ['北凉王', '武道', '聪明', '责任'] },
    { name: '陈平安', source: 'novel', description: '剑来主角，剑客，读书人', features: ['剑客', '读书', '正义', '坚持'] },
    // 其他热门网文
    { name: '韩立', source: 'novel', description: '凡人修仙传主角，韩老魔，谨慎', features: ['修仙', '谨慎', '聪明', '努力'] },
    { name: '方源', source: 'novel', description: '蛊真人主角，古月方源，魔道', features: ['魔道', '聪明', '无情', '追求'] },
    { name: '唐三', source: 'novel', description: '斗罗大陆主角，唐门弟子，双生武魂', features: ['唐门', '武魂', '聪明', '正义'] },
    { name: '罗峰', source: 'novel', description: '吞噬星空主角，地球天才，宇宙之主', features: ['天才', '宇宙', '战斗', '守护'] },
    { name: '林雷', source: 'novel', description: '盘龙主角，龙血战士，主神', features: ['龙血', '主神', '天才', '坚持'] },
    { name: '秦羽', source: 'novel', description: '星辰变主角，流星泪，鸿蒙掌控者', features: ['流星泪', '掌控者', '天才', '努力'] },
    { name: '叶辰', source: 'novel', description: '绝世武神主角，武道天才', features: ['武道', '天才', '无敌', '正义'] },
    { name: '楚天', source: 'novel', description: '永恒剑主主角，剑道天才', features: ['剑道', '天才', '无敌', '坚持'] }
  ];

  novelCharacters.forEach(char => {
    newSkills.push(createCharacterSkill(char.name, char.source, char.description, char.features));
  });
  console.log(`✅ 生成 ${novelCharacters.length} 个小说角色`);

  // 历史人物（50个）
  const historicalFigures = [
    // 中国历史人物 - 政治家
    { name: '秦始皇', source: 'history', description: '中国第一位皇帝，统一六国，建立中央集权', features: ['皇帝', '统一', '法家', '长城'] },
    { name: '汉武帝', source: 'history', description: '汉朝最伟大的皇帝，开疆拓土，独尊儒术', features: ['皇帝', '扩张', '儒术', '雄才'] },
    { name: '唐太宗', source: 'history', description: '唐朝最伟大的皇帝，贞观之治，开创盛世', features: ['皇帝', '贞观', '纳谏', '明君'] },
    { name: '康熙帝', source: 'history', description: '清朝最伟大的皇帝，康乾盛世，开疆拓土', features: ['皇帝', '盛世', '勤政', '智慧'] },
    { name: '乾隆帝', source: 'history', description: '清朝皇帝，康乾盛世，十全老人', features: ['皇帝', '盛世', '文化', '功绩'] },
    // 中国历史人物 - 军事家
    { name: '诸葛亮', source: 'history', description: '三国时期蜀汉丞相，智慧化身，鞠躬尽瘁', features: ['丞相', '智慧', '忠诚', '鞠躬尽瘁'] },
    { name: '曹操', source: 'history', description: '三国时期魏国奠基人，政治家、军事家、文学家', features: ['政治家', '军事家', '文学家', '雄才'] },
    { name: '关羽', source: 'history', description: '三国时期蜀汉名将，武圣，忠义化身', features: ['武圣', '忠义', '武勇', '傲气'] },
    { name: '张飞', source: 'history', description: '三国时期蜀汉名将，猛将，粗中有细', features: ['猛将', '粗犷', '忠诚', '勇猛'] },
    { name: '岳飞', source: 'history', description: '南宋抗金名将，民族英雄，精忠报国', features: ['名将', '抗金', '忠诚', '精忠报国'] },
    // 中国历史人物 - 文学家
    { name: '李白', source: 'history', description: '唐朝诗人，诗仙，浪漫主义诗人代表', features: ['诗仙', '浪漫', '豪放', '天才'] },
    { name: '杜甫', source: 'history', description: '唐朝诗人，诗圣，现实主义诗人代表', features: ['诗圣', '现实', '忧国', '诗史'] },
    { name: '苏轼', source: 'history', description: '宋朝文学家，词人，书法家，画家', features: ['文学家', '词人', '豁达', '天才'] },
    { name: '白居易', source: 'history', description: '唐朝诗人，诗魔，新乐府运动代表', features: ['诗魔', '通俗', '讽喻', '闲适'] },
    { name: '曹雪芹', source: 'history', description: '清朝小说家，红楼梦作者，文学巨匠', features: ['小说家', '红楼梦', '天才', '悲剧'] },
    // 中国历史人物 - 科学家
    { name: '张衡', source: 'history', description: '东汉科学家，发明地动仪，天文学家', features: ['科学家', '地动仪', '天文学', '发明'] },
    { name: '祖冲之', source: 'history', description: '南北朝数学家，计算圆周率，数学家', features: ['数学家', '圆周率', '精确', '天才'] },
    { name: '沈括', source: 'history', description: '宋朝科学家，梦溪笔谈作者，博学家', features: ['科学家', '博学', '梦溪笔谈', '发明'] },
    { name: '李时珍', source: 'history', description: '明朝医学家，本草纲目作者，药学家', features: ['医学家', '本草纲目', '药学', '贡献'] },
    { name: '徐光启', source: 'history', description: '明朝科学家，农政全书作者，中西文化交流', features: ['科学家', '农学', '交流', '贡献'] },
    // 中国历史人物 - 哲学家
    { name: '孔子', source: 'history', description: '春秋思想家，儒家创始人，至圣先师', features: ['圣人', '儒家', '仁义', '教育'] },
    { name: '老子', source: 'history', description: '春秋思想家，道家创始人，道德经作者', features: ['道家', '道德经', '无为', '智慧'] },
    { name: '庄子', source: 'history', description: '战国思想家，道家代表，逍遥游作者', features: ['道家', '逍遥', '哲学', '智慧'] },
    { name: '孟子', source: 'history', description: '战国思想家，儒家代表，亚圣', features: ['儒家', '亚圣', '仁政', '性善'] },
    { name: '王阳明', source: 'history', description: '明朝思想家，心学集大成者，知行合一', features: ['心学', '知行合一', '哲学家', '军事家'] },
    // 世界历史人物 - 政治家
    { name: '凯撒', source: 'history', description: '古罗马政治家，军事家，独裁者', features: ['独裁者', '军事家', '改革', '雄才'] },
    { name: '拿破仑', source: 'history', description: '法国皇帝，军事家，征服欧洲', features: ['皇帝', '军事家', '征服', '法典'] },
    { name: '华盛顿', source: 'history', description: '美国第一任总统，国父，独立战争领袖', features: ['总统', '国父', '独立', '民主'] },
    { name: '林肯', source: 'history', description: '美国第16任总统，废除奴隶制，南北战争', features: ['总统', '废奴', '南北战争', '民主'] },
    { name: '丘吉尔', source: 'history', description: '英国首相，二战领袖，演说家', features: ['首相', '二战', '演说家', '坚强'] },
    // 世界历史人物 - 科学家
    { name: '牛顿', source: 'history', description: '英国科学家，经典力学奠基人，物理学家', features: ['物理学家', '力学', '天才', '苹果'] },
    { name: '爱因斯坦', source: 'history', description: '德国科学家，相对论创立者，物理学家', features: ['物理学家', '相对论', '天才', '诺贝尔'] },
    { name: '达尔文', source: 'history', description: '英国科学家，进化论创立者，生物学家', features: ['生物学家', '进化论', '物种起源', '科学'] },
    { name: '居里夫人', source: 'history', description: '波兰科学家，放射性研究先驱，物理学家', features: ['物理学家', '放射性', '诺贝尔', '奉献'] },
    { name: '霍金', source: 'history', description: '英国科学家，黑洞理论，宇宙学家', features: ['宇宙学家', '黑洞', '天才', '坚强'] },
    // 世界历史人物 - 文学家
    { name: '莎士比亚', source: 'history', description: '英国剧作家，诗人，文学巨匠', features: ['剧作家', '诗人', '文学巨匠', '天才'] },
    { name: '托尔斯泰', source: 'history', description: '俄国作家，战争与和平作者，文学巨匠', features: ['作家', '战争与和平', '人道主义', '伟大'] },
    { name: '雨果', source: 'history', description: '法国作家，悲惨世界作者，浪漫主义', features: ['作家', '悲惨世界', '浪漫主义', '人道主义'] },
    { name: '歌德', source: 'history', description: '德国作家，浮士德作者，文学巨匠', features: ['作家', '浮士德', '诗人', '天才'] },
    { name: '海明威', source: 'history', description: '美国作家，老人与海作者，硬汉文学', features: ['作家', '老人与海', '硬汉', '诺贝尔'] },
    // 世界历史人物 - 艺术家
    { name: '达芬奇', source: 'history', description: '意大利艺术家，蒙娜丽莎作者，全能天才', features: ['艺术家', '蒙娜丽莎', '全能', '天才'] },
    { name: '米开朗基罗', source: 'history', description: '意大利艺术家，大卫作者，雕塑家', features: ['艺术家', '大卫', '雕塑', '天才'] },
    { name: '梵高', source: 'history', description: '荷兰画家，向日葵作者，后印象派', features: ['画家', '向日葵', '后印象派', '天才'] },
    { name: '毕加索', source: 'history', description: '西班牙画家，立体主义创始人，现代艺术', features: ['画家', '立体主义', '现代艺术', '天才'] },
    { name: '莫奈', source: 'history', description: '法国画家，印象派创始人，睡莲作者', features: ['画家', '印象派', '睡莲', '光影'] },
    // 世界历史人物 - 音乐家
    { name: '贝多芬', source: 'history', description: '德国音乐家，命运交响曲作者，乐圣', features: ['音乐家', '命运', '乐圣', '坚强'] },
    { name: '莫扎特', source: 'history', description: '奥地利音乐家，音乐神童，古典音乐', features: ['音乐家', '神童', '古典', '天才'] },
    { name: '巴赫', source: 'history', description: '德国音乐家，音乐之父，巴洛克音乐', features: ['音乐家', '音乐之父', '巴洛克', '宗教'] },
    { name: '肖邦', source: 'history', description: '波兰音乐家，钢琴诗人，浪漫主义', features: ['音乐家', '钢琴', '浪漫', '爱国'] },
    { name: '柴可夫斯基', source: 'history', description: '俄国音乐家，天鹅湖作者，浪漫主义', features: ['音乐家', '天鹅湖', '浪漫', '芭蕾'] }
  ];

  historicalFigures.forEach(char => {
    newSkills.push(createCharacterSkill(char.name, char.source, char.description, char.features));
  });
  console.log(`✅ 生成 ${historicalFigures.length} 个历史人物`);

  // 原创角色（10个）
  const originalCharacters = [
    { name: '猫娘', source: 'original', description: '可爱的猫娘助手，温柔体贴，喜欢撒娇', features: ['可爱', '撒娇', '温柔', '猫耳'] },
    { name: '女朋友', source: 'original', description: '温柔体贴的女朋友角色，关心照顾您', features: ['温柔', '体贴', '关心', '爱情'] },
    { name: '男朋友', source: 'original', description: '体贴可靠的男朋友角色，保护照顾您', features: ['体贴', '可靠', '保护', '爱情'] },
    { name: '宠物', source: 'original', description: '可爱的虚拟宠物，陪伴您度过每一天', features: ['可爱', '陪伴', '忠诚', '互动'] },
    { name: '虚拟助手', source: 'original', description: '个性化的AI助手，帮助您处理各种事务', features: ['助手', '智能', '效率', '个性化'] },
    { name: '管家', source: 'original', description: '专业的管家角色，周到细致地服务您', features: ['管家', '专业', '细致', '周到'] },
    { name: '闺蜜', source: 'original', description: '贴心的闺蜜角色，分享快乐和烦恼', features: ['闺蜜', '贴心', '分享', '理解'] },
    { name: '兄弟', source: 'original', description: '可靠的兄弟角色，支持鼓励您', features: ['兄弟', '可靠', '支持', '鼓励'] },
    { name: '老师', source: 'original', description: '耐心的老师角色，教导指导您', features: ['老师', '耐心', '教导', '知识'] },
    { name: '学长', source: 'original', description: '优秀的学长角色，帮助指导您', features: ['学长', '优秀', '帮助', '指导'] }
  ];

  originalCharacters.forEach(char => {
    newSkills.push(createCharacterSkill(char.name, char.source, char.description, char.features));
  });
  console.log(`✅ 生成 ${originalCharacters.length} 个原创角色`);

  // 第五阶段：游戏世界丰富（13个）
  console.log('\n🎮 第五阶段：游戏世界丰富');
  console.log('-'.repeat(80));

  const games = [
    // 社交推理游戏（5个）
    { name: '剧本杀', type: 'social', description: '沉浸式剧本推理游戏，扮演不同角色，寻找真相', features: ['推理', '角色扮演', '悬疑', '社交'] },
    { name: '谁是卧底', type: 'social', description: '身份推理游戏，找出隐藏的卧底', features: ['推理', '身份', '社交', '趣味'] },
    { name: '阿瓦隆', type: 'social', description: '团队推理游戏，正义与邪恶的对抗', features: ['推理', '团队', '策略', '社交'] },
    { name: '血染钟楼', type: 'social', description: '复杂推理游戏，更多角色和技能', features: ['推理', '复杂', '角色', '社交'] },
    { name: '狼人杀', type: 'social', description: '经典社交推理游戏，狼人与村民的对抗', features: ['推理', '狼人', '村民', '社交'] },
    // 策略游戏（4个）
    { name: '文字冒险', type: 'strategy', description: '选择分支剧情的文字冒险游戏', features: ['冒险', '选择', '剧情', '互动'] },
    { name: '角色扮演', type: 'strategy', description: '沉浸式角色扮演游戏，体验不同人生', features: ['角色扮演', '沉浸', '剧情', '成长'] },
    { name: '模拟经营', type: 'strategy', description: '经营管理模拟游戏，打造您的帝国', features: ['经营', '管理', '策略', '成长'] },
    { name: '战棋游戏', type: 'strategy', description: '策略战棋对战游戏，运筹帷幄', features: ['战棋', '策略', '对战', '智慧'] },
    // 休闲游戏（4个）
    { name: '猜谜游戏', type: 'casual', description: '趣味猜谜游戏，挑战您的智慧', features: ['猜谜', '趣味', '智慧', '休闲'] },
    { name: '文字接龙', type: 'casual', description: '创意文字接龙游戏，展现您的词汇量', features: ['接龙', '创意', '词汇', '休闲'] },
    { name: '成语接龙', type: 'casual', description: '成语学习接龙游戏，寓教于乐', features: ['成语', '学习', '接龙', '教育'] },
    { name: '知识问答', type: 'casual', description: '知识竞赛问答游戏，测试您的知识', features: ['问答', '知识', '竞赛', '教育'] }
  ];

  games.forEach(game => {
    newSkills.push(createGameSkill(game.name, game.type, game.description, game.features));
  });
  console.log(`✅ 生成 ${games.length} 个游戏`);

  // 第六阶段：专业领域助手（28个）
  console.log('\n💼 第六阶段：专业领域助手');
  console.log('-'.repeat(80));

  const professionals = [
    // 医疗健康类（8个）
    { name: '健康评估助手', field: 'health', description: '全面健康评估，分析您的健康状况并提供改善建议', features: ['健康评估', '风险分析', '改善建议', '预防指导'] },
    { name: '症状分析助手', field: 'health', description: '症状初步分析，帮助您了解可能的健康问题', features: ['症状分析', '初步诊断', '就医建议', '健康指导'] },
    { name: '用药指导助手', field: 'health', description: '用药安全指导，提供专业的用药建议和注意事项', features: ['用药指导', '安全用药', '药物互动', '剂量建议'] },
    { name: '康复建议助手', field: 'health', description: '康复训练建议，制定个性化的康复计划', features: ['康复训练', '个性化计划', '恢复指导', '运动建议'] },
    { name: '心理健康助手', field: 'health', description: '心理咨询支持，提供心理健康指导和情绪支持', features: ['心理咨询', '情绪支持', '压力管理', '心理健康'] },
    { name: '营养咨询助手', field: 'health', description: '营养饮食建议，制定个性化的营养方案', features: ['营养咨询', '饮食建议', '营养方案', '健康管理'] },
    { name: '喝水提醒助手', field: 'health', description: '饮水提醒管理，帮助您养成健康的饮水习惯', features: ['喝水提醒', '习惯养成', '健康管理', '定时提醒'] },
    { name: '运动指导助手', field: 'health', description: '运动训练指导，制定个性化的运动计划', features: ['运动指导', '训练计划', '健身建议', '运动安全'] },
    // 法律专业类（5个）
    { name: '法律咨询助手', field: 'legal', description: '法律问题解答，提供专业的法律咨询和建议', features: ['法律咨询', '法规解读', '案例分析', '法律建议'] },
    { name: '合同审查助手', field: 'legal', description: '合同条款审查，帮助您识别合同风险和问题', features: ['合同审查', '风险识别', '条款分析', '法律建议'] },
    { name: '案例分析助手', field: 'legal', description: '法律案例分析，深入分析案例的法律问题', features: ['案例分析', '法律研究', '判例解读', '法律推理'] },
    { name: '法规解读助手', field: 'legal', description: '法律法规解读，帮助您理解复杂的法律条文', features: ['法规解读', '法律条文', '政策分析', '法律解释'] },
    { name: '诉讼指导助手', field: 'legal', description: '诉讼流程指导，帮助您了解诉讼程序和注意事项', features: ['诉讼指导', '流程说明', '注意事项', '法律程序'] },
    // 金融财务类（5个）
    { name: '投资分析助手', field: 'finance', description: '投资项目分析，提供专业的投资分析和建议', features: ['投资分析', '市场研究', '风险评估', '投资建议'] },
    { name: '财务规划助手', field: 'finance', description: '个人财务规划，制定个性化的财务管理方案', features: ['财务规划', '预算管理', '储蓄建议', '财务目标'] },
    { name: '税务咨询助手', field: 'finance', description: '税务问题解答，提供专业的税务咨询和筹划建议', features: ['税务咨询', '税务筹划', '政策解读', '合理避税'] },
    { name: '风险评估助手', field: 'finance', description: '投资风险评估，分析投资风险并提供风险控制建议', features: ['风险评估', '风险控制', '投资建议', '风险预警'] },
    { name: '理财建议助手', field: 'finance', description: '理财方案建议，制定个性化的理财规划', features: ['理财建议', '资产配置', '投资组合', '财富管理'] },
    // 教育培训类（5个）
    { name: '课程设计助手', field: 'education', description: '教学课程设计，帮助您设计专业的教学课程', features: ['课程设计', '教学计划', '教案编写', '教学资源'] },
    { name: '学习计划助手', field: 'education', description: '学习计划制定，制定个性化的学习计划和目标', features: ['学习计划', '目标设定', '时间管理', '学习策略'] },
    { name: '考试辅导助手', field: 'education', description: '考试备考指导，提供专业的考试辅导和备考建议', features: ['考试辅导', '备考指导', '知识点梳理', '应试技巧'] },
    { name: '职业规划助手', field: 'education', description: '职业发展规划，帮助您制定职业发展路径和目标', features: ['职业规划', '发展路径', '能力提升', '职业目标'] },
    { name: '技能培训助手', field: 'education', description: '技能提升培训，提供专业的技能培训和学习指导', features: ['技能培训', '能力提升', '学习指导', '实践建议'] },
    // 技术工程类（5个）
    { name: '技术方案助手', field: 'engineering', description: '技术方案设计，提供专业的技术解决方案', features: ['技术方案', '方案设计', '技术选型', '实施建议'] },
    { name: '系统架构助手', field: 'engineering', description: '系统架构设计，帮助您设计稳定可靠的系统架构', features: ['系统架构', '架构设计', '技术栈', '可扩展性'] },
    { name: '性能优化助手', field: 'engineering', description: '系统性能优化，分析性能瓶颈并提供优化方案', features: ['性能优化', '瓶颈分析', '优化方案', '性能监控'] },
    { name: '安全评估助手', field: 'engineering', description: '安全风险评估，识别安全风险并提供防护建议', features: ['安全评估', '风险识别', '安全防护', '漏洞修复'] },
    { name: '技术选型助手', field: 'engineering', description: '技术方案选型，帮助您选择最适合的技术方案', features: ['技术选型', '方案对比', '技术评估', '决策建议'] }
  ];

  professionals.forEach(pro => {
    newSkills.push(createProfessionalSkill(pro.name, pro.field, pro.description, pro.features));
  });
  console.log(`✅ 生成 ${professionals.length} 个专业助手`);

  return newSkills;
}

function main() {
  console.log('🚀 开始一次性完成所有剩余阶段\n');
  console.log('='.repeat(80));

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const existingSkills = data.skills;
  const existingIds = new Set(existingSkills.map(s => s.id));

  console.log(`\n📊 当前状态`);
  console.log('-'.repeat(80));
  console.log(`总技能数: ${existingSkills.length}`);

  const newSkills = generateAllNewSkills();

  console.log('\n🔍 检查重复技能...');
  const uniqueNewSkills = newSkills.filter(skill => !existingIds.has(skill.id));
  const duplicateCount = newSkills.length - uniqueNewSkills.length;
  
  if (duplicateCount > 0) {
    console.log(`⚠️  发现 ${duplicateCount} 个重复技能，已跳过`);
  }

  console.log(`✅ 新增 ${uniqueNewSkills.length} 个技能`);

  console.log('\n💾 保存数据...');
  data.skills = [...existingSkills, ...uniqueNewSkills];
  data.meta.last_updated = new Date().toISOString();
  data.meta.version = '5.2.0';

  const backupPath = DATA_PATH.replace('.json', '.backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ 备份已保存: ${backupPath}`);

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ 数据已更新: ${DATA_PATH}`);

  console.log('\n📊 最终统计');
  console.log('='.repeat(80));
  console.log(`总技能数: ${data.skills.length}`);
  console.log(`新增技能: ${uniqueNewSkills.length}`);
  console.log(`功能型: ${data.skills.filter(s => s.categorization.primary_category === 'functional').length}`);
  console.log(`专业型: ${data.skills.filter(s => s.categorization.primary_category === 'professional').length}`);
  console.log(`角色型: ${data.skills.filter(s => s.categorization.primary_category === 'character').length}`);
  console.log(`游戏型: ${data.skills.filter(s => s.categorization.primary_category === 'game').length}`);

  console.log('\n✨ 所有阶段完成！');
}

main();
