/**
 * Mobile Skills 类型定义
 * 
 * 本文件定义了项目中使用的所有核心类型，包括技能、分类、统计等
 * @version 2.0.0
 * @author Mobile Skills Team
 */

export interface Skill {
  id: string;
  name: string;
  number?: string;
  index?: number;
  metadata: SkillMetadata;
  categorization: SkillCategorization;
  content?: SkillContent;
  stats: SkillStats;
  thumbnails?: SkillThumbnails;
}

export interface SkillMetadata {
  title: string;
  description?: string;
  short_description?: string;
  author?: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
  keywords?: string[];
}

export interface SkillCategorization {
  primary_category: CategoryType;
  subcategory: string;
  tags: string[];
  secondary_categories?: string[];
}

export type CategoryType = 
  | 'functional' 
  | 'character' 
  | 'fiction' 
  | 'professional' 
  | 'creative' 
  | 'game' 
  | 'tool';

export interface SkillContent {
  raw_url?: string;
  content_markdown?: string;
}

export interface SkillStats {
  rating: number;
  use_count: number;
  favorite_count: number;
  share_count: number;
  view_count: number;
  rating_count: number;
}

export interface SkillThumbnails {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

export interface SkillSummary {
  id: string;
  name: string;
  number?: string;
  index?: number;
  metadata: {
    title: string;
    short_description?: string;
    keywords?: string[];
  };
  categorization: {
    primary_category: CategoryType;
    subcategory: string;
    tags: string[];
  };
  stats: {
    rating: number;
    use_count: number;
    favorite_count: number;
  };
}

export interface CategoryCount {
  count: number;
}

export interface SkillsData {
  schema_version?: string;
  generated_at?: string;
  skills: Skill[];
  categories: Record<string, CategoryCount>;
  version?: string;
  meta?: {
    total_skills: number;
    total_categories: number;
    last_updated: string;
    version: string;
    generator: string;
    optimized: boolean;
    optimization_version: string;
    enhanced: boolean;
    enhancement_version: string;
    category_system?: CategorySystem;
  };
}

export interface CategoryInfo {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  subcategories?: Record<string, SubcategoryInfo>;
}

export interface SubcategoryInfo {
  name: string;
  description?: string;
  count?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  name_en?: string;
  icon?: string;
  description?: string;
  skills?: string[];
}

export interface Category {
  id?: string;
  name: string;
  name_en?: string;
  description?: string;
  icon?: string;
  color?: string;
  gradient?: string;
  subcategories?: Record<string, Subcategory> | Subcategory[];
}

export interface CategorySystem {
  [categoryId: string]: Category;
}

export interface SkillsSummaryData {
  skills: SkillSummary[];
  summaries: SkillSummary[];
  categories: Record<string, CategoryInfo>;
}

export interface CategoryGroup {
  name: string;
  categories: CategoryInfo[];
  icon?: string;
}

export interface SkillFilterOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: SortOption;
}

export type SortOption = 
  | 'popular' 
  | 'newest' 
  | 'rating' 
  | 'name' 
  | 'updated';

export interface SearchOptions {
  query?: string;
  threshold?: number;
  keys?: string[];
}

export interface SearchResult<T> {
  item: T;
  score?: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SkillCardProps {
  skill: Skill | SkillSummary;
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  showThumbnail?: boolean;
  onClick?: () => void;
  onFavorite?: () => void;
  className?: string;
}

export interface SkillListProps {
  skills: Skill[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'grid';
  loading?: boolean;
  emptyText?: string;
  onSkillClick?: (skill: Skill) => void;
}

export interface CategoryCardProps {
  category: CategoryInfo;
  skillCount: number;
  onClick?: () => void;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, results: Skill[]) => void;
  suggestions?: boolean;
  filters?: SkillFilterOptions;
}

export interface FilterPanelProps {
  options: SkillFilterOptions;
  categories: Record<string, CategoryInfo>;
  onChange: (options: SkillFilterOptions) => void;
  onClear: () => void;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'progress';
  message?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'zh-CN' | 'en' | 'ja-JP';
  sortBy?: SortOption;
  viewMode?: 'grid' | 'list';
  animations?: boolean;
}

export interface FavoriteSkill {
  skillId: string;
  addedAt: string;
}

export interface UserSession {
  id: string;
  preferences: UserPreferences;
  favorites: FavoriteSkill[];
  recentlyViewed: string[];
  searchHistory: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortOption;
  order?: 'asc' | 'desc';
}

export function getSkillCategory(skill: Skill | SkillSummary): string {
  return skill.categorization?.primary_category || '';
}

export function getSkillDescription(skill: Skill | SkillSummary): string {
  if ('metadata' in skill && skill.metadata) {
    if ('short_description' in skill.metadata && skill.metadata.short_description) {
      return skill.metadata.short_description;
    }
    if ('description' in skill.metadata && skill.metadata.description) {
      return skill.metadata.description;
    }
  }
  return '';
}

export function getSkillTags(skill: Skill | SkillSummary): string[] {
  return skill.categorization?.tags || [];
}

export function getSkillRating(skill: Skill | SkillSummary): number {
  return skill.stats?.rating || 0;
}

export function getSkillUseCount(skill: Skill | SkillSummary): number {
  return skill.stats?.use_count || 0;
}
