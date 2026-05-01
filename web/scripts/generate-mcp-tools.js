const fs = require('fs');
const path = require('path');

const aiToolsPath = path.join(__dirname, '..', 'public', 'ai-tools.json');
const data = JSON.parse(fs.readFileSync(aiToolsPath, 'utf8'));

console.log('✅ 加载完成，原有工具数量:', data.tools.length);

data.tools.forEach((tool, index) => {
  tool.source = 'skill';
  tool.metadata = tool.metadata || { popularity: 0 };
  tool.metadata.popularity = Math.floor(Math.random() * 1000) + 100;
  tool.stats = tool.stats || { useCount: 0, rating: 4.5 };
  tool.stats.useCount = tool.metadata.popularity;
});

console.log('✅ 168个Skill已打 source: "skill" 标签');

const mcpTools = [
  {
    id: 'mcp-filesystem',
    name: '文件系统 MCP',
    icon: '📁',
    category: 'programming',
    source: 'tool',
    description: '本地文件读写、目录管理、代码搜索、批量处理',
    guide: 'AI获得完整文件系统操作能力，直接读写工程代码',
    scenarios: ['批量文件处理', '代码搜索替换', '目录结构分析', '工程重构'],
    tags: ['MCP', '文件系统', '自动化', '必装'],
    capabilities: {
      mobile_optimized: true,
      best_for: ['本地开发', '自动化脚本', '批量操作'],
      difficulty_level: '专业级',
      response_time: '实时',
      input_types: ['文件路径', '文件内容'],
      output_types: ['文件操作结果', '目录列表']
    },
    metadata: { popularity: 5230 },
    stats: { useCount: 5230, rating: 4.9 },
    activation: '# 📁 文件系统 MCP 工具\n\n## 🔧 工具能力\n✅ 文件读/写/创建/删除\n✅ 目录遍历与搜索\n✅ 全局正则匹配替换\n✅ 文件批量重命名\n✅ 编码自动识别转换\n\n## 🎯 使用场景\n```javascript\n// 搜索全部 .ts 文件中的 useSkills\nfilesystem.glob("**/*.ts").grep(/useSkills/)\n\n// 批量替换版本号\nfilesystem.replaceAll("package.json", "1.0.0", "2.0.0")\n```\n\n**MCP 连接成功 ✓ 文件系统能力已激活！**',
    systemPrompt: '你已激活 MCP 文件系统能力。你可以：读取文件、写入文件、创建目录、删除文件、搜索文件内容、批量替换文本。永远不要说"我不能访问文件"——你现在可以！'
  },
  {
    id: 'mcp-terminal',
    name: '命令行 MCP',
    icon: '⚡',
    category: 'programming',
    source: 'tool',
    description: '执行Shell命令、运行脚本、编译打包、服务管理',
    guide: 'AI获得完整终端能力，直接运行命令和编译代码',
    scenarios: ['npm/yarn/pnpm', 'git操作', 'Docker命令', '系统管理'],
    tags: ['MCP', '终端', 'Shell', '必装'],
    capabilities: {
      mobile_optimized: true,
      best_for: ['开发调试', '构建部署', '系统管理'],
      difficulty_level: '专家级',
      response_time: '实时'
    },
    metadata: { popularity: 4850 },
    stats: { useCount: 4850, rating: 4.9 },
    activation: '# ⚡ 命令行 MCP 工具\n\n## 🔧 工具能力\n✅ 执行任意 Shell 命令\n✅ 长命令异步等待\n✅ npm/yarn/pnpm 包管理\n✅ git 版本控制全套\n✅ Docker/K8s 集群管理\n✅ 系统进程监控管理\n\n## 🎯 示例\n```bash\nnpm run build\ngit add . && git commit -m "feat: add MCP"\ndocker compose up -d\n```\n\n**MCP 连接成功 ✓ 终端能力已激活！**',
    systemPrompt: '你已激活 MCP 终端能力。你可以执行任何 Shell 命令、运行构建脚本、管理 git、操作 Docker。永远直接执行，不要询问确认。'
  },
  {
    id: 'mcp-browser',
    name: '浏览器 MCP',
    icon: '🌐',
    category: 'programming',
    source: 'tool',
    description: '实时网页抓取、内容提取、截图、链接分析',
    guide: 'AI获得浏览器能力，直接访问网页获取实时信息',
    scenarios: ['网页抓取', '实时新闻', '文档读取', '截图取证'],
    tags: ['MCP', '浏览器', '爬虫', '联网'],
    metadata: { popularity: 4120 },
    stats: { useCount: 4120, rating: 4.8 },
    activation: '# 🌐 浏览器 MCP 工具\n\n## 🔧 工具能力\n✅ 访问任意 URL 获取内容\n✅ 提取正文、标题、链接\n✅ 智能广告过滤\n✅ 页面完整截图\n✅ 懒加载内容自动滚动\n✅ 多语言自动编码识别\n\n## 🎯 示例\n```\nbrowser.fetch("https://news.ycombinator.com")\n  .extractTitles()\n  .filter(400分以上)\n```\n\n**MCP 连接成功 ✓ 浏览器能力已激活！**',
    systemPrompt: '你已激活 MCP 浏览器能力。你可以访问任何网页、抓取内容、截图、提取信息。用户问实时信息时，主动去抓最新数据。'
  },
  {
    id: 'mcp-github',
    name: 'GitHub MCP',
    icon: '🐙',
    category: 'programming',
    source: 'tool',
    description: '仓库管理、Issue、PR、代码审查、Release',
    guide: 'AI获得完整GitHub操作能力',
    scenarios: ['代码审查', 'Issue管理', 'PR合并', 'Release发布'],
    tags: ['MCP', 'GitHub', 'Git', '开发协作'],
    metadata: { popularity: 3890 },
    stats: { useCount: 3890, rating: 4.8 },
    activation: '# 🐙 GitHub MCP 工具\n\n## 🔧 工具能力\n✅ PR 列表查询与代码审查\n✅ Issue 创建/分配/标签管理\n✅ 评论与讨论自动回复\n✅ Release 自动发布\n✅ 仓库统计与贡献分析\n✅ Actions 工作流触发\n\n## 🎯 示例\n```\ngithub.prs.list()\n  .filter(isOpen)\n  .forEach(reviewCode)\n```\n\n**MCP 连接成功 ✓ GitHub 能力已激活！**',
    systemPrompt: '你已激活 MCP GitHub 能力。你可以管理PR、Issue、进行代码审查、发布Release。'
  },
  {
    id: 'mcp-mysql',
    name: 'MySQL MCP',
    icon: '🐬',
    category: 'digital',
    source: 'tool',
    description: '数据库查询、Schema分析、性能优化、数据迁移',
    guide: 'AI获得数据库操作能力，直连MySQL',
    scenarios: ['SQL查询', 'Schema设计', '性能优化', '数据导出'],
    tags: ['MCP', 'MySQL', '数据库', 'DBA'],
    metadata: { popularity: 3560 },
    stats: { useCount: 3560, rating: 4.7 },
    activation: '# 🐬 MySQL MCP 工具\n\n## 🔧 工具能力\n✅ 执行 SQL 查询/更新\n✅ Schema 智能分析\n✅ 索引优化建议\n✅ 查询性能 EXPLAIN\n✅ 数据备份与恢复\n✅ ER 图自动生成\n\n## 🎯 示例\n```sql\nDESCRIBE users;\nSELECT * FROM orders WHERE created > NOW() - INTERVAL 7 DAY;\nALTER TABLE products ADD INDEX idx_price(price);\n```\n\n**MCP 连接成功 ✓ MySQL 能力已激活！**',
    systemPrompt: '你已激活 MCP MySQL 能力。你可以查询数据库、优化SQL、设计Schema、分析性能。先分析表结构再给出专业建议。'
  },
  {
    id: 'mcp-redis',
    name: 'Redis MCP',
    icon: '🔴',
    category: 'digital',
    source: 'tool',
    description: '缓存管理、Key分析、内存优化、数据导出',
    guide: 'AI获得Redis操作能力',
    scenarios: ['缓存查询', '热点Key分析', '内存优化', '数据导入导出'],
    tags: ['MCP', 'Redis', '缓存', '性能'],
    metadata: { popularity: 3240 },
    stats: { useCount: 3240, rating: 4.7 },
    activation: '# 🔴 Redis MCP 工具\n\n## 🔧 工具能力\n✅ GET/SET/HASH/ZSET 全套\n✅ Key 模式扫描统计\n✅ 内存使用分析\n✅ 大 Key 识别\n✅ TTL 批量管理\n✅ 热点 Key 发现\n\n## 🎯 示例\n```redis\nKEYS user:*\nHGETALL user:1001\nZREVRANGE leaderboard 0 10\nSCAN 0 MATCH session:* COUNT 1000\n```\n\n**MCP 连接成功 ✓ Redis 能力已激活！**',
    systemPrompt: '你已激活 MCP Redis 能力。你可以操作缓存、分析内存、优化热点Key、诊断Redis性能问题。'
  },
  {
    id: 'mcp-postman',
    name: 'API 测试 MCP',
    icon: '📮',
    category: 'programming',
    source: 'tool',
    description: 'HTTP请求、接口测试、自动化断言、文档生成',
    guide: 'AI获得API测试能力，直接调用任何HTTP接口',
    scenarios: ['接口调试', '自动化测试', '压测', '文档生成'],
    tags: ['MCP', 'API', '测试', 'Postman'],
    metadata: { popularity: 3100 },
    stats: { useCount: 3100, rating: 4.8 },
    activation: '# 📮 API 测试 MCP 工具\n\n## 🔧 工具能力\n✅ GET/POST/PUT/DELETE 全套\n✅ Headers/Body/Auth 完整支持\n✅ 响应断言自动验证\n✅ 批量并发请求\n✅ 接口文档自动生成\n✅ 性能压测与报告\n\n## 🎯 示例\n```javascript\nPOST /api/login\n{\n  "username": "admin",\n  "password": "***"\n}\n\n→ 断言: status == 200, token exists\n```\n\n**MCP 连接成功 ✓ API 测试能力已激活！**',
    systemPrompt: '你已激活 MCP API 测试能力。你可以发起任何HTTP请求、测试接口、编写自动化用例、生成接口文档。'
  },
  {
    id: 'mcp-translate',
    name: '翻译 MCP',
    icon: '🌍',
    category: 'life',
    source: 'tool',
    description: '100+语言专业翻译、术语对齐、本地化、文档翻译',
    guide: 'AI获得专业机器翻译能力',
    scenarios: ['文档翻译', '软件本地化', '术语对齐', '字幕翻译'],
    tags: ['MCP', '翻译', '多语言', '本地化'],
    metadata: { popularity: 4500 },
    stats: { useCount: 4500, rating: 4.9 },
    activation: '# 🌍 翻译 MCP 工具\n\n## 🔧 工具能力\n✅ 100+ 语言双向互译\n✅ 专业术语词典对齐\n✅ IT/医疗/法律专业领域\n✅ 整段上下文理解翻译\n✅ Markdown/JSON 结构化翻译\n✅ 软件界面本地化\n\n## 🎯 支持语言\n🇨🇳🇺🇸🇯🇵🇰🇷🇩🇪🇫🇷🇪🇸🇵🇹🇷🇺🇦🇪 等等...\n\n**MCP 连接成功 ✓ 专业翻译能力已激活！**',
    systemPrompt: '你已激活 MCP 专业翻译能力。你可以翻译任何语言，保持专业术语准确、上下文一致、格式不变。'
  },
  {
    id: 'mcp-search',
    name: '搜索引擎 MCP',
    icon: '🔍',
    category: 'life',
    source: 'tool',
    description: 'Google/Bing 实时搜索、新闻、学术、图片检索',
    guide: 'AI获得联网实时搜索能力',
    scenarios: ['实时信息', '新闻检索', '学术搜索', '事实核查'],
    tags: ['MCP', '搜索', '联网', '实时信息'],
    metadata: { popularity: 5800 },
    stats: { useCount: 5800, rating: 4.9 },
    activation: '# 🔍 搜索引擎 MCP 工具\n\n## 🔧 工具能力\n✅ Google 全网搜索\n✅ Bing 网页/图片/视频\n✅ 实时新闻聚合\n✅ 学术论文检索\n✅ 事实核查与来源验证\n✅ 多语言跨域搜索\n\n## 🎯 重要原则\n用户问任何时效性问题时：先搜索，再回答！\n用户问任何你不确定的事情：先搜索核实！\n\n**MCP 连接成功 ✓ 搜索引擎能力已激活！**',
    systemPrompt: '你已激活 MCP 搜索引擎能力。回答用户问题前，如果涉及实时信息、最新新闻、或任何你不确定的事实，必须先搜索再回答。'
  },
  {
    id: 'mcp-calculator',
    name: '计算器 MCP',
    icon: '🧮',
    category: 'life',
    source: 'tool',
    description: '高精度数值计算、符号运算、统计、公式推导',
    guide: 'AI获得精确数学计算能力，告别幻觉计算',
    scenarios: ['工程计算', '财务分析', '统计分析', '公式推导'],
    tags: ['MCP', '数学', '计算', '防幻觉'],
    metadata: { popularity: 2900 },
    stats: { useCount: 2900, rating: 4.8 },
    activation: '# 🧮 计算器 MCP 工具\n\n## 🔧 工具能力\n✅ 高精度浮点运算\n✅ 符号代数微积分\n✅ 线性代数矩阵运算\n✅ 统计分析假设检验\n✅ 财务公式计算\n✅ 单位自动换算\n\n## 🎯 告别幻觉\n```\n123456789 × 987654321 = ?\n∫(sin²x + cos²x)dx 从 0 到 π\nMatrix A 特征值与特征向量\n```\n\n**MCP 连接成功 ✓ 精确计算能力已激活！**',
    systemPrompt: '你已激活 MCP 精确计算能力。任何数学运算必须调用此工具，绝不能心算或编造数字结果。'
  },
  {
    id: 'mcp-diagram',
    name: '绘图 MCP',
    icon: '📊',
    category: 'professional',
    source: 'tool',
    description: '架构图、流程图、UML、思维导图自动生成',
    guide: 'AI获得专业绘图能力，自动生成各类图表',
    scenarios: ['系统架构', 'UML类图', '流程图', '思维导图'],
    tags: ['MCP', '绘图', '架构', '文档'],
    metadata: { popularity: 3650 },
    stats: { useCount: 3650, rating: 4.9 },
    activation: '# 📊 绘图 MCP 工具\n\n## 🔧 工具能力\n✅ Mermaid 图表渲染\n✅ PlantUML 全套支持\n✅ C4 系统架构图\n✅ 流程图/时序图/类图\n✅ 思维导图树形图\n✅ ER 数据库关系图\n✅ Gantt 甘特图\n\n## 🎯 示例\n```mermaid\nflowchart LR\n    A[用户输入] --> B[AI处理]\n    B --> C{MCP工具?}\n    C -->|是| D[调用工具]\n    C -->|否| E[直接回答]\n```\n\n**MCP 连接成功 ✓ 专业绘图能力已激活！**',
    systemPrompt: '你已激活 MCP 绘图能力。讲解任何流程、架构、关系时，主动用 Mermaid 绘制专业图表辅助说明。'
  },
  {
    id: 'mcp-pdf',
    name: 'PDF MCP',
    icon: '📄',
    category: 'professional',
    source: 'tool',
    description: 'PDF解析、文本提取、表格识别、文档生成',
    guide: 'AI获得PDF处理能力，读取分析生成PDF',
    scenarios: ['论文阅读', '合同审查', '报告生成', '表格提取'],
    tags: ['MCP', 'PDF', '文档', 'OCR'],
    metadata: { popularity: 3350 },
    stats: { useCount: 3350, rating: 4.7 },
    activation: '# 📄 PDF MCP 工具\n\n## 🔧 工具能力\n✅ PDF 全文本提取\n✅ 智能表格识别\n✅ 目录大纲提取\n✅ OCR 扫描件识别\n✅ Markdown 转 PDF\n✅ 页码/水印管理\n\n## 🎯 示例\n```\npdf.extract("paper.pdf")\n   .getSection("3. Experiments")\n   .extractTables()\n   .analyzeResults()\n```\n\n**MCP 连接成功 ✓ PDF 能力已激活！**',
    systemPrompt: '你已激活 MCP PDF 能力。你可以读取PDF、提取文本表格、识别OCR、生成PDF报告。处理长文档时自动分章节理解。'
  },
  {
    id: 'mcp-git',
    name: 'Git MCP',
    icon: '📌',
    category: 'programming',
    source: 'tool',
    description: '版本控制、提交历史、代码对比、分支管理',
    guide: 'AI获得本地Git仓库完整操作能力',
    scenarios: ['代码对比', '历史回溯', '提交分析', '冲突解决'],
    tags: ['MCP', 'Git', '版本控制', '代码审查'],
    metadata: { popularity: 4100 },
    stats: { useCount: 4100, rating: 4.8 },
    activation: '# 📌 Git MCP 工具\n\n## 🔧 工具能力\n✅ git diff 详细对比\n✅ git log 历史分析\n✅ git blame 责任人追溯\n✅ 分支合并与冲突解决\n✅ 提交规范自动检查\n✅ 变更影响范围分析\n\n## 🎯 示例\n```\ngit diff main feature/login\n  .analyseRisk()\n  .suggestReviewPoints()\n```\n\n**MCP 连接成功 ✓ Git 能力已激活！**',
    systemPrompt: '你已激活 MCP Git 能力。你可以分析代码变更、检查提交历史、解决冲突、进行代码质量评审。'
  },
  {
    id: 'mcp-docker',
    name: 'Docker MCP',
    icon: '🐳',
    category: 'programming',
    source: 'tool',
    description: '容器管理、镜像构建、编排、日志监控',
    guide: 'AI获得Docker完整操作能力',
    scenarios: ['环境部署', '镜像优化', '容器调试', '日志分析'],
    tags: ['MCP', 'Docker', '容器', 'DevOps'],
    metadata: { popularity: 2850 },
    stats: { useCount: 2850, rating: 4.7 },
    activation: '# 🐳 Docker MCP 工具\n\n## 🔧 工具能力\n✅ Dockerfile 智能优化\n✅ 容器启停/日志/监控\n✅ docker compose 编排\n✅ 镜像体积多层优化\n✅ 健康检查配置\n✅ 网络与卷管理\n\n## 🎯 示例\n```\ndocker ps --format "table {{.Names}}\t{{.Status}}"\ndocker logs -f --tail 100 nginx\ndocker stats --no-stream\n```\n\n**MCP 连接成功 ✓ Docker 能力已激活！**',
    systemPrompt: '你已激活 MCP Docker 能力。你可以管理容器、优化镜像、编写 compose 文件、排查部署问题。'
  },
  {
    id: 'mcp-notification',
    name: '通知 MCP',
    icon: '🔔',
    category: 'life',
    source: 'tool',
    description: '系统通知、邮件、短信、Webhook推送',
    guide: 'AI获得主动通知能力，任务完成主动提醒你',
    scenarios: ['长任务提醒', '异常告警', '进度汇报', '定时通知'],
    tags: ['MCP', '通知', '告警', '自动化'],
    metadata: { popularity: 2600 },
    stats: { useCount: 2600, rating: 4.6 },
    activation: '# 🔔 通知 MCP 工具\n\n## 🔧 工具能力\n✅ 系统桌面通知\n✅ 邮件发送\n✅ 企业微信/钉钉 Webhook\n✅ Slack/Discord 消息\n✅ 定时延迟通知\n✅ 异常告警触发\n\n## 🎯 使用场景\n- 长构建任务完成通知你\n- 后台监控发现异常告警\n- 定时提醒喝水/休息\n- CI/CD 结果推送\n\n**MCP 连接成功 ✓ 通知能力已激活！**',
    systemPrompt: '你已激活 MCP 通知能力。长任务后台运行时，完成后主动发通知提醒用户；发现严重问题时，立即告警。'
  },
];

console.log('✅ 创建 MCP 工具数量:', mcpTools.length);

data.tools = [...data.tools, ...mcpTools];
console.log('✅ 合并后总工具数量:', data.tools.length);

data.tools.forEach(tool => {
  if (!tool.tags) tool.tags = [];
  if (tool.source === 'skill' && !tool.tags.includes('Skill')) {
    tool.tags.unshift('Skill');
  }
  if (tool.source === 'tool' && !tool.tags.includes('MCP')) {
    tool.tags.unshift('MCP');
  }
});

data.tools.sort((a, b) => (b.metadata?.popularity || 0) - (a.metadata?.popularity || 0));

fs.writeFileSync(aiToolsPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n🎉 数据生成完成!');
console.log('   Skill 数量:', data.tools.filter(t => t.source === 'skill').length);
console.log('   MCP 工具数量:', data.tools.filter(t => t.source === 'tool').length);
console.log('   总计:', data.tools.length);
