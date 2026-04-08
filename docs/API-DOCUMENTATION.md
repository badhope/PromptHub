# Mobile Skills API 文档

## 📚 概述

Mobile Skills API 提供了对技能数据的访问和操作接口。本文档详细说明了所有可用的 API 端点、数据格式和使用方法。

## 🌐 基础信息

- **基础 URL**: `/api` (开发环境) 或 `https://mobile-skills.example.com/api` (生产环境)
- **数据格式**: JSON
- **字符编码**: UTF-8
- **API 版本**: v2.0.0

---

## 📦 数据文件 API

### 1. 获取精简版技能数据

用于列表页面，包含技能的基本信息，体积小加载快。

```http
GET /skills-data-lite.json
```

**响应示例**:
```json
{
  "skills": [
    {
      "id": "skill-001",
      "name": "技能名称",
      "metadata": {
        "title": "技能标题",
        "short_description": "简短描述",
        "keywords": ["关键词1", "关键词2"]
      },
      "categorization": {
        "primary_category": "functional",
        "subcategory": "assistant",
        "tags": ["标签1", "标签2"]
      },
      "stats": {
        "rating": 4.5,
        "use_count": 1000,
        "favorite_count": 50
      }
    }
  ],
  "categories": {
    "functional": {
      "name": "功能型",
      "description": "功能性技能",
      "subcategories": {
        "assistant": {
          "name": "助手",
          "count": 10
        }
      }
    }
  },
  "_meta": {
    "version": "2.0.0",
    "generated_at": "2026-04-08T00:00:00Z",
    "total_skills": 869
  }
}
```

### 2. 获取技能索引

用于快速搜索，包含最小化的技能信息。

```http
GET /skills-index.json
```

**响应示例**:
```json
{
  "skills": [
    {
      "id": "skill-001",
      "name": "技能名称",
      "category": "functional",
      "tags": ["标签1", "标签2"]
    }
  ],
  "categories": {
    "functional": "功能型"
  },
  "_meta": {
    "version": "2.0.0",
    "total_skills": 869
  }
}
```

### 3. 获取完整技能数据

用于详情页面，包含技能的完整信息。

```http
GET /skills/{skillId}.json
```

**路径参数**:
- `skillId`: 技能 ID (string)

**响应示例**:
```json
{
  "skill": {
    "id": "skill-001",
    "name": "技能名称",
    "metadata": {
      "title": "技能标题",
      "description": "详细描述",
      "short_description": "简短描述",
      "author": "作者",
      "version": "1.0.0",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-04-08T00:00:00Z",
      "keywords": ["关键词1", "关键词2"]
    },
    "categorization": {
      "primary_category": "functional",
      "subcategory": "assistant",
      "tags": ["标签1", "标签2"],
      "secondary_categories": ["creative"]
    },
    "content": {
      "raw_url": "https://example.com/skill.md",
      "content_markdown": "# 技能内容\n\n..."
    },
    "stats": {
      "rating": 4.5,
      "use_count": 1000,
      "favorite_count": 50,
      "share_count": 20,
      "view_count": 5000,
      "rating_count": 100
    },
    "thumbnails": {
      "small": "https://example.com/thumb-small.jpg",
      "medium": "https://example.com/thumb-medium.jpg",
      "large": "https://example.com/thumb-large.jpg"
    }
  }
}
```

---

## 🔍 搜索 API

### 1. 基础搜索

```typescript
// 使用 useSearch Hook
import { useSearch } from '@/hooks/useSearch';

const { query, setQuery, results, hasResults } = useSearch(skills, {
  threshold: 0.4,
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'metadata.description', weight: 0.3 },
    { name: 'categorization.tags', weight: 0.3 }
  ]
});
```

### 2. 高级搜索

```typescript
// 使用 useAdvancedSearch Hook
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

const {
  query,
  setQuery,
  options,
  updateOptions,
  results,
  suggestions,
  searchHistory,
  addToHistory
} = useAdvancedSearch(skills);

// 设置搜索选项
updateOptions({
  category: 'functional',
  tags: ['助手', 'AI'],
  minRating: 4.0,
  dateRange: {
    start: '2024-01-01',
    end: '2026-04-08'
  }
});
```

---

## 📊 数据加载策略

### 1. 列表页面（轻量级加载）

```typescript
import { useLiteSkills } from '@/hooks/useLiteSkills';

const { skills, categories, isLoading, error } = useLiteSkills({
  category: 'functional',
  searchQuery: 'AI助手',
  sortBy: 'popular',
  limit: 20
});
```

### 2. 详情页面（按需加载）

```typescript
import { useFullSkill } from '@/hooks/useFullSkill';

const { skill, isLoading, error, refetch } = useFullSkill('skill-001');
```

### 3. 虚拟滚动（大数据列表）

```typescript
import { VirtualList } from '@/components/VirtualList';

<VirtualList
  items={skills}
  itemHeight={120}
  containerHeight={600}
  renderItem={(skill, index) => <SkillCard skill={skill} />}
  onEndReached={loadMore}
  endReachedThreshold={0.8}
/>
```

---

## 🎨 组件 API

### 1. SearchBar 组件

```typescript
import { SearchBar } from '@/components/SearchBar';

<SearchBar
  skills={skills}
  onSearch={(query, results) => {
    console.log('搜索结果:', results);
  }}
  placeholder="搜索技能..."
  className="w-full"
/>
```

**Props**:
- `skills`: Skill[] - 技能列表
- `onSearch`: (query: string, results: Skill[]) => void - 搜索回调
- `placeholder`: string - 占位符文本
- `className`: string - 自定义样式类

### 2. Skeleton 组件

```typescript
import { 
  Skeleton, 
  SkillCardSkeleton, 
  SkillListSkeleton,
  SkillDetailSkeleton 
} from '@/components/Skeleton';

// 基础骨架
<Skeleton variant="text" width="60%" height={20} />

// 技能卡片骨架
<SkillCardSkeleton />

// 技能列表骨架
<SkillListSkeleton count={6} />

// 技能详情骨架
<SkillDetailSkeleton />
```

### 3. VirtualList 组件

```typescript
import { VirtualList } from '@/components/VirtualList';

<VirtualList
  items={items}
  itemHeight={100}
  containerHeight={600}
  renderItem={(item, index) => <ItemComponent item={item} />}
  overscan={3}
  className="custom-list"
  onEndReached={handleLoadMore}
  endReachedThreshold={0.8}
/>
```

**Props**:
- `items`: T[] - 数据项数组
- `itemHeight`: number - 每项高度（像素）
- `containerHeight`: number - 容器高度（像素）
- `renderItem`: (item: T, index: number) => React.ReactNode - 渲染函数
- `overscan`: number - 预渲染项数（默认 3）
- `className`: string - 自定义样式类
- `onEndReached`: () => void - 滚动到底部回调
- `endReachedThreshold`: number - 触发阈值（0-1）

---

## 🔧 工具函数 API

### 1. 排序函数

```typescript
import { sortSkills, type SortBy } from '@/lib/skill-utils';

const sortedSkills = sortSkills(skills, 'popular');
// 可选值: 'popular' | 'newest' | 'rating' | 'name'
```

### 2. 筛选函数

```typescript
import { filterSkillsByCategory, searchSkills } from '@/lib/skill-utils';

// 按分类筛选
const filteredSkills = filterSkillsByCategory(skills, 'functional');

// 搜索技能
const searchedSkills = searchSkills(skills, 'AI助手');
```

### 3. 性能工具

```typescript
import { 
  debounce, 
  throttle, 
  memoize, 
  chunk,
  formatBytes,
  formatNumber,
  formatRelativeTime,
  LRUCache
} from '@/lib/performance';

// 防抖
const debouncedSearch = debounce(search, 300);

// 节流
const throttledScroll = throttle(handleScroll, 100);

// 缓存
const cachedFn = memoize(expensiveFunction);

// LRU 缓存
const cache = new LRUCache<string, Skill>(100);
cache.set('skill-001', skill);
const cachedSkill = cache.get('skill-001');
```

---

## 📝 类型定义

详见 [skill.ts](./web/src/types/skill.ts)

主要类型包括：
- `Skill`: 完整技能对象
- `SkillSummary`: 技能摘要对象
- `SkillsData`: 技能数据集合
- `CategoryInfo`: 分类信息
- `SkillFilterOptions`: 筛选选项
- `SearchOptions`: 搜索选项
- `PaginatedResult<T>`: 分页结果

---

## 🚀 性能优化建议

### 1. 数据加载

- ✅ 列表页使用 `skills-data-lite.json` (1.14MB)
- ✅ 搜索使用 `skills-index.json` (0.21MB)
- ✅ 详情页按需加载单个技能文件

### 2. 渲染优化

- ✅ 使用虚拟滚动处理大数据列表
- ✅ 使用骨架屏提升加载体验
- ✅ 实现懒加载和代码分割

### 3. 缓存策略

- ✅ 使用 LRU 缓存存储搜索结果
- ✅ 缓存已加载的技能详情
- ✅ 实现本地存储持久化

---

## 📊 性能指标

| 指标 | 优化前 | 优化后 | 提升 |
|-----|-------|-------|------|
| 首次加载 | ~5s | ~0.5s | **90%** |
| 内存占用 | ~50MB | ~7MB | **86%** |
| 数据传输 | 10.84MB | 1.14MB | **89.5%** |
| 搜索响应 | ~500ms | ~50ms | **90%** |

---

## 🔒 安全考虑

- ✅ 所有用户输入都经过验证和清理
- ✅ 使用 React 自动 XSS 防护
- ✅ 无硬编码密钥或敏感信息
- ✅ 实施内容安全策略 (CSP)

---

## 📞 支持

如有问题或建议，请联系：
- GitHub Issues: https://github.com/badhope/mobile-skills/issues
- Email: support@mobile-skills.example.com

---

**文档版本**: v2.0.0  
**最后更新**: 2026-04-08  
**维护者**: Mobile Skills Team
