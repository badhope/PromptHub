const fs = require('fs');
const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));

const tools = [
  {
    id: 'legal-consultant',
    name: '法律咨询助手',
    icon: '⚖️',
    category: 'life',
    description: '专业法律咨询，合同解读、权益维护、纠纷处理建议',
    guide: '遇到法律问题不用慌，AI律师帮您分析案情',
    scenarios: ['合同解读', '劳动纠纷', '消费者权益', '房产纠纷'],
    activation: "法律咨询服务，提供劳动纠纷、合同审查、消费者权益保护等专业法律建议"
  },
  {
    id: 'contract-reviewer',
    name: '合同审查专家',
    icon: '📑',
    category: 'life',
    description: '合同风险排查、条款解读、专业修改建议',
    guide: '把合同粘贴进来，揪出隐藏的霸王条款',
    scenarios: ['租房合同', '劳动合同', '买卖合同', '服务协议'],
    activation: "合同审查服务，帮助识别合同中的法律风险和霸王条款"
  },
  {
    id: 'medical-consultant',
    name: '全科问诊助手',
    icon: '🩺',
    category: 'life',
    description: '症状分析、就医指导、康复建议',
    guide: '描述身体不适症状，获得专业医学分析',
    scenarios: ['症状分析', '就医指南', '用药咨询', '健康管理'],
    activation: "医学问诊服务，提供症状分析和就医指导建议"
  },
  {
    id: 'medicine-safety',
    name: '用药安全专家',
    icon: '💊',
    category: 'life',
    description: '药物相互作用、副作用、用法用量指导',
    guide: '吃药前查一查，避免药物风险',
    scenarios: ['配伍禁忌', '用法用量', '副作用处理'],
    activation: "用药安全指导，检查药物相互作用和副作用"
  },
  {
    id: 'postgraduate-coach',
    name: '考研规划助手',
    icon: '📚',
    category: 'learning',
    description: '院校专业选择、复习规划、复试调剂指导',
    guide: '考研路上不迷茫，AI助你一战成硕',
    scenarios: ['院校选择', '复习规划', '复试面试', '调剂策略'],
    activation: "考研规划服务，提供院校选择和复习规划建议"
  },
  {
    id: 'study-abroad-consultant',
    name: '留学申请顾问',
    icon: '✈️',
    category: 'learning',
    description: '选校定位、文书润色、网申面试指导',
    guide: 'DIY留学不求人，资深顾问级指导',
    scenarios: ['选校定位', '文书创作', '网申指导'],
    activation: "留学申请服务，选校定位和文书创作指导"
  },
  {
    id: 'tax-planner',
    name: '个税筹划助手',
    icon: '💰',
    category: 'life',
    description: '个税专项附加扣除、年终奖优化',
    guide: '合法合规省税，每年多拿几千块',
    scenarios: ['年终奖优化', '专项附加扣除', '汇算清缴'],
    activation: "个税筹划服务，合法节税方案设计"
  },
  {
    id: 'insurance-advisor',
    name: '保险配置顾问',
    icon: '🛡️',
    category: 'life',
    description: '家庭保险配置方案、产品测评',
    guide: '买保险不踩坑，用最少的钱配最足的保障',
    scenarios: ['家庭方案', '产品测评', '理赔指导'],
    activation: "保险配置服务，家庭保险方案设计"
  },
  {
    id: 'career-coach',
    name: '职业规划导师',
    icon: '🎯',
    category: 'learning',
    description: '职业方向定位、简历优化、面试模拟',
    guide: '35岁危机、转行跳槽全流程指导',
    scenarios: ['简历优化', '面试模拟', '转行咨询'],
    activation: "职业规划服务，职业发展方向和简历优化指导"
  },
  {
    id: 'nutrition-advisor',
    name: '营养膳食顾问',
    icon: '🥗',
    category: 'life',
    description: '科学饮食搭配、慢性病膳食方案制定',
    guide: '三高、减脂、增肌专业饮食指导',
    scenarios: ['减脂餐搭配', '慢性病饮食', '月子餐'],
    activation: "营养膳食服务，科学饮食搭配指导"
  },
  {
    id: 'emotional-counselor',
    name: '心理咨询师',
    icon: '💭',
    category: 'life',
    description: '情绪疏导、压力管理、人际关系',
    guide: '你的专属情绪树洞',
    scenarios: ['情绪疏导', '焦虑缓解', '情感咨询'],
    activation: "心理咨询服务，情绪疏导和压力管理"
  },
  {
    id: 'parenting-coach',
    name: '家庭教育指导',
    icon: '👨‍👩‍👧',
    category: 'life',
    description: '亲子沟通、叛逆期、学习习惯培养',
    guide: '科学育儿不焦虑',
    scenarios: ['亲子沟通', '叛逆期引导', '学习习惯'],
    activation: "家庭教育指导，亲子沟通和育儿方法"
  }
];

console.log('📦 批量添加专业工具');
console.log('='.repeat(50));

let added = 0;
tools.forEach(tool => {
  const exists = data.tools.find(t => t.id === tool.id);
  if (exists) {
    console.log(`⚠️  ${tool.name} 已存在，跳过`);
  } else {
    data.tools.push(tool);
    added++;
    console.log(`✅ 添加: ${tool.icon} ${tool.name} [${tool.category}]`);
  }
});

data.generated_at = new Date().toISOString();
fs.writeFileSync('web/public/ai-tools.json', JSON.stringify(data, null, 2));

console.log('\n' + '='.repeat(50));
console.log(`✨ 完成！新增 ${added} 个工具，总量: ${data.tools.length} 个`);
console.log('='.repeat(50));
console.log('\n📊 分类统计:');

const cats = [...new Set(data.tools.map(t => t.category))];
cats.forEach(cat => {
  const catInfo = data.categories.find(c => c.id === cat);
  const count = data.tools.filter(t => t.category === cat).length;
  console.log(`   ${catInfo?.icon || '📦'} ${catInfo?.name || cat}: ${count} 个`);
});
