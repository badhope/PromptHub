import type { Metadata } from 'next';
import { loadUnifiedSkillsData } from '@/lib/unified-data-loader';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: '发现 - Skillora 灵境 AI 应用商店',
  description: '探索数百个精雕细琢的精英 AI 智能体，涵盖编程、创作、办公、教育、生活等全场景应用',
  keywords: 'AI 应用商店, AI 智能体, 精英应用, 提示词, AI 助手',
  openGraph: {
    title: '发现 - Skillora 灵境 AI 应用商店',
    description: '探索数百个精雕细琢的精英 AI 智能体',
    type: 'website',
  },
};

export default async function ExplorePage() {
  const data = await loadUnifiedSkillsData();

  return <ExploreClient initialSkills={data.skills} />;
}
