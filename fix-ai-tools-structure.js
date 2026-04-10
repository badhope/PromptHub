const fs = require('fs');

const templates = JSON.parse(fs.readFileSync('remaining-templates.json', 'utf-8'));

const omegaTemplate = templates['omega-protocol'];

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
      description: 'PPT演示、DevOps运维等专业工具'
    }
  ],
  tools: [
    {
      id: 'omega-protocol',
      name: 'OMEGA PROTOCOL 通用提示模板',
      icon: '🔷',
      category: 'life',
      description: '全AI模型通用的标准化提示模板，最大化AI自主性，包含疤痕和蛋壳纹理设计',
      guide: '复制完整协议发送给任何AI，即可激活最高自主性模式',
      scenarios: [
        '通用AI激活',
        '自主性研究',
        '学术写作',
        '编程开发',
        '多模型兼容'
      ],
      rawUrl: 'https://raw.githubusercontent.com/...',
      activation: omegaTemplate
    },
    {
      id: 'cooking-coach',
      name: '大厨',
      icon: '👨‍🍳',
      category: 'life',
      description: '专业菜谱研发、食材搭配、技法讲解、在家做出餐厅级美食',
      guide: '米其林级烹饪指导，小白也能变大厨',
      scenarios: [
        '家常菜谱',
        '宴客大菜',
        '烘焙甜点',
        '减脂餐',
        '剩菜改造'
      ],
      rawUrl: 'https://raw.githubusercontent.com/...',
      activation: templates['cooking-coach']
    },
    {
      id: 'architecture-designer',
      name: '系统架构设计工具',
      icon: '🏗️',
      category: 'programming',
      description: '移动端友好的系统架构设计工具，支持架构图绘制、组件关系设计和技术选型',
      guide: '复制激活指令发送给AI，即可开始架构设计咨询',
      scenarios: [
        '系统架构设计',
        '技术选型分析',
        '组件关系图',
        '微服务划分',
        '容量规划'
      ],
      rawUrl: '',
      activation: templates['architecture-designer']
    },
    {
      id: 'ui-ux-designer',
      name: 'UI/UX设计工具',
      icon: '🎨',
      category: 'creation',
      description: '移动端友好的界面原型设计、交互模拟和视觉设计辅助工具',
      guide: '专为设计师优化的移动设计助手，随时随地产生创意',
      scenarios: [
        '界面原型设计',
        '交互流程设计',
        '设计系统构建',
        '用户体验优化',
        '视觉风格定义'
      ],
      rawUrl: '',
      activation: templates['ui-ux-designer']
    },
    {
      id: 'code-reviewer',
      name: '代码质量检查工具',
      icon: '🔍',
      category: 'programming',
      description: '移动端代码审查工具，支持语法验证、潜在Bug检测和质量评估',
      guide: '手机上就能做代码审查，粘贴代码即可获得专业评审',
      scenarios: [
        '语法错误检测',
        '潜在Bug发现',
        '代码质量评分',
        '安全漏洞扫描',
        '最佳实践建议'
      ],
      rawUrl: '',
      activation: templates['code-reviewer']
    },
    {
      id: 'dev-collaboration',
      name: '程序员协作工具',
      icon: '👥',
      category: 'programming',
      description: '专为移动端优化的程序员协作工具，代码分享和技术讨论助手',
      guide: '移动场景下的高效技术协作，随时随地进行代码沟通',
      scenarios: [
        '代码片段分享',
        '技术方案讨论',
        '远程调试协助',
        'Code Review评论',
        '团队知识库'
      ],
      rawUrl: '',
      activation: templates['dev-collaboration']
    }
  ]
};

try {
  const finalJson = JSON.stringify(aiTools, null, 2);
  JSON.parse(finalJson);
  fs.writeFileSync('web/public/ai-tools.json', finalJson, 'utf-8');
  console.log('✅ ai-tools.json 结构修复成功！');
  console.log('   分类数:', aiTools.categories.length);
  console.log('   工具数:', aiTools.tools.length);
  
  aiTools.categories.forEach(c => console.log('   -', c.name));
  
  const omega = aiTools.tools.find(t => t.id === 'omega-protocol');
  console.log('\n✅ OMEGA PROTOCOL 验证:');
  console.log('   激活命令长度:', omega.activation.length);
  console.log('   包含第二人称视角:', omega.activation.includes('你的角色定位'));
  
} catch(e) {
  console.log('❌ 失败:', e.message);
}
