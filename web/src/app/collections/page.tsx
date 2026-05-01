'use client';

import { Package, Sparkles, Briefcase, GraduationCap, Code2, Palette, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSkills } from '@/hooks/useSkills';

const collections = [
  {
    id: 'productivity',
    name: '职场人效率工具包',
    description: '精选 12 款提升工作效率的 AI 助手，让你准时下班',
    icon: Briefcase,
    gradient: 'from-blue-500 to-cyan-500',
    count: 12,
    featured: true,
    tags: ['办公', '效率', '职场'],
  },
  {
    id: 'student',
    name: '学生党学习助手',
    description: '写论文、刷题、背单词、做总结，学习神器全收录',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-500',
    count: 15,
    featured: true,
    tags: ['学习', '教育', '学生'],
  },
  {
    id: 'developer',
    name: '程序员开发神器',
    description: '代码审查、Bug 排查、架构设计、技术文档',
    icon: Code2,
    gradient: 'from-indigo-500 to-purple-500',
    count: 18,
    featured: true,
    tags: ['编程', '开发', '技术'],
  },
  {
    id: 'creative',
    name: '创作者灵感工坊',
    description: '写文案、画插画、做视频脚本、构思创意',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    count: 14,
    featured: false,
    tags: ['创意', '设计', '内容'],
  },
  {
    id: 'marketing',
    name: '运营营销工具箱',
    description: '写文案、做活动、分析数据、用户运营',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
    count: 10,
    featured: false,
    tags: ['营销', '运营', '增长'],
  },
  {
    id: 'business',
    name: '商业分析智囊团',
    description: '竞品分析、商业模式、财务预测、战略规划',
    icon: Sparkles,
    gradient: 'from-violet-500 to-fuchsia-500',
    count: 8,
    featured: false,
    tags: ['商业', '分析', '战略'],
  },
];

export default function CollectionsPage() {
  const { skills } = useSkills();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              精选合集
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            精心策划的场景化应用套装，开箱即用
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            🔥 本周推荐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.filter(c => c.featured).map((collection, index) => {
              const Icon = collection.icon;
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-90`} />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  
                  <div className="relative p-6 text-white min-h-[220px] flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                        {collection.count} 个应用
                      </span>
                    </div>

                    <h3 className="text-2xl font-black mb-2">{collection.name}</h3>
                    <p className="text-sm opacity-90 mb-4 flex-1">{collection.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {collection.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/15 rounded-lg text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
                        查看全部
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          📦 全部合集
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => {
            const Icon = collection.icon;
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
              >
                <div className={`h-2 bg-gradient-to-r ${collection.gradient}`} />
                
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${collection.gradient} flex items-center justify-center text-white shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {collection.count} 个精选应用
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {collection.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {skills.slice(0, 3).map((skill, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm"
                          title={skill.name}
                        >
                      {skills.slice(0, 3).map((skill, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm"
                          title={skill.name}
                        >
                          {['🤖', '✨', '🚀'][i % 3]}
                        </div>
                      ))}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                        +{collection.count - 3}
                      </div>
                    </div>
                    <Link
                      href={`/collections/${collection.id}`}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      开始使用
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
