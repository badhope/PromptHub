'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SkillCard from '@/components/SkillCard';
import type { SkillsData, Skill } from '@/types/skill';
import skillsData from '@/skills-data.json';

const CATEGORY_OPTIONS: Record<string, string> = {
  all: '全部',
  functional: '功能型',
  professional: '专业型',
  creative: '创意型',
  character: '角色型',
  fiction: '虚构世界'
};

const SORT_OPTIONS = [
  { value: 'popular', label: '热门' },
  { value: 'newest', label: '最新' },
  { value: 'rating', label: '评分' },
  { value: 'name', label: '名称' }
];

export default function SkillsContent() {
  const { skills } = skillsData as SkillsData;
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    
    if (category) setSelectedCategory(category);
    if (sort) setSortBy(sort);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  let filteredSkills = [...skills];

  if (selectedCategory !== 'all') {
    filteredSkills = filteredSkills.filter(
      s => s.categorization.primary_category === selectedCategory
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredSkills = filteredSkills.filter(
      s => s.name.toLowerCase().includes(query) ||
           s.metadata.description.toLowerCase().includes(query) ||
           s.categorization.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  switch (sortBy) {
    case 'popular':
      filteredSkills.sort((a, b) => b.stats.use_count - a.stats.use_count);
      break;
    case 'newest':
      filteredSkills.sort((a, b) => 
        new Date(b.metadata.updated_at).getTime() - new Date(a.metadata.updated_at).getTime()
      );
      break;
    case 'rating':
      filteredSkills.sort((a, b) => b.stats.rating - a.stats.rating);
      break;
    case 'name':
      filteredSkills.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">所有技能</h1>
          <p className="text-gray-600">共找到 {filteredSkills.length} 个技能</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索技能名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的技能</h3>
            <p className="text-gray-600">试试其他搜索词或分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
