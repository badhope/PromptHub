import type { Metadata } from 'next';
import { loadUnifiedSkillsData } from '@/lib/unified-data-loader';
import { FINAL_ELITE_SYSTEM } from '@/lib/final-elite-system';
import CategoryClient from './CategoryClient';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = FINAL_ELITE_SYSTEM[id];
  
  if (!category) {
    return {
      title: '分类不存在 - Skillora 灵境',
    };
  }

  return {
    title: `${category.name} - Skillora 灵境 AI 应用商店`,
    description: category.description,
    keywords: `${category.name}, AI 智能体, AI 应用, 提示词, ${category.subcategories.map(s => s.name).join(', ')}`,
    openGraph: {
      title: `${category.name} - Skillora 灵境`,
      description: category.description,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  await params;
  const data = await loadUnifiedSkillsData();

  return <CategoryClient initialSkills={data.skills} />;
}
