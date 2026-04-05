'use client';

import { use } from 'react';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import Breadcrumb from '@/components/Breadcrumb';
import type { SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';

const CATEGORY_INFO: Record<string, { name: string; icon: string; color: string; description: string }> = {
  functional: { 
    name: '功能型', 
    icon: '🛠️', 
    color: 'from-indigo-500 to-purple-500',
    description: '实用工具类技能，帮助您完成日常任务和提升工作效率'
  },
  professional: { 
    name: '专业型', 
    icon: '💼', 
    color: 'from-pink-500 to-rose-500',
    description: '专业领域技能，提供深度专业知识和咨询服务'
  },
  creative: { 
    name: '创意型', 
    icon: '🎨', 
    color: 'from-cyan-500 to-blue-500',
    description: '创意内容生成技能，激发您的创造力'
  },
  character: { 
    name: '角色型', 
    icon: '🎭', 
    color: 'from-pink-400 to-purple-400',
    description: '角色扮演技能，体验不同角色的对话风格'
  },
  fiction: { 
    name: '虚构世界', 
    icon: '📖', 
    color: 'from-green-500 to-emerald-500',
    description: '虚构世界构建技能，创造独特的幻想世界'
  }
};

export default function CategoryContent({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { skills } = skillsData as SkillsData;
  
  const categoryInfo = CATEGORY_INFO[category];
  const categorySkills = skills.filter(s => s.categorization.primary_category === category);
  
  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">分类不存在</h1>
          <Link href="/skills" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            返回技能列表
          </Link>
        </div>
      </div>
    );
  }

  const sortedSkills = [...categorySkills].sort((a, b) => {
    const diff = b.stats.use_count - a.stats.use_count;
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`bg-gradient-to-r ${categoryInfo.color} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '技能', href: '/skills' },
            { label: categoryInfo.name }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl">{categoryInfo.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{categoryInfo.name}</h1>
              <p className="text-white/80 mt-2">{categoryInfo.description}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-6 text-sm">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-bold text-lg">{categorySkills.length}</span> 个技能
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-bold text-lg">
                {categorySkills.reduce((sum, s) => sum + s.stats.use_count, 0).toLocaleString()}
              </span> 次使用
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            所有 {categoryInfo.name} 技能
          </h2>
          <Link 
            href="/skills" 
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
          >
            查看全部技能 →
          </Link>
        </div>

        {sortedSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              暂无技能
            </h3>
            <p className="text-gray-600 dark:text-gray-400">该分类下还没有技能</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
