import * as fs from 'fs';
import * as path from 'path';
import type { SkillsData, SkillsSummaryData } from '@/types/skill';

let cachedSkillsData: SkillsData | null = null;
let cachedSkillsSummary: SkillsSummaryData | null = null;

function findDataFile(filename: string): string {
  const possiblePaths = [
    path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', filename),
    path.join(/*turbopackIgnore: true*/ process.cwd(), 'src', filename),
    path.join(/*turbopackIgnore: true*/ process.cwd(), filename),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return possiblePaths[0];
}

export function getSkillsData(): SkillsData {
  if (cachedSkillsData) {
    return cachedSkillsData;
  }
  
  const dataPath = findDataFile('ai-tools.json');
  
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const rawData = JSON.parse(fileContent) as SkillsData;
    
    const skills = rawData.tools || rawData.skills || [];
    
    cachedSkillsData = {
      ...rawData,
      skills
    };
    
    return cachedSkillsData;
  } catch (e) {
    console.warn('服务端 ai-tools.json 加载失败，尝试 fallback:', e);
    
    try {
      const fallbackPath = findDataFile('skills-data.json');
      const fileContent = fs.readFileSync(fallbackPath, 'utf-8');
      const rawData = JSON.parse(fileContent) as SkillsData;
      cachedSkillsData = rawData;
      return cachedSkillsData;
    } catch (e2) {
      console.error('所有数据文件都加载失败:', e2);
      return { skills: [], categories: [] };
    }
  }
}

export function getSkillsSummary(): SkillsSummaryData {
  if (cachedSkillsSummary) {
    return cachedSkillsSummary;
  }
  
  const dataPath = findDataFile('skills-summary.json');
  
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    cachedSkillsSummary = JSON.parse(fileContent) as SkillsSummaryData;
    return cachedSkillsSummary;
  } catch (e) {
    console.error('skills-summary.json 加载失败:', e);
    return { summaries: [], categories: {}, skills: [] } as SkillsSummaryData;
  }
}

export function getSkillById(id: string) {
  const { skills } = getSkillsData();
  return skills.find(s => s.id === id);
}

export function getAllSkillIds(): string[] {
  const { skills } = getSkillsData();
  return skills.map(s => s.id);
}

export function getAllCategories(): string[] {
  const { skills = [] } = getSkillsData();
  return [...new Set(skills.map(s => 
    s.category || s.categorization?.primary_category || 'uncategorized'
  ))];
}

interface RelatedSkill {
  id: string;
  name: string;
  category?: string;
  categorization?: {
    primary_category: string;
  };
  metadata: {
    description?: string;
  };
  stats: {
    rating: number;
    use_count: number;
  };
}

export function getRelatedSkills(skillId: string, limit: number = 6): RelatedSkill[] {
  const { skills } = getSkillsData();
  const skill = skills.find(s => s.id === skillId);
  
  if (!skill) return [];
  
  const category = skill.category || skill.categorization?.primary_category || '';
  const skillTags = skill.scenarios || skill.categorization?.tags || [];
  
  const sameCategory = skills.filter(
    s => (s.category || s.categorization?.primary_category) === category && s.id !== skillId
  );
  
  const withSimilarTags = skills.filter(s => {
    if (s.id === skillId) return false;
    const tags = s.scenarios || s.categorization?.tags || [];
    const commonTags = tags.filter(tag => skillTags.includes(tag));
    return commonTags.length > 0;
  });
  
  const combined = [...sameCategory, ...withSimilarTags];
  const unique = Array.from(new Map(combined.map(s => [s.id, s])).values());
  
  return unique.slice(0, limit).map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    categorization: s.categorization,
    metadata: {
      description: s.description || s.metadata?.description
    },
    stats: {
      rating: s.stats?.rating || 4.8,
      use_count: s.stats?.use_count || 1000
    }
  }));
}

export function getSkillCount(): number {
  const { skills } = getSkillsData();
  return skills.length;
}

export function invalidateServerCache() {
  cachedSkillsData = null;
  cachedSkillsSummary = null;
}
