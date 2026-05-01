import type { Metadata } from 'next';
import { loadUnifiedSkillsData } from '@/lib/unified-data-loader';
import { FINAL_ELITE_SYSTEM } from '@/lib/final-elite-system';
import SubcategoryClient from './SubcategoryClient';

interface Props {
  params: Promise<{
    id: string;
    subid: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, subid } = await params;
  const category = FINAL_ELITE_SYSTEM[id];
  const subcategory = category?.subcategories?.find((s: any) => s.id === subid);
  
  if (!category || !subcategory) {
    return {
      title: '分类不存在 - Skillora 灵境',
    };
  }

  return {
    title: `${subcategory.name} - ${category.name} - Skillora 灵境 AI 应用商店`,
    description: subcategory.description,
    keywords: `${subcategory.name}, ${category.name}, AI 智能体, AI 应用, 提示词`,
    openGraph: {
      title: `${subcategory.name} - Skillora 灵境`,
      description: subcategory.description,
      type: 'website',
    },
  };
}

export default async function SubcategoryPage({ params }: Props) {
  await params;
  const data = await loadUnifiedSkillsData();

  return <SubcategoryClient initialSkills={data.skills} />;
}
