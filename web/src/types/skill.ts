export interface Skill {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated';
  categorization: {
    primary_category: string;
    secondary_categories: string[];
    tags: string[];
    attributes: { entertainment: number; professional: number; education: number };
  };
  metadata: {
    description: string;
    long_description: string;
    author: string;
    contributors: string[];
    license: string;
    created_at: string;
    updated_at: string;
    language: string;
    languages_supported: string[];
  };
  content: {
    raw_url: string;
    github_url: string;
    file_path: string;
    content_markdown: string;
  };
  capabilities: {
    best_for: string[];
    input_types: string[];
    output_types: string[];
    min_context: number;
    mobile_optimized: boolean;
    timeout: number;
    retry: number;
  };
  stats: {
    rating: number;
    rating_count: number;
    use_count: number;
    favorite_count: number;
    share_count: number;
    view_count: number;
  };
  activation: {
    prompt_template: string;
    quick_activation: string;
  };
  thumbnails: {
    small: string;
    medium: string;
    large: string;
    banner: string;
  };
  related: {
    similar_skills: string[];
    complementary_skills: string[];
    next_skills: string[];
  };
}

export interface CategoryInfo {
  count: number;
  skills: string[];
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  description: string;
  icon: string;
  color: string;
  subcategories: { id: string; name: string; skills: string[] }[];
}

export interface SkillsData {
  schema_version: string;
  generated_at: string;
  skills: Skill[];
  categories: Record<string, CategoryInfo>;
}
