const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(80));
console.log('🔍 系统健康状态全面检查报告');
console.log('='.repeat(80));

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  checks: [],
  recommendations: []
};

function addCheck(category, name, status, message, details = null) {
  report.checks.push({ category, name, status, message, details });
  report.summary.total++;
  if (status === 'PASS') report.summary.passed++;
  else if (status === 'FAIL') report.summary.failed++;
  else if (status === 'WARN') report.summary.warnings++;
}

console.log('\n📁 【第一部分：数据文件状态检查】');
console.log('-'.repeat(80));

const dataFiles = [
  'web/public/ai-tools.json',
  'web/public/skills-data.json',
  'web/public/skills-summary.json',
  'activation-templates.json',
  'prompts-optimized.json',
  'remaining-templates.json'
];

dataFiles.forEach(file => {
  const exists = fs.existsSync(file);
  if (exists) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const data = JSON.parse(content);
      const size = (fs.statSync(file).size / 1024).toFixed(2);
      const count = data.tools ? data.tools.length : data.skills ? data.skills.length : Object.keys(data).length;
      
      addCheck('数据文件', file, 'PASS', `文件正常，大小: ${size}KB，条目数: ${count}`);
      console.log(`✅ ${file} - ${size}KB - ${count} 条目`);
    } catch (e) {
      addCheck('数据文件', file, 'FAIL', `JSON解析错误: ${e.message}`);
      console.log(`❌ ${file} - JSON解析失败: ${e.message}`);
    }
  } else {
    addCheck('数据文件', file, 'WARN', '文件不存在');
    console.log(`⚠️  ${file} - 文件不存在`);
  }
});

console.log('\n🤖 【第二部分：AI工具激活指令完整性检查】');
console.log('-'.repeat(80));

const aiTools = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));
let activationIssues = [];
const firstPersonPatterns = ['我是', '我拥有', '我精通', '我擅长', '我的', '我提供', '我扮演', '我支持', '我推荐', '我帮助', '我会'];

aiTools.tools.forEach((tool, idx) => {
  if (!tool.activation) {
    activationIssues.push(`${tool.icon} ${tool.name}: 缺少激活指令`);
  } else {
    const issues = firstPersonPatterns.filter(p => tool.activation.includes(p));
    if (issues.length > 0) {
      activationIssues.push(`${tool.icon} ${tool.name}: 第一人称残留 - ${issues.join(', ')}`);
    }
    if (!tool.activation.includes('你') && !tool.activation.includes('你的')) {
      activationIssues.push(`${tool.icon} ${tool.name}: 缺少第二人称视角`);
    }
    if (!tool.activation.includes('#')) {
      activationIssues.push(`${tool.icon} ${tool.icon} ${tool.name}: 缺少Markdown标题格式`);
    }
  }
});

if (activationIssues.length === 0) {
  addCheck('激活指令', '41个AI工具指令', 'PASS', '所有激活指令格式规范完整');
  console.log(`✅ 全部 ${aiTools.tools.length} 个AI工具激活指令格式规范完整`);
  console.log(`✅ 无第一人称视角残留`);
  console.log(`✅ 统一使用第二人称"你"视角`);
  console.log(`✅ 标准Markdown格式`);
} else {
  activationIssues.forEach(issue => {
    console.log(`❌ ${issue}`);
    addCheck('激活指令', 'AI工具指令', 'FAIL', issue);
  });
  report.recommendations.push('运行 node apply-activation-templates.js 重新应用激活模板');
}

console.log('\n📦 【第三部分：项目依赖检查】');
console.log('-'.repeat(80));

try {
  const packageJson = JSON.parse(fs.readFileSync('web/package.json', 'utf-8'));
  console.log(`✅ Next.js 版本: ${packageJson.dependencies['next']}`);
  console.log(`✅ React 版本: ${packageJson.dependencies['react']}`);
  console.log(`✅ Tailwind CSS 版本: ${packageJson.dependencies['tailwindcss']}`);
  
  const libraries = [
    'framer-motion',
    'lucide-react',
    'react-markdown',
    'react-syntax-highlighter',
    'clsx',
    'tailwind-merge'
  ];
  
  libraries.forEach(lib => {
    if (packageJson.dependencies[lib]) {
      console.log(`✅ ${lib}: ${packageJson.dependencies[lib]}`);
      addCheck('依赖项', lib, 'PASS', `版本 ${packageJson.dependencies[lib]}`);
    } else {
      console.log(`⚠️  ${lib}: 未安装`);
      addCheck('依赖项', lib, 'WARN', '建议安装');
      report.recommendations.push(`npm install ${lib}`);
    }
  });
} catch (e) {
  console.log(`❌ package.json 读取失败: ${e.message}`);
  addCheck('依赖项', 'package.json', 'FAIL', e.message);
}

console.log('\n🎨 【第四部分：前端组件完整性检查】');
console.log('-'.repeat(80));

const components = [
  'web/src/components/AIToolCard.tsx',
  'web/src/components/ToastProvider.tsx',
  'web/src/components/SkillCard.tsx'
];

const pages = [
  'web/src/app/ai-tools/page.tsx',
  'web/src/app/tools/[id]/page.tsx',
  'web/src/app/page.tsx'
];

[...components, ...pages].forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;
    console.log(`✅ ${path.basename(file)} - ${lines} 行`);
    addCheck('组件文件', path.basename(file), 'PASS', `${lines} 行代码`);
  } else {
    console.log(`❌ ${path.basename(file)} - 文件缺失`);
    addCheck('组件文件', path.basename(file), 'FAIL', '文件缺失');
    report.recommendations.push(`需要重建: ${file}`);
  }
});

console.log('\n🔧 【第五部分：脚本工具完整性检查】');
console.log('-'.repeat(80));

const scripts = [
  'apply-activation-templates.js',
  'verify-activation-commands.js',
  'quality-check.js',
  'fix-quality-issues.js',
  'category-expansion.js'
];

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script}`);
    addCheck('脚本工具', script, 'PASS', '存在');
  } else {
    console.log(`⚠️  ${script} - 文件不存在`);
    addCheck('脚本工具', script, 'WARN', '文件不存在');
  }
});

console.log('\n🚀 【第六部分：构建和开发环境检查】');
console.log('-'.repeat(80));

if (fs.existsSync('web/.next')) {
  console.log('✅ .next 构建目录存在');
  addCheck('构建环境', '.next', 'PASS', '构建目录存在');
} else {
  console.log('⚠️  .next 构建目录不存在 - 需要运行 npm run build');
  addCheck('构建环境', '.next', 'WARN', '需要构建');
  report.recommendations.push('运行 npm run build 创建生产构建');
}

if (fs.existsSync('web/node_modules')) {
  console.log('✅ node_modules 存在');
  addCheck('构建环境', 'node_modules', 'PASS', '依赖已安装');
} else {
  console.log('❌ node_modules 不存在 - 请运行 npm install');
  addCheck('构建环境', 'node_modules', 'FAIL', '依赖未安装');
  report.recommendations.push('运行 npm install 安装依赖');
}

console.log('\n📊 【第七部分：功能特性验证】');
console.log('-'.repeat(80));

const features = [
  { name: '搜索功能', file: 'web/src/app/ai-tools/page.tsx', pattern: 'search' },
  { name: '收藏功能', file: 'web/src/app/ai-tools/page.tsx', pattern: 'favorite' },
  { name: 'Toast通知', file: 'web/src/components/ToastProvider.tsx', pattern: 'Toast' },
  { name: '复制功能', file: 'web/src/components/AIToolCard.tsx', pattern: 'copy' },
  { name: '移动端适配', file: 'web/src/app/tools/[id]/page.tsx', pattern: 'md:' },
  { name: '分类筛选', file: 'web/src/app/ai-tools/page.tsx', pattern: 'category' },
  { name: '数据统计', file: 'web/src/app/ai-tools/page.tsx', pattern: 'statistics' }
];

features.forEach(feature => {
  if (fs.existsSync(feature.file)) {
    const content = fs.readFileSync(feature.file, 'utf-8');
    if (content.toLowerCase().includes(feature.pattern.toLowerCase())) {
      console.log(`✅ ${feature.name}`);
      addCheck('功能特性', feature.name, 'PASS', '已实现');
    } else {
      console.log(`⚠️  ${feature.name} - 可能未完全实现`);
      addCheck('功能特性', feature.name, 'WARN', '可能未完全实现');
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log('📋 检查报告摘要');
console.log('='.repeat(80));

console.log(`\n📊 总计检查项: ${report.summary.total}`);
console.log(`   ✅ 通过: ${report.summary.passed}`);
console.log(`   ⚠️  警告: ${report.summary.warnings}`);
console.log(`   ❌ 失败: ${report.summary.failed}`);

console.log('\n' + '-'.repeat(80));
console.log('分类统计:');
console.log('-'.repeat(80));

const categories = {};
report.checks.forEach(check => {
  if (!categories[check.category]) categories[check.category] = { pass: 0, fail: 0, warn: 0 };
  if (check.status === 'PASS') categories[check.category].pass++;
  else if (check.status === 'FAIL') categories[check.category].fail++;
  else if (check.status === 'WARN') categories[check.category].warn++;
});

Object.entries(categories).forEach(([category, stats]) => {
  console.log(`${category}: ✅${stats.pass}  ⚠️${stats.warn}  ❌${stats.fail}`);
});

if (report.recommendations.length > 0) {
  console.log('\n💡 建议行动项:');
  console.log('-'.repeat(80));
  report.recommendations.forEach((rec, idx) => {
    console.log(`${idx + 1}. ${rec}`);
  });
}

const failedChecks = report.checks.filter(c => c.status === 'FAIL');
if (failedChecks.length > 0) {
  console.log('\n❌ 失败项详情:');
  console.log('-'.repeat(80));
  failedChecks.forEach(check => {
    console.log(`[${check.category}] ${check.name}: ${check.message}`);
  });
}

console.log('\n✨ 系统状态结论:');
console.log('-'.repeat(80));
if (report.summary.failed === 0 && report.summary.warnings === 0) {
  console.log('🎉 系统状态优秀！所有检查项全部通过！');
} else if (report.summary.failed === 0) {
  console.log('✅ 系统状态良好！仅有少数警告项。');
} else if (report.summary.failed <= 3) {
  console.log('⚠️  系统状态基本正常，建议修复少数失败项。');
} else {
  console.log('❌ 系统需要维护，请修复上述失败项。');
}

console.log('\n' + '='.repeat(80));
console.log(`检查完成时间: ${report.timestamp}`);
console.log('='.repeat(80));

fs.writeFileSync('system-health-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 详细报告已保存到: system-health-report.json');
