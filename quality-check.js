const fs = require('fs');
const path = require('path');

const aiToolsPath = path.join(__dirname, 'web', 'public', 'ai-tools.json');
const data = JSON.parse(fs.readFileSync(aiToolsPath, 'utf-8'));

const VALID_CATEGORIES = ['programming', 'learning', 'creation', 'life'];
const CATEGORY_NAMES = {
  programming: '编程开发',
  learning: '学习教育',
  creation: '内容创作',
  life: '生活服务'
};

console.log('=' .repeat(60));
console.log('🔍 开始全面质量检查');
console.log('=' .repeat(60));

let issues = [];

// ==========================================
// 1. 分类准确性检查
// ==========================================
console.log('\n📋 【1/4】分类准确性检查');
console.log('-'.repeat(40));

const EXPECTED_CATEGORY_TOOLS = {
  programming: ['代码', '编程', '开发', '架构', '运维', 'DevOps', '调试', '程序员'],
  learning: ['学习', '英语', '考试', '论文', '学术', '科研', '文献', '校对', '家教', '教练'],
  creation: ['创作', '写作', '设计', '视频', '音乐', '文案', '营销', 'UI/UX', '绘画', '短视频'],
  life: ['聊天', '健身', '烹饪', '膳食', '职场', 'PPT', '思维导图', '成长', '人际', '效率', '助手']
};

data.tools.forEach((tool, index) => {
  if (!VALID_CATEGORIES.includes(tool.category)) {
    issues.push({
      type: '分类错误',
      severity: '高',
      tool: tool.name,
      message: `无效的分类ID: ${tool.category}`,
      fix: `应归类到4大类之一`
    });
    console.log(`❌ [${index+1}] ${tool.name} → 无效分类: ${tool.category}`);
  } else {
    const keywords = EXPECTED_CATEGORY_TOOLS[tool.category];
    const matchFound = keywords.some(kw => 
      tool.name.includes(kw) || tool.description.includes(kw)
    );
    
    if (!matchFound) {
      console.log(`⚠️  [${index+1}] ${tool.name} → 分类: ${CATEGORY_NAMES[tool.category]} (建议人工复核)`);
    } else {
      console.log(`✅ [${index+1}] ${tool.name} → ${CATEGORY_NAMES[tool.category]}`);
    }
  }
});

// ==========================================
// 2. 内容完整性检查
// ==========================================
console.log('\n📝 【2/4】内容完整性检查');
console.log('-'.repeat(40));

const REQUIRED_FIELDS = ['id', 'name', 'icon', 'category', 'description', 'guide', 'scenarios', 'activation'];

data.tools.forEach((tool, index) => {
  let toolIssues = [];
  
  REQUIRED_FIELDS.forEach(field => {
    if (!tool[field]) {
      toolIssues.push(`缺失字段: ${field}`);
    } else if (typeof tool[field] === 'string' && tool[field].length < 5) {
      toolIssues.push(`字段过短: ${field} ("${tool[field]}")`);
    }
  });
  
  if (!Array.isArray(tool.scenarios) || tool.scenarios.length < 3) {
    toolIssues.push(`scenarios 应该至少3个适用场景`);
  }
  
  if (tool.activation && tool.activation.length < 500) {
    toolIssues.push(`激活指令内容过短 (${tool.activation.length} 字符)`);
  }
  
  if (toolIssues.length > 0) {
    toolIssues.forEach(msg => {
      issues.push({
        type: '内容不完整',
        severity: '中',
        tool: tool.name,
        message: msg
      });
    });
    console.log(`❌ [${index+1}] ${tool.name}: ${toolIssues.join(', ')}`);
  } else {
    console.log(`✅ [${index+1}] ${tool.name} (激活指令: ${tool.activation.length} 字符)`);
  }
});

// ==========================================
// 3. 数据质量检查 (乱码、格式错误)
// ==========================================
console.log('\n🔧 【3/4】数据质量检查');
console.log('-'.repeat(40));

const GARBAGE_PATTERNS = [
  /v\d/i,                    // 版本号
  /functional/i,             // 模板词汇
  /unique features/i,        // 模板词汇
  /����/,                    // Unicode乱码
  /\x00-\x1F\x7F/,           // 控制字符
];

data.tools.forEach((tool, index) => {
  let qualityIssues = [];
  
  const textToCheck = JSON.stringify(tool);
  
  GARBAGE_PATTERNS.forEach(pattern => {
    if (pattern.test(textToCheck)) {
      qualityIssues.push(`发现匹配模式: ${pattern}`);
    }
  });
  
  if (tool.id.includes('-v') || tool.name.includes('v5') || tool.name.includes('V5')) {
    qualityIssues.push('残留版本号(v5)');
  }
  
  if (tool.activation && tool.activation.split('\n').filter(l => l.trim()).length < 10) {
    qualityIssues.push('激活指令格式可能不正确');
  }
  
  if (qualityIssues.length > 0) {
    qualityIssues.forEach(msg => {
      issues.push({
        type: '数据质量',
        severity: '中',
        tool: tool.name,
        message: msg
      });
    });
    console.log(`❌ [${index+1}] ${tool.name}: ${qualityIssues.join(', ')}`);
  } else {
    console.log(`✅ [${index+1}] ${tool.name}`);
  }
});

// ==========================================
// 4. Markdown格式检查
// ==========================================
console.log('\n✨ 【4/4】Markdown格式检查');
console.log('-'.repeat(40));

data.tools.forEach((tool, index) => {
  if (!tool.activation) return;
  
  let mdIssues = [];
  
  const h1Count = (tool.activation.match(/^# /gm) || []).length;
  const h2Count = (tool.activation.match(/^## /gm) || []).length;
  
  if (h1Count === 0) mdIssues.push('缺少一级标题 (#)');
  if (h1Count > 1) mdIssues.push(`存在 ${h1Count} 个一级标题 (建议1个)`);
  if (h2Count < 3) mdIssues.push(`二级标题过少 (${h2Count} 个，建议≥3)`);
  
  const codeBlocks = (tool.activation.match(/```/g) || []).length;
  if (codeBlocks % 2 !== 0) mdIssues.push('代码块标记不配对 (``` 数量奇数)');
  
  const tables = (tool.activation.match(/^\|.*\|$/gm) || []).length;
  if (tables === 0) mdIssues.push('建议添加表格增强可读性');
  
  if (mdIssues.length > 0) {
    console.log(`⚠️  [${index+1}] ${tool.name}: ${mdIssues.join(', ')}`);
  } else {
    console.log(`✅ [${index+1}] ${tool.name} (H1:${h1Count} H2:${h2Count} 表格:${tables} 代码块:${codeBlocks/2})`);
  }
});

// ==========================================
// 汇总报告
// ==========================================
console.log('\n' + '=' .repeat(60));
console.log('📊 检查结果汇总');
console.log('=' .repeat(60));

console.log(`\n📦 工具总数: ${data.tools.length} 个`);
console.log(`📂 分类数: ${data.categories.length} 个`);

if (issues.length === 0) {
  console.log('\n🎉 恭喜！未发现任何严重问题！');
} else {
  console.log(`\n⚠️  共发现 ${issues.length} 个问题:\n`);
  
  const byType = {};
  issues.forEach(i => {
    byType[i.type] = (byType[i.type] || 0) + 1;
  });
  
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} 个`);
  });
  
  console.log('\n📋 详细问题列表:');
  issues.forEach((issue, i) => {
    console.log(`\n   ${i+1}. [${issue.severity}] ${issue.tool}`);
    console.log(`      类型: ${issue.type}`);
    console.log(`      说明: ${issue.message}`);
    if (issue.fix) console.log(`      建议: ${issue.fix}`);
  });
}

console.log('\n' + '=' .repeat(60));
