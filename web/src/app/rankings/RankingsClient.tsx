'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, TrendingUp, Star, Clock, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Skill } from '@/types/skill';
import AppCard from '@/modules/store/components/AppCard';

interface RankingsClientProps {
  initialSkills: Skill[];
}

export default function RankingsClient({ initialSkills }: RankingsClientProps) {
  const [activeTab, setActiveTab] = useState('popular');

  const tabs = [
    { id: 'popular', name: '最受欢迎', icon: TrendingUp },
    { id: 'rating', name: '评分最高', icon: Star },
    { id: 'newest', name: '最新上架', icon: Clock },
    { id: 'downloads', name: '下载最多', icon: Download },
  ];

  const rankedSkills = initialSkills.slice(0, 30);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            应用排行榜
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            发现社区最受欢迎的精英 AI 应用，每一个都经过精雕细琢
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {rankedSkills.map((skill, index) => (
            <div key={skill.id} className="relative">
              {index < 3 && (
                <div className="absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm">
                  {index === 0 && <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">1</div>}
                  {index === 1 && <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">2</div>}
                  {index === 2 && <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">3</div>}
                </div>
              )}
              <AppCard skill={skill} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
