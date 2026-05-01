'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Grid, List, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Skill } from '@/types/skill';
import AppCard from '@/modules/store/components/AppCard';
import CategoryFilter from '@/modules/store/components/CategoryFilter';
import { FINAL_ELITE_SYSTEM } from '@/lib/final-elite-system';
import { ROUTES } from '@/lib/routes';

const sortOptions = [
  { id: 'popular', name: '最受欢迎' },
  { id: 'recent', name: '最新上架' },
  { id: 'rating', name: '评分最高' },
  { id: 'downloads', name: '下载最多' },
];

interface ExploreClientProps {
  initialSkills: Skill[];
}

export default function ExploreClient({ initialSkills }: ExploreClientProps) {
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSkills = initialSkills
    .filter(skill => !selectedCategory || (skill.category || '').startsWith(selectedCategory))
    .filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 60);

  const handleCategoryClick = (categoryId: string) => {
    router.push(ROUTES.category(categoryId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            发现精品应用
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            探索 {initialSkills.length}+ 精雕细琢的精英 AI 智能体，助力你的工作与创作
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            分类浏览
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(FINAL_ELITE_SYSTEM).map(([id, category]: [string, any]) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(id)}
                className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:shadow-md bg-gradient-to-br ${category.gradient} cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-bold text-white text-base mb-1">{category.name}</h3>
                  <p className="text-white/70 text-xs">
                    {category.appCount} 个应用
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索 AI 应用..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-0 text-gray-700 dark:text-gray-300 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="hidden sm:flex items-center p-1 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              找到 <span className="font-bold text-gray-700 dark:text-gray-300">{filteredSkills.length}</span> 个应用
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredSkills.map((skill, index) => (
              <AppCard key={skill.id} skill={skill} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
