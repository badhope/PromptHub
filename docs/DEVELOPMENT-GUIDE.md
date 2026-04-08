# Mobile Skills 开发指南

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- npm >= 10.0.0 或 pnpm >= 8.0.0
- Git

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/badhope/mobile-skills.git
cd mobile-skills

# 安装依赖
cd web
npm install
```

### 开发服务器

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

---

## 📁 项目结构

```
mobile-skills/
├── web/                          # Web 应用
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   ├── components/           # React 组件
│   │   │   ├── SearchBar.tsx     # 搜索栏组件
│   │   │   ├── Skeleton.tsx      # 骨架屏组件
│   │   │   └── VirtualList.tsx   # 虚拟滚动组件
│   │   ├── hooks/                # React Hooks
│   │   │   ├── useAdvancedSearch.ts  # 高级搜索
│   │   │   ├── useFullSkill.ts   # 按需加载
│   │   │   ├── useLiteSkills.ts  # 轻量级数据
│   │   │   └── useLocalStorage.ts # 本地存储
│   │   ├── lib/                  # 工具库
│   │   │   ├── performance.ts    # 性能工具
│   │   │   ├── skill-utils.ts    # 技能工具
│   │   │   └── cache-manager.ts  # 缓存管理
│   │   ├── types/                # TypeScript 类型
│   │   │   └── skill.ts          # 技能类型定义
│   │   ├── skills-data-lite.json # 精简数据
│   │   └── skills-index.json     # 索引数据
│   ├── public/
│   │   └── skills/               # 技能详情文件
│   ├── jest.config.ts            # Jest 配置
│   └── jest.setup.ts             # Jest 设置
├── scripts/                      # 构建脚本
│   ├── create-lite-data.js       # 创建精简数据
│   ├── split-skills-data.js      # 分割数据文件
│   ├── scripts-manager.js        # 脚本管理器
│   ├── performance-report.js     # 性能报告
│   └── validate-optimizations.js # 验证脚本
├── docs/                         # 文档
│   ├── API-DOCUMENTATION.md      # API 文档
│   ├── DEVELOPMENT-GUIDE.md      # 开发指南
│   └── OPTIMIZATION-REPORT.md    # 优化报告
└── data/                         # 数据文件
    ├── performance-optimization-report.json
    ├── validation-report.json
    └── final-classification-report.json
```

---

## 🛠️ 开发规范

### 代码风格

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 配置
- 使用函数式组件和 Hooks
- 组件命名使用 PascalCase
- 函数命名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### 组件开发

```typescript
// 组件模板
'use client';

import { useState, useEffect } from 'react';
import type { ComponentProps } from '@/types/skill';

export function MyComponent({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);

  return (
    <div className="my-component">
      {/* 组件内容 */}
    </div>
  );
}
```

### Hook 开发

```typescript
// Hook 模板
'use client';

import { useState, useCallback, useMemo } from 'react';

export function useMyHook(options: HookOptions = {}) {
  const [state, setState] = useState(initialState);

  const memoizedValue = useMemo(() => {
    // 计算逻辑
    return computedValue;
  }, [dependencies]);

  const handleAction = useCallback(() => {
    // 处理逻辑
  }, [dependencies]);

  return {
    state,
    memoizedValue,
    handleAction
  };
}
```

### 类型定义

```typescript
// 类型定义模板
export interface MyInterface {
  id: string;
  name: string;
  metadata?: {
    created_at: string;
    updated_at: string;
  };
}

export type MyType = 'option1' | 'option2' | 'option3';
```

---

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 测试规范

```typescript
// 测试模板
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  beforeEach(() => {
    // 测试前准备
  });

  afterEach(() => {
    // 测试后清理
  });

  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    
    expect(result.current.value).toBe(expectedValue);
  });

  it('should update value correctly', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue(newValue);
    });
    
    expect(result.current.value).toBe(newValue);
  });
});
```

---

## 📊 性能优化

### 数据加载策略

1. **列表页面**: 使用 `skills-data-lite.json` (1.14MB)
2. **搜索功能**: 使用 `skills-index.json` (0.21MB)
3. **详情页面**: 按需加载单个技能文件

### 渲染优化

1. **虚拟滚动**: 使用 `VirtualList` 组件处理大数据列表
2. **骨架屏**: 使用 `Skeleton` 组件提升加载体验
3. **懒加载**: 使用 `useFullSkill` Hook 按需加载

### 缓存策略

1. **LRU 缓存**: 缓存搜索结果和技能详情
2. **本地存储**: 持久化用户偏好和历史记录
3. **内存缓存**: 缓存已加载的数据

---

## 🔧 脚本工具

### 创建精简数据

```bash
node scripts/create-lite-data.js
```

生成文件：
- `web/src/skills-data-lite.json`
- `web/src/skills-index.json`

### 分割数据文件

```bash
node scripts/split-skills-data.js
```

生成文件：
- `web/public/skills/*.json` (869个技能文件)

### 生成性能报告

```bash
node scripts/performance-report.js
```

生成文件：
- `data/performance-optimization-report.json`

### 验证优化

```bash
node scripts/validate-optimizations.js
```

生成文件：
- `data/validation-report.json`

### 脚本管理器

```bash
# 列出所有脚本
node scripts/scripts-manager.js --list

# 运行特定脚本
node scripts/scripts-manager.js create-lite-data

# 运行所有脚本
node scripts/scripts-manager.js --all
```

---

## 📝 代码注释规范

### 文件头注释

```typescript
/**
 * 文件描述
 * 
 * 详细说明文件的功能和用途
 * @version 2.0.0
 * @author 作者
 */
```

### 函数注释

```typescript
/**
 * 函数描述
 * 
 * 详细说明函数的功能
 * 
 * @param param1 - 参数1描述
 * @param param2 - 参数2描述
 * @returns 返回值描述
 * 
 * @example
 * ```typescript
 * const result = myFunction(arg1, arg2);
 * ```
 */
export function myFunction(param1: string, param2: number): boolean {
  // 实现
}
```

### 组件注释

```typescript
/**
 * 组件描述
 * 
 * 详细说明组件的功能和用法
 * 
 * @example
 * ```tsx
 * <MyComponent prop1="value" prop2={123} />
 * ```
 */
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 实现
}
```

---

## 🚀 部署

### 构建检查

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 测试
npm test

# 构建
npm run build
```

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

---

## 🔍 调试

### React DevTools

安装 React Developer Tools 浏览器扩展，用于：
- 查看组件树
- 检查 Props 和 State
- 分析性能

### 性能分析

```typescript
import { reportWebVitals } from 'next/web-vitals';

reportWebVitals((metric) => {
  console.log(metric);
});
```

### 错误追踪

```typescript
// 使用 Error Boundary
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

---

## 📚 学习资源

### 官方文档

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 项目文档

- [API 文档](./API-DOCUMENTATION.md)
- [优化报告](./OPTIMIZATION-REPORT.md)

---

## 🤝 贡献指南

### 提交代码

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 提交信息规范

使用 Conventional Commits 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具链更新
```

---

## 📞 支持

如有问题或建议，请：
- 提交 GitHub Issue
- 发送邮件至 support@mobile-skills.example.com
- 查看项目文档

---

**文档版本**: v2.0.0  
**最后更新**: 2026-04-08  
**维护者**: Mobile Skills Team
