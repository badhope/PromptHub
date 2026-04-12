import { CATEGORY_CONFIG } from './constants';

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([key, config]) => [key, config.icon])
);

export const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([key, config]) => [key, config.name['zh-CN']])
);

export const CATEGORY_GRADIENTS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([key, config]) => [key, config.gradient])
);

export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([key, config]) => [key, config.color])
);

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '🧩';
}

export function getCategoryName(category: string, language: string = 'zh-CN'): string {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  if (config) {
    return config.name[language as 'zh-CN' | 'en-US'] || config.name['zh-CN'];
  }
  return category;
}

export const CATEGORY_I18N_KEYS: Record<string, string> = {
  game: 'skills.game',
  fiction: 'skills.fiction',
  character: 'skills.character',
  creative: 'skills.creative',
  tools: 'skills.tools',
  professional: 'skills.professional',
  business: 'skills.business',
  lifestyle: 'skills.lifestyle',
  education: 'skills.education'
};

export function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] || 'from-gray-500 to-gray-600';
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#6b7280, #9ca3af';
}

export function getCategoryDescription(category: string, language: string = 'zh-CN'): string {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  if (config) {
    return config.description[language as 'zh-CN' | 'en-US'] || config.description['zh-CN'];
  }
  return '';
}

export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_CONFIG);
}

export function isValidCategory(category: string): boolean {
  return category in CATEGORY_CONFIG;
}

export function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || null;
}

export function getSubcategories(category: string): Record<string, { icon: string; name: { 'zh-CN': string; 'en-US': string } }> | null {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  if (config && 'subcategories' in config) {
    return config.subcategories as Record<string, { icon: string; name: { 'zh-CN': string; 'en-US': string } }>;
  }
  return null;
}

export function getSubcategoryIcon(category: string, subcategory: string): string {
  const subcategories = getSubcategories(category);
  if (subcategories && subcategories[subcategory]) {
    return subcategories[subcategory].icon;
  }
  return '📌';
}

export function getSubcategoryName(category: string, subcategory: string, language: string = 'zh-CN'): string {
  const subcategories = getSubcategories(category);
  if (subcategories && subcategories[subcategory]) {
    return subcategories[subcategory].name[language as 'zh-CN' | 'en-US'] || subcategories[subcategory].name['zh-CN'];
  }
  return subcategory;
}

export function getAllSubcategories(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
    if ('subcategories' in config && config.subcategories) {
      result[category] = Object.keys(config.subcategories);
    }
  }
  return result;
}

export function getSubcategoryCount(category: string): number {
  const subcategories = getSubcategories(category);
  return subcategories ? Object.keys(subcategories).length : 0;
}
