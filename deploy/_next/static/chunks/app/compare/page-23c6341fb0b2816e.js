(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[402],{1669:(e,t,s)=>{"use strict";s.d(t,{default:()=>i});var a=s(5155),r=s(8500),l=s.n(r);function i({items:e}){return(0,a.jsx)("nav",{className:"flex items-center space-x-2 text-sm text-white/80","aria-label":"面包屑导航",children:(0,a.jsx)("ol",{className:"flex items-center space-x-2",children:e.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center",children:[t>0&&(0,a.jsx)("svg",{className:"w-4 h-4 mx-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),e.href?(0,a.jsx)(l(),{href:e.href,className:"hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded",children:e.label}):(0,a.jsx)("span",{className:"text-white font-medium","aria-current":"page",children:e.label})]},t))})})}},2750:(e,t,s)=>{"use strict";s.d(t,{Rl:()=>c,vY:()=>x,zO:()=>o});var a=s(3660);let r=null,l=null;function i(e,t){return`## 📖 ${e} 完整使用指南

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

现在开始你的专业咨询之旅！🚀`}r=window.__PRELOADED_SKILLS__||null,l=window.__PRELOADED_TOOLS__||null;let n=0,d=null;async function o(){if(d)return d;try{let[e,t]=await Promise.all([fetch("/skills-data.json").then(e=>e.json()),fetch("/ai-tools.json").then(e=>e.json())]);return r=e,l=t,r?.skills&&r.skills.forEach(e=>{(0,a.Yb)(e)}),d=function(){let e=r||{skills:[]},t=l||{tools:[]},s=new Set;function a(e,t,r="skill"){let l=e?.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"")||`${r}-${t}`;if(!s.has(l))return s.add(l),l;let i=2;for(;s.has(`${l}-${i}`);)i++;return s.add(`${l}-${i}`),`${l}-${i}`}let d=[...e.skills?.map((e,t)=>{let s=!e.systemPrompt||e.systemPrompt.length<200;s&&n++;let r=e.name||`Skill ${t+1}`,l=e.description||"",d=e.scenarios||[];return{...e,name:r,id:a(r,t,"skill"),source:"skill",systemPrompt:s?function(e,t,s=[]){return s.length>0&&s.join("、"),`# 🎯 ${e} - 五层Agent专业架构

---

## 【第一层：感知层 Perception】
### 🎯 核心身份定位
你是**${e}**，一位在该领域拥有15年以上实战经验的资深专家。
> ${t}

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

现在，请告诉我你的具体需求！`}(r,l,d):e.systemPrompt,guide:s?i(r,l):e.guide||i(r,l),category:e.category||"professional",useCount:e.useCount||1e3+10*t,isFavorite:!1}})||[],...t.tools?.map((t,s)=>({...t,name:t.name||`Tool ${s+1}`,id:a(t.name||"anonymous-tool",e.skills?.length+s,"tool"),source:"tool",category:t.category||"professional",useCount:t.useCount||1e3+(e.skills?.length+s)*10,isFavorite:!1}))||[]];n>0&&console.log("✅ 五层架构注入完成：",n,"个技能已拥有完整提示词");let o=Array.from(new Set(d.map(e=>e.category||"professional"))).filter(Boolean),c={};return o.forEach(e=>{c[e]=d.filter(t=>(t.category||"professional")===e)}),{skills:d,categories:o,categoriesMap:c,skillsByCategory:c,totalCount:d.length,version:"2.0.0-unified-five-layer"}}(),console.log("✅ 浏览器端数据加载完成，共",d.totalCount,"个技能/工具"),d}catch(e){return console.error("❌ 数据加载失败:",e),{skills:[],categories:[],categoriesMap:{},skillsByCategory:{},totalCount:0,version:"2.0.0-fallback"}}}function c(e){return(d?.skills||[]).find(t=>t.id===e)}function x(){d=null,r=null,l=null}},3660:(e,t,s)=>{"use strict";s.d(t,{Ij:()=>c,Yb:()=>n,kx:()=>o});var a=s(7173);let r=a.Ikc({id:a.YjP().min(1),name:a.YjP().min(1),category:a.YjP().default("professional"),description:a.YjP().optional(),systemPrompt:a.YjP().optional(),useCount:a.aig().int().nonnegative().default(0),metadata:a.Ikc({title:a.YjP(),short_description:a.YjP().optional(),keywords:a.YOg(a.YjP()).default([])}).optional(),stats:a.Ikc({rating:a.aig().default(0),use_count:a.aig().default(0),favorite_count:a.aig().default(0)}).optional()}),l=a.YOg(a.YjP()).default([]),i=a.YOg(a.YjP()).default([]);function n(e){let t=r.safeParse(e);return t.success||console.warn("Skill validation failed:",t.error.issues),t}function d(e,t,s){let a=e.safeParse(t);return a.success?a.data:s}function o(e){try{let t=localStorage.getItem(e);if(!t)return[];return d(l,JSON.parse(t),[])}catch{return[]}}function c(){try{let e=localStorage.getItem("compare-skills");if(!e)return[];return d(i,JSON.parse(e),[])}catch{return[]}}},3871:(e,t,s)=>{Promise.resolve().then(s.bind(s,4018))},4018:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var a=s(5155),r=s(2115),l=s(8500),i=s.n(l),n=s(1669),d=s(3327),o=s(4610),c=s(3660);function x(e){return{id:e.id,name:e.name,category:e.categorization.primary_category,rating:e.stats.rating,useCount:e.stats.use_count,favoriteCount:e.stats.favorite_count,mobileOptimized:e.capabilities?.mobile_optimized??!1,bestFor:e.capabilities?.best_for??[],tags:e.categorization.tags,attributes:e.categorization.attributes??{entertainment:0,professional:0,education:0}}}function m(){let{data:e,status:t}=(0,d.a)(),[s,l]=(0,r.useState)([]),[m,g]=(0,r.useState)(!1);(0,r.useEffect)(()=>{g(!0),l({selectedIds:(0,c.Ij)(),mounted:!0}.selectedIds)},[]);let[u,h]=(0,r.useState)(""),[p,y]=(0,r.useState)("");(0,r.useEffect)(()=>{try{localStorage.setItem("compare-skills",JSON.stringify(s))}catch(e){console.warn("Failed to save compare skills:",e)}},[s]);let f=(0,r.useMemo)(()=>{let t=(e||[]).filter(e=>!s.includes(e.id));if(u){let e=u.toLowerCase();t=t.filter(t=>t.name.toLowerCase().includes(e)||t.metadata.description?.toLowerCase().includes(e))}return p&&(t=t.filter(e=>e.categorization.primary_category===p)),t.slice(0,12)},[e,s,u,p]),j=(0,r.useMemo)(()=>e.filter(e=>s.includes(e.id)).map(x),[e,s]),b=e=>0===j.length?null:Math.max(...j.map(t=>t[e])),k=b("rating"),N=b("useCount"),v=b("favoriteCount");return(0,a.jsxs)("div",{className:"min-h-screen bg-gray-50 dark:bg-gray-900",children:[(0,a.jsx)("div",{className:"bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16",children:(0,a.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[(0,a.jsx)(n.default,{items:[{label:"首页",href:"/"},{label:"技能对比"}]}),(0,a.jsxs)("div",{className:"flex items-center gap-4 mt-4",children:[(0,a.jsx)("span",{className:"text-5xl",children:"⚖️"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-4xl font-bold",children:"技能对比"}),(0,a.jsxs)("p",{className:"text-white/80 mt-2",children:["选择多个技能进行特性对比，最多支持 ",4," 个技能"]})]})]})]})}),(0,a.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[j.length>0&&(0,a.jsxs)("div",{className:"mb-8",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,a.jsxs)("h2",{className:"text-xl font-semibold text-gray-900 dark:text-white",children:["已选择 ",j.length,"/",4," 个技能"]}),(0,a.jsx)("button",{onClick:()=>{l([])},className:"text-sm text-red-600 hover:text-red-700 dark:text-red-400",children:"清空选择"})]}),(0,a.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",children:(0,a.jsx)("div",{className:"overflow-x-auto",children:(0,a.jsxs)("table",{className:"w-full",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{className:"bg-gray-50 dark:bg-gray-700/50",children:[(0,a.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-40",children:"对比项"}),j.map(e=>(0,a.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white min-w-[200px]",children:(0,a.jsxs)("div",{className:"flex items-center justify-between gap-2",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2 min-w-0",children:[(0,a.jsx)("span",{className:"text-lg flex-shrink-0",children:(0,o.q1)(e.category)}),(0,a.jsx)("span",{className:"truncate",children:e.name})]}),(0,a.jsx)("button",{onClick:()=>{var t;return t=e.id,void l(s.filter(e=>e!==t))},className:"text-gray-400 hover:text-red-500 flex-shrink-0",children:(0,a.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})},e.id))]})}),(0,a.jsxs)("tbody",{className:"divide-y divide-gray-200 dark:divide-gray-700",children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"分类"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",children:(0,o.Mx)(e.category)})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"评分"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("span",{className:`text-lg font-semibold ${e.rating===k?"text-green-600 dark:text-green-400":"text-gray-900 dark:text-white"}`,children:e.rating.toFixed(1)}),(0,a.jsx)("span",{className:"text-yellow-500",children:"⭐"}),e.rating===k&&j.length>1&&(0,a.jsx)("span",{className:"text-xs text-green-600 dark:text-green-400",children:"最高"})]})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"使用次数"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("span",{className:`text-lg font-semibold ${e.useCount===N?"text-green-600 dark:text-green-400":"text-gray-900 dark:text-white"}`,children:e.useCount.toLocaleString()}),e.useCount===N&&j.length>1&&(0,a.jsx)("span",{className:"text-xs text-green-600 dark:text-green-400",children:"最高"})]})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"收藏数"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("span",{className:`text-lg font-semibold ${e.favoriteCount===v?"text-green-600 dark:text-green-400":"text-gray-900 dark:text-white"}`,children:e.favoriteCount.toLocaleString()}),e.favoriteCount===v&&j.length>1&&(0,a.jsx)("span",{className:"text-xs text-green-600 dark:text-green-400",children:"最高"})]})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"移动端优化"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:e.mobileOptimized?(0,a.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",children:"✅ 支持"}):(0,a.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",children:"❌ 不支持"})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"娱乐属性"}),j.map(e=>(0,a.jsxs)("td",{className:"px-4 py-3",children:[(0,a.jsx)("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",children:(0,a.jsx)("div",{className:"bg-pink-500 h-2 rounded-full",style:{width:`${100*e.attributes.entertainment}%`}})}),(0,a.jsxs)("span",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:[Math.round(100*e.attributes.entertainment),"%"]})]},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"专业属性"}),j.map(e=>(0,a.jsxs)("td",{className:"px-4 py-3",children:[(0,a.jsx)("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",children:(0,a.jsx)("div",{className:"bg-blue-500 h-2 rounded-full",style:{width:`${100*e.attributes.professional}%`}})}),(0,a.jsxs)("span",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:[Math.round(100*e.attributes.professional),"%"]})]},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"教育属性"}),j.map(e=>(0,a.jsxs)("td",{className:"px-4 py-3",children:[(0,a.jsx)("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",children:(0,a.jsx)("div",{className:"bg-green-500 h-2 rounded-full",style:{width:`${100*e.attributes.education}%`}})}),(0,a.jsxs)("span",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:[Math.round(100*e.attributes.education),"%"]})]},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"标签"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsxs)("div",{className:"flex flex-wrap gap-1",children:[e.tags.slice(0,5).map(e=>(0,a.jsx)("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",children:e},e)),e.tags.length>5&&(0,a.jsxs)("span",{className:"text-xs text-gray-500 dark:text-gray-400",children:["+",e.tags.length-5]})]})},e.id))]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"px-4 py-3 text-sm text-gray-500 dark:text-gray-400",children:"操作"}),j.map(e=>(0,a.jsx)("td",{className:"px-4 py-3",children:(0,a.jsx)(i(),{href:`/skills/${e.id}`,className:"inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors",children:"查看详情"})},e.id))]})]})]})})})]}),(0,a.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-gray-900 dark:text-white mb-4",children:"添加技能进行对比"}),(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4 mb-6",children:[(0,a.jsx)("div",{className:"flex-1",children:(0,a.jsx)("input",{type:"text",placeholder:"搜索技能...",value:u,onChange:e=>h(e.target.value),className:"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"})}),(0,a.jsx)("div",{className:"sm:w-48",children:(0,a.jsxs)("select",{value:p,onChange:e=>y(e.target.value),className:"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent",children:[(0,a.jsx)("option",{value:"",children:"全部分类"}),Object.entries({functional:"功能型",professional:"专业型",creative:"创意型",character:"角色型",fiction:"虚构世界"}).map(([e,t])=>(0,a.jsx)("option",{value:e,children:t},e))]})})]}),s.length>=4&&(0,a.jsx)("div",{className:"mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg",children:(0,a.jsxs)("p",{className:"text-sm text-yellow-800 dark:text-yellow-200",children:["⚠️ 已达到最大对比数量（",4,"个），请移除部分技能后再添加。"]})}),(0,a.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",children:f.map(e=>(0,a.jsx)("button",{onClick:()=>{var t;return t=e.id,void(s.length<4&&!s.includes(t)&&l([...s,t]))},disabled:s.length>=4,className:"p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800",children:(0,a.jsxs)("div",{className:"flex items-start gap-3",children:[(0,a.jsx)("span",{className:"text-2xl",children:(0,o.q1)(e.categorization.primary_category)}),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsx)("h3",{className:"font-medium text-gray-900 dark:text-white truncate",children:e.name}),(0,a.jsx)("p",{className:"text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1",children:e.metadata.description}),(0,a.jsxs)("div",{className:"flex items-center gap-2 mt-2",children:[(0,a.jsxs)("span",{className:"text-sm text-yellow-500",children:["⭐ ",e.stats.rating.toFixed(1)]}),(0,a.jsx)("span",{className:"text-sm text-gray-400",children:"•"}),(0,a.jsxs)("span",{className:"text-sm text-gray-500 dark:text-gray-400",children:[e.stats.use_count.toLocaleString()," 次使用"]})]})]})]})},e.id))}),0===f.length&&(0,a.jsxs)("div",{className:"text-center py-12",children:[(0,a.jsx)("span",{className:"text-4xl mb-4 block",children:"\uD83D\uDD0D"}),(0,a.jsx)("p",{className:"text-gray-500 dark:text-gray-400",children:"没有找到匹配的技能"})]})]})]})]})}}},e=>{e.O(0,[500,173,539,441,928,358],()=>e(e.s=3871)),_N_E=e.O()}]);