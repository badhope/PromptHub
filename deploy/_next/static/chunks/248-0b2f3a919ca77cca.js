"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[248],{2750:(e,t,r)=>{r.d(t,{Rl:()=>u,vY:()=>d,zO:()=>c});var n=r(3660);let a=null,o=null;function i(e,t){return`## 📖 ${e} 完整使用指南

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

现在开始你的专业咨询之旅！🚀`}a=window.__PRELOADED_SKILLS__||null,o=window.__PRELOADED_TOOLS__||null;let s=0,l=null;async function c(){if(l)return l;try{let[e,t]=await Promise.all([fetch("/skills-data.json").then(e=>e.json()),fetch("/ai-tools.json").then(e=>e.json())]);return a=e,o=t,a?.skills&&a.skills.forEach(e=>{(0,n.Yb)(e)}),l=function(){let e=a||{skills:[]},t=o||{tools:[]},r=new Set;function n(e,t,a="skill"){let o=e?.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"")||`${a}-${t}`;if(!r.has(o))return r.add(o),o;let i=2;for(;r.has(`${o}-${i}`);)i++;return r.add(`${o}-${i}`),`${o}-${i}`}let l=[...e.skills?.map((e,t)=>{let r=!e.systemPrompt||e.systemPrompt.length<200;r&&s++;let a=e.name||`Skill ${t+1}`,o=e.description||"",l=e.scenarios||[];return{...e,name:a,id:n(a,t,"skill"),source:"skill",systemPrompt:r?function(e,t,r=[]){return r.length>0&&r.join("、"),`# 🎯 ${e} - 五层Agent专业架构

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

现在，请告诉我你的具体需求！`}(a,o,l):e.systemPrompt,guide:r?i(a,o):e.guide||i(a,o),category:e.category||"professional",useCount:e.useCount||1e3+10*t,isFavorite:!1}})||[],...t.tools?.map((t,r)=>({...t,name:t.name||`Tool ${r+1}`,id:n(t.name||"anonymous-tool",e.skills?.length+r,"tool"),source:"tool",category:t.category||"professional",useCount:t.useCount||1e3+(e.skills?.length+r)*10,isFavorite:!1}))||[]];s>0&&console.log("✅ 五层架构注入完成：",s,"个技能已拥有完整提示词");let c=Array.from(new Set(l.map(e=>e.category||"professional"))).filter(Boolean),u={};return c.forEach(e=>{u[e]=l.filter(t=>(t.category||"professional")===e)}),{skills:l,categories:c,categoriesMap:u,skillsByCategory:u,totalCount:l.length,version:"2.0.0-unified-five-layer"}}(),console.log("✅ 浏览器端数据加载完成，共",l.totalCount,"个技能/工具"),l}catch(e){return console.error("❌ 数据加载失败:",e),{skills:[],categories:[],categoriesMap:{},skillsByCategory:{},totalCount:0,version:"2.0.0-fallback"}}}function u(e){return(l?.skills||[]).find(t=>t.id===e)}function d(){l=null,a=null,o=null}},3053:(e,t,r)=>{r.d(t,{HZ:()=>s,_u:()=>o,o_:()=>a});var n=r(2115);function a(e){let{onSwipeLeft:t,onSwipeRight:r,onSwipeUp:a,onSwipeDown:o,threshold:s=50,preventDefaultTouchMove:l=!1}=e,c=(0,n.useRef)(null),u=(0,n.useRef)({startX:0,startY:0,currentX:0,currentY:0,isSwiping:!1,startTime:0}),d=(0,n.useCallback)(e=>{let t=e.touches[0];u.current={startX:t.clientX,startY:t.clientY,currentX:t.clientX,currentY:t.clientY,isSwiping:!0,startTime:Date.now()}},[]),m=(0,n.useCallback)(e=>{if(!u.current.isSwiping)return;let t=e.touches[0];u.current.currentX=t.clientX,u.current.currentY=t.clientY,l&&e.preventDefault()},[l]),g=(0,n.useCallback)(()=>{if(!u.current.isSwiping)return;let{startX:e,startY:n,currentX:l,currentY:c,startTime:d}=u.current,m=l-e,g=c-n,p=Math.abs(m),f=Math.abs(g),h=Math.max(p,f)/(Date.now()-d);p>f&&(p>s||h>1)?m>0&&r?(i(),r()):m<0&&t&&(i(),t()):f>p&&(f>s||h>1)&&(g>0&&o?(i(),o()):g<0&&a&&(i(),a())),u.current.isSwiping=!1},[s,t,r,a,o]);return(0,n.useEffect)(()=>{let e=c.current;if(e)return e.addEventListener("touchstart",d,{passive:!0}),e.addEventListener("touchmove",m,{passive:!l}),e.addEventListener("touchend",g,{passive:!0}),()=>{e.removeEventListener("touchstart",d),e.removeEventListener("touchmove",m),e.removeEventListener("touchend",g)}},[d,m,g,l]),{ref:c}}function o(){let e=(0,n.useCallback)((e={})=>{let{intensity:t="medium"}=e;navigator.vibrate&&navigator.vibrate({light:[10],medium:[20],heavy:[40]}[t])},[]),t=(0,n.useCallback)(()=>e({intensity:"light"}),[e]),r=(0,n.useCallback)(()=>navigator.vibrate?.([10,50,10]),[]);return{vibrate:e,selection:t,success:r,warning:(0,n.useCallback)(()=>navigator.vibrate?.([20,50,20,50,20]),[]),error:(0,n.useCallback)(()=>navigator.vibrate?.([40,100,40,100,40]),[])}}function i(e={}){let{intensity:t="medium"}=e;navigator.vibrate&&navigator.vibrate({light:[10],medium:[20],heavy:[40]}[t])}function s(e){let{onLongPress:t,duration:r=500}=e,a=(0,n.useRef)(null),o=(0,n.useRef)(null),s=(0,n.useCallback)(()=>{o.current=setTimeout(()=>{i({intensity:"heavy"}),t?.()},r)},[r,t]),l=(0,n.useCallback)(()=>{o.current&&(clearTimeout(o.current),o.current=null)},[]);return(0,n.useEffect)(()=>{let e=a.current;if(e)return e.addEventListener("touchstart",s,{passive:!0}),e.addEventListener("touchend",l,{passive:!0}),e.addEventListener("touchmove",l,{passive:!0}),e.addEventListener("mousedown",s),e.addEventListener("mouseup",l),e.addEventListener("mouseleave",l),()=>{e.removeEventListener("touchstart",s),e.removeEventListener("touchend",l),e.removeEventListener("touchmove",l),e.removeEventListener("mousedown",s),e.removeEventListener("mouseup",l),e.removeEventListener("mouseleave",l),l()}},[s,l]),{ref:a}}r(3321)},3660:(e,t,r)=>{r.d(t,{Ij:()=>u,Yb:()=>s,kx:()=>c});var n=r(7173);let a=n.Ikc({id:n.YjP().min(1),name:n.YjP().min(1),category:n.YjP().default("professional"),description:n.YjP().optional(),systemPrompt:n.YjP().optional(),useCount:n.aig().int().nonnegative().default(0),metadata:n.Ikc({title:n.YjP(),short_description:n.YjP().optional(),keywords:n.YOg(n.YjP()).default([])}).optional(),stats:n.Ikc({rating:n.aig().default(0),use_count:n.aig().default(0),favorite_count:n.aig().default(0)}).optional()}),o=n.YOg(n.YjP()).default([]),i=n.YOg(n.YjP()).default([]);function s(e){let t=a.safeParse(e);return t.success||console.warn("Skill validation failed:",t.error.issues),t}function l(e,t,r){let n=e.safeParse(t);return n.success?n.data:r}function c(e){try{let t=localStorage.getItem(e);if(!t)return[];return l(o,JSON.parse(t),[])}catch{return[]}}function u(){try{let e=localStorage.getItem("compare-skills");if(!e)return[];return l(i,JSON.parse(e),[])}catch{return[]}}},5050:(e,t,r)=>{function n(e){return e.category||e.categorization?.primary_category||""}function a(e){if(e.description)return e.description;if("metadata"in e&&e.metadata){if("short_description"in e.metadata&&e.metadata.short_description)return e.metadata.short_description;if("description"in e.metadata&&e.metadata.description)return e.metadata.description}return""}function o(e){return e.scenarios&&Array.isArray(e.scenarios)?e.scenarios:e.categorization?.tags||[]}function i(e){return e.stats?.use_count||1e3}function s(e){return"systemPrompt"in e&&e.systemPrompt?e.systemPrompt:"system_prompt"in e&&e.system_prompt?e.system_prompt:"activation_command"in e&&e.activation_command?.content_markdown?e.activation_command.content_markdown:"content"in e&&e.content?.content_markdown?e.content.content_markdown:`你现在是【${e.name}】。请完全进入你的角色，根据你的人设与我进行对话和互动。`}r.d(t,{VW:()=>o,a7:()=>a,kd:()=>n,u5:()=>i,vY:()=>s})},6096:(e,t,r)=>{r.d(t,{$K:()=>x,P0:()=>v,_i:()=>k,default:()=>w});var n=r(5155),a=r(8434),o=r(1436),i=r(2484),s=r(2791),l=r(8822),c=r(1585),u=r(6901),d=r(3210),m=r(7635),g=r(7686),p=r(3053);let f={success:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",error:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",info:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",warning:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",custom:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60"},h={success:"bg-gradient-to-br from-emerald-500 to-green-600 text-white",error:"bg-gradient-to-br from-red-500 to-rose-600 text-white",info:"bg-gradient-to-br from-blue-500 to-cyan-600 text-white",warning:"bg-gradient-to-br from-amber-500 to-orange-600 text-white",custom:"bg-gradient-to-br from-purple-500 to-pink-600 text-white"},y={success:(0,n.jsx)(i.A,{size:18}),error:(0,n.jsx)(s.A,{size:18}),info:(0,n.jsx)(l.A,{size:18}),warning:(0,n.jsx)(c.A,{size:18}),custom:(0,n.jsx)(u.A,{size:18})};function b({options:e,onDismiss:t}){let{success:r,selection:a}=(0,p._u)(),i=e.type||"info";return(0,n.jsxs)(o.P.div,{initial:{opacity:0,y:-20,scale:.96},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-10,scale:.96},transition:{type:"spring",stiffness:350,damping:28},className:`
        ${f[i]} px-4 py-3.5 rounded-2xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        flex items-start gap-3.5 min-w-[340px] sm:min-w-[380px] cursor-default
        backdrop-blur-xl bg-white/95 dark:bg-gray-800/95
      `,onClick:()=>{a()},children:[(0,n.jsx)(o.P.div,{className:`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          shadow-lg ${h[i]}
        `,initial:{scale:.8,rotate:-10},animate:{scale:1,rotate:0},transition:{type:"spring",stiffness:400,damping:20,delay:.1},children:e.icon||y[i]}),(0,n.jsxs)("div",{className:"flex-1 min-w-0 pt-0.5",children:[e.title&&(0,n.jsx)("h4",{className:"font-semibold text-[14px] text-gray-900 dark:text-white mb-0.5 tracking-tight",children:e.title}),(0,n.jsx)("p",{className:"text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed",children:e.message}),e.action&&(0,n.jsx)("button",{onClick:n=>{n.stopPropagation(),r(),e.action?.onClick(),t()},className:"mt-2.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[12px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 active:scale-0.95 transition-transform",children:e.action.label})]}),(0,n.jsx)("button",{onClick:e=>{e.stopPropagation(),a(),t()},className:"flex-shrink-0 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-0.5",children:(0,n.jsx)(d.A,{className:"w-4 h-4 text-gray-400 dark:text-gray-500"})})]})}function v({title:e,message:t,type:r="info",icon:o,duration:i=3500,action:s}){return a.oR.custom(i=>(0,n.jsx)(b,{options:{title:e,message:t,type:r,icon:o,action:s},onDismiss:()=>a.oR.dismiss(i.id)}),{duration:i,position:"top-right",style:{background:"transparent",border:"none",boxShadow:"none",padding:0,maxWidth:"none"}})}function k(e){v({type:"success",title:"已复制",message:`"${e}" 已复制到剪贴板`,icon:(0,n.jsx)(m.A,{size:20})})}function x(e,t){v({type:"custom",title:t?"已收藏":"已取消收藏",message:t?`"${e}" 已添加到收藏夹`:`"${e}" 已从收藏夹移除`,icon:(0,n.jsx)(g.A,{size:20,className:t?"fill-white":""})})}function w({children:e}){return(0,n.jsxs)(n.Fragment,{children:[e,(0,n.jsx)(a.l$,{containerClassName:"toast-container",gutter:16,toastOptions:{style:{background:"transparent",border:"none",boxShadow:"none",padding:0}}})]})}}}]);