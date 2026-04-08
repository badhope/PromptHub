import SkillClient from './SkillClient';
import { getAllSkillIds, getSkillById, getRelatedSkills } from '@/lib/skills-data-server';

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
    description: skill.metadata.description,
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);
  
  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">技能未找到</h2>
        </div>
      </div>
    );
  }
  
  const relatedSkills = getRelatedSkills(id);
  
  return <SkillClient skill={skill} relatedSkills={relatedSkills} />;
}
