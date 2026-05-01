'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, Download, Check } from 'lucide-react';
import type { SkillSummary } from '@/types/skill';
import { useHapticFeedback } from '@/hooks/useGestures';
import { useFavorites } from '@/hooks/useFavorites';
import { ROUTES } from '@/lib/routes';
import ExportButton from './ExportButton';

interface AppCardProps {
  skill: SkillSummary;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export default function AppCard({ skill, index = 0, variant = 'default' }: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selection, success } = useHapticFeedback();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(skill.id);
    success();
  };

  const [rating] = useState(() => 4.3 + Math.random() * 0.7);
  const [downloadCount] = useState(() => Math.floor(Math.random() * 5000) + 100);

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative"
      >
        <Link
          href={ROUTES.skill(skill.id)}
          onClick={() => selection()}
          className="block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className="text-6xl"
                >
                  {['🤖', '✨', '🚀', '💡', '🎯', '⚡'][index % 6]}
                </motion.div>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className={`transition-all duration-300 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                  <ExportButton skill={skill as any} variant="icon" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 !p-2" />
                </div>
                <button
                  onClick={handleFavorite}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(skill.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>
              {(skill as any).featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    精选
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {skill.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                {skill.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {downloadCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                </div>

                <div className={`transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}>
                  <ExportButton skill={skill} variant="icon" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="group"
      >
        <Link
          href={`/skills/${skill.id}`}
          onClick={() => selection()}
          className="block"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl shrink-0">
                {skill.icon || ['🤖', '✨', '🚀', '💡', '🎯', '⚡'][index % 6]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                  {skill.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {skill.category}
                </p>
              </div>
              <ExportButton skill={skill as any} variant="icon" />
              <button
                onClick={handleFavorite}
                className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                isFavorite(skill.id)
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
                />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Link
          href={ROUTES.skill(skill.id)}
          onClick={() => selection()}
          className="block group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all">
                {skill.icon || ['🤖', '✨', '🚀', '💡', '🎯', '⚡'][index % 6]}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleFavorite}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                  isFavorite(skill.id)
                    ? 'text-red-500 fill-red-500 scale-110'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                  />
                </button>

                <div className={`transition-all duration-300 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                  <ExportButton skill={skill} variant="icon" />
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
              {skill.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Download className="w-3.5 h-3.5" />
                <span>{downloadCount}</span>
              </div>
              {(skill as any).price && (skill as any).price > 0 ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ¥{(skill as any).price}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  免费
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
