import CategoryPageClient from './CategoryPageClient';
import type { SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';

export function generateStaticParams() {
  const { skills } = skillsData as SkillsData;
  const categories = [...new Set(skills.map(s => s.categorization.primary_category))];
  return categories.map(category => ({ category }));
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return <CategoryPageClient params={params} />;
}
