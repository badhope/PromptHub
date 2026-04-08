import fs from 'fs';
import path from 'path';
import type { SkillsData, SkillsSummaryData } from '@/types/skill';

let cachedSkillsData: SkillsData | null = null;
let cachedSkillsSummary: SkillsSummaryData | null = null;

export function getSkillsData(): SkillsData {
  if (cachedSkillsData) {
    return cachedSkillsData;
  }
  
  const dataPath = path.join(process.cwd(), 'src', 'skills-data.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  cachedSkillsData = JSON.parse(fileContent) as SkillsData;
  
  return cachedSkillsData;
}

export function getSkillsSummary(): SkillsSummaryData {
  if (cachedSkillsSummary) {
    return cachedSkillsSummary;
  }
  
  const dataPath = path.join(process.cwd(), 'src', 'skills-summary.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  cachedSkillsSummary = JSON.parse(fileContent) as SkillsSummaryData;
  
  return cachedSkillsSummary;
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
  const { skills } = getSkillsData();
  return [...new Set(skills.map(s => s.categorization.primary_category))];
}

interface RelatedSkill {
  id: string;
  name: string;
  categorization: {
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
  
  const category = skill.categorization.primary_category;
  const skillTags = skill.categorization.tags;
  
  const sameCategory = skills.filter(
    s => s.categorization.primary_category === category && s.id !== skillId
  );
  
  const withSimilarTags = skills.filter(s => {
    if (s.id === skillId) return false;
    const commonTags = s.categorization.tags.filter(tag => 
      skillTags.includes(tag)
    );
    return commonTags.length > 0;
  });
  
  const combined = [...new Map(
    [...sameCategory, ...withSimilarTags].map(s => [s.id, s])
  ).values()];
  
  return combined
    .sort((a, b) => {
      const diff = b.stats.use_count - a.stats.use_count;
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    })
    .slice(0, limit)
    .map(s => ({
      id: s.id,
      name: s.name,
      categorization: { primary_category: s.categorization.primary_category },
      metadata: { description: s.metadata.description },
      stats: { rating: s.stats.rating, use_count: s.stats.use_count }
    }));
}
