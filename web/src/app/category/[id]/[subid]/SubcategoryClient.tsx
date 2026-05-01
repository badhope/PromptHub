'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Grid, List, ChevronDown, Sparkles, ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Skill } from '@/types/skill';
import AppCard from '@/modules/store/components/AppCard';
import { FINAL_ELITE_SYSTEM } from '@/lib/final-elite-system';

const sortOptions = [
  { id: 'popular', name: '最受欢迎' },
  { id: 'recent', name: '最新上架' },
  { id: 'rating', name: '评分最高' },
  { id: 'downloads', name: '下载最多' },
];

interface SubcategoryClientProps {
  initialSkills: Skill[];
}

export default function SubcategoryClient({ initialSkills }: SubcategoryClientProps) {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const subcategoryId = params.subid as string;
  const [selectedSort, setSelectedSort] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const category = FINAL_ELITE_SYSTEM[categoryId];
  const subcategory = category?.subcategories?.find((s: any) => s.id === subcategoryId);

  const filteredSkills = initialSkills
    .filter(skill => (skill.category || '') === `${categoryId}/${subcategoryId}`)
    .filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 60);

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">分类不存在</h2>
          <Link href="/explore" className="text-indigo-500 hover:text-indigo-600">
            返回发现页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/explore" className="hover:text-indigo-500 flex items-center gap-1">
              <Home className="w-4 h-4" />
              发现
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/category/${categoryId}`} className="hover:text-indigo-500">
              {category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">{subcategory.name}</span>
          </nav>

          <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${category.gradient}`}>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                  {subcategory.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">
                    {subcategory.name}
                  </h1>
                  <p className="text-white/80 mt-1">
                    {subcategory.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-sm">
                  {subcategory.eliteSkills.length} 个应用
                </div>
                <div className="text-white/60 text-sm">
                  所属分类：{category.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索该分类下的应用..."
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
