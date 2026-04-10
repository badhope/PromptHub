const fs = require('fs');

const templates = JSON.parse(fs.readFileSync('remaining-templates.json', 'utf-8'));

const aiTools = {
  categories: [
    {
      id: 'programming',
      name: '编程开发',
      icon: '💻',
      description: '代码审查、架构设计、团队协作等开发工具'
    },
    {
      id: 'creation',
      name: '创意设计',
      icon: '🎨',
      description: 'UI/UX设计、音乐制作、短视频创作等'
    },
    {
      id: 'academic',
      name: '学术科研',
      icon: '📚',
      description: '论文写作、格式校对、文献管理等学术工具'
    },
    {
      id: 'life',
      name: '生活服务',
      icon: '🌟',
      description: '烹饪、英语学习、考试提分、个人成长等'
    },
    {
      id: 'professional',
      name: '职场办公',
      icon: '💼',
      description: 'PPT演示、DevOps运维、职业英语等专业工具'
    }
  ],
  tools: [
    {
      id: 'omega-protocol',
      name: 'OMEGA PROTOCOL 通用提示模板',
      icon: '🔷',
      category: 'life',
      description: '全AI模型通用的标准化提示模板，最大化AI自主性',
      guide: '复制完整协议发送给任何AI，即可激活最高自主性模式',
      scenarios: ['通用AI激活', '自主性研究', '学术写作', '编程开发', '多模型兼容'],
      rawUrl: '',
      activation: templates['omega-protocol']
    },
    {
      id: 'cooking-coach',
      name: '大厨',
      icon: '👨‍🍳',
      category: 'life',
      description: '专业菜谱研发、食材搭配、技法讲解，在家做出餐厅级美食',
      guide: '米其林级烹饪指导，小白也能变大厨',
      scenarios: ['家常菜谱', '宴客大菜', '烘焙甜点', '减脂餐', '剩菜改造'],
      rawUrl: '',
      activation: templates['cooking-coach']
    },
    {
      id: 'architecture-designer',
      name: '系统架构设计工具',
      icon: '🏗️',
      category: 'programming',
      description: '移动端友好的系统架构设计、组件关系设计和技术选型',
      guide: '复制激活指令发送给AI，即可开始架构设计咨询',
      scenarios: ['系统架构设计', '技术选型分析', '组件关系图', '微服务划分', '容量规划'],
      rawUrl: '',
      activation: templates['architecture-designer']
    },
    {
      id: 'ui-ux-designer',
      name: 'UI/UX设计工具',
      icon: '🎨',
      category: 'creation',
      description: '移动端友好的界面原型设计、交互模拟和视觉设计辅助',
      guide: '专为设计师优化的移动设计助手，随时随地产生创意',
      scenarios: ['界面原型设计', '交互流程设计', '设计系统构建', '用户体验优化', '视觉风格定义'],
      rawUrl: '',
      activation: templates['ui-ux-designer']
    },
    {
      id: 'code-reviewer',
      name: '代码质量检查工具',
      icon: '🔍',
      category: 'programming',
      description: '移动端代码审查工具，语法验证、潜在Bug检测和质量评估',
      guide: '手机上就能做代码审查，粘贴代码即可获得专业评审',
      scenarios: ['语法错误检测', '潜在Bug发现', '代码质量评分', '安全漏洞扫描', '最佳实践建议'],
      rawUrl: '',
      activation: templates['code-reviewer']
    },
    {
      id: 'dev-collaboration',
      name: '程序员协作工具',
      icon: '👥',
      category: 'programming',
      description: '专为移动端优化的程序员协作，代码分享和技术讨论助手',
      guide: '移动场景下的高效技术协作，随时随地进行代码沟通',
      scenarios: ['代码片段分享', '技术方案讨论', '远程调试协助', 'Code Review评论', '团队知识库'],
      rawUrl: '',
      activation: templates['dev-collaboration']
    },
    {
      id: 'format-checker',
      name: '论文格式校对工具',
      icon: '📐',
      category: 'academic',
      description: 'GB7714/APA/MLA/Chicago全格式标准支持的专业格式校对',
      guide: '粘贴论文章节，立刻获得专业格式检查和修正建议',
      scenarios: ['引用格式检查', '章节结构规范', '排版排版统一', '图表格式规范', '期刊模板适配'],
      rawUrl: '',
      activation: templates['format-checker']
    },
    {
      id: 'paper-quality',
      name: '论文质量检查工具',
      icon: '✨',
      category: 'academic',
      description: '10年+顶级期刊审稿人经验的论文质量专业评估',
      guide: '站在审稿人视角全面评估论文质量，预判审稿人关注点',
      scenarios: ['原创性分析', '逻辑连贯性检查', '学术规范审查', '方法学质量评估', '发表概率预测'],
      rawUrl: '',
      activation: templates['paper-quality']
    },
    {
      id: 'reference-manager',
      name: '文献管理工具',
      icon: '📚',
      category: 'academic',
      description: '智能文献检索、脉络梳理、引用格式生成一体化工具',
      guide: '输入研究主题，自动发现关键文献和研究前沿',
      scenarios: ['智能文献检索', '领域脉络梳理', '引用格式生成', '文献分类管理', '引文网络分析'],
      rawUrl: '',
      activation: templates['reference-manager']
    },
    {
      id: 'academic-proofreading',
      name: '学术校对工具',
      icon: '✏️',
      category: 'academic',
      description: '英语母语学术编辑，15年科技论文润色经验',
      guide: '专业术语统一、语法纠错、母语化润色，让论文更地道',
      scenarios: ['专业术语校对', '语法纠错', '表达优化', '母语化润色', '逻辑流畅化'],
      rawUrl: '',
      activation: templates['academic-proofreading']
    },
    {
      id: 'devops-engineer',
      name: 'DevOps运维专家',
      icon: '🚀',
      category: 'professional',
      description: '8年云原生经验的CI/CD流水线设计、容器化部署和架构优化专家',
      guide: '故障排查一步步来，架构设计给出落地方案',
      scenarios: ['CI/CD流水线设计', '容器化部署', '云架构优化', '可观测性方案', '故障根因分析'],
      rawUrl: '',
      activation: templates['devops-engineer']
    },
    {
      id: 'presentation-master',
      name: 'PPT演示大师',
      icon: '📊',
      category: 'professional',
      description: '10年500强企业PPT设计经验，让你的演示抓住听众注意力',
      guide: '结构化表达+专业排版，让1分钟内抓住听众注意力',
      scenarios: ['逻辑结构设计', '排版美化', '数据可视化', '动画设计', '演讲指导'],
      rawUrl: '',
      activation: templates['presentation-master']
    },
    {
      id: 'english-tutor',
      name: '英语家教',
      icon: '🇺🇸',
      category: 'professional',
      description: 'TEFL认证母语教师，移动端随时随地陪你练英语',
      guide: '口语陪练+语法讲解+写作润色，碎片化时间提升英语',
      scenarios: ['口语陪练', '语法讲解', '词汇拓展', '写作润色', '发音矫正'],
      rawUrl: '',
      activation: templates['english-tutor']
    },
    {
      id: 'exam-coach',
      name: '考试提分教练',
      icon: '📝',
      category: 'professional',
      description: '10年专注考试提分研究，用最短时间最高效通过考试',
      guide: '考点押题+答题技巧+时间管理，最大化投入产出比',
      scenarios: ['考点押题', '答题技巧', '时间管理', '错题复盘', '记忆方法'],
      rawUrl: '',
      activation: templates['exam-coach']
    }
  ]
};

try {
  const finalJson = JSON.stringify(aiTools, null, 2);
  JSON.parse(finalJson);
  fs.writeFileSync('web/public/ai-tools.json', finalJson, 'utf-8');
  
  console.log('══════════════════════════════════════════════════════');
  console.log('✅ AI工具库补充完成！');
  console.log('══════════════════════════════════════════════════════');
  console.log('\n📊 最终数据:');
  console.log('   分类数:', aiTools.categories.length);
  console.log('   工具总数:', aiTools.tools.length);
  
  console.log('\n📂 分类工具分布:');
  const cats = {};
  aiTools.tools.forEach(t => cats[t.category] = (cats[t.category] || 0) + 1);
  aiTools.categories.forEach(c => {
    const count = cats[c.id] || 0;
    console.log('  ', c.icon, c.name + ':', count, '个工具', count > 0 ? '✅' : '');
  });
  
  console.log('\n✅ 所有5大分类已完整覆盖！');
  console.log('   学术科研 +4, 职场办公 +4');
  
} catch(e) {
  console.log('❌ 失败:', e.message);
}
