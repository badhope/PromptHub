import SkillClient from './SkillClient';
import { getAllSkillIds, getSkillById } from '@/lib/skills-data-server';

export function generateStaticParams() {
  const skillIds = getAllSkillIds();
  return skillIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);
  
  if (!skill) {
    return {
      title: '技能未找到',
    };
  }
  
  return {
    title: `${skill.name} - AI Skills`,
    description: skill.metadata?.description || skill.metadata?.short_description || skill.name || '专业AI技能工具',
  };
}

export default function SkillDetailPage() {
  return <SkillClient />;
}
