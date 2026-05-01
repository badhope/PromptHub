import type { Metadata } from 'next';
import { loadUnifiedSkillsData } from '@/lib/unified-data-loader';
import RankingsClient from './RankingsClient';

export const metadata: Metadata = {
  title: '应用排行榜 - Skillora 灵境 AI 应用商店',
  description: '发现社区最受欢迎的精英 AI 应用，最受欢迎、评分最高、最新上架的优质智能体',
  keywords: 'AI 应用排行榜, 热门智能体, 精英应用, AI 助手排名',
  openGraph: {
    title: '应用排行榜 - Skillora 灵境',
    description: '发现社区最受欢迎的精英 AI 应用',
    type: 'website',
  },
};

export default async function RankingsPage() {
  const data = await loadUnifiedSkillsData();

  return <RankingsClient initialSkills={data.skills} />;
}
