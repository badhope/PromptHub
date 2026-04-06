'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { Skill } from '@/types/skill';
import {
  getCategoryIcon,
  getCategoryGradient,
  getCategoryColor
} from '@/lib/categories';
import { useI18nContext } from '@/components/I18nProvider';

interface SkillCardProps {
  skill: Skill;
}

const SkillCardComponent = function SkillCard({ skill }: SkillCardProps) {
  const { t, language } = useI18nContext();
  const category = skill.categorization.primary_category;
  const icon = getCategoryIcon(category);
  const colorGradient = getCategoryGradient(category);
  const categoryColor = getCategoryColor(category);
  
  const categoryNames: Record<string, string> = {
    functional: t('skills.functional'),
    professional: t('skills.professional'),
    creative: t('skills.creative'),
    character: t('skills.character'),
    fiction: t('skills.fiction'),
    tool: t('skills.tool'),
    game: t('skills.game')
  };
  
  const categoryName = categoryNames[category] || category;

  return (
    <Link href={`/skills/${skill.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover-lift animate-scale-in cursor-pointer h-full">
        <div className={`h-24 sm:h-32 bg-gradient-to-br ${colorGradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-lg">
            {icon}
          </span>
        </div>
        <div className="p-3 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {skill.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {skill.metadata.description}
          </p>
          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-medium text-white bg-gradient-to-r px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full" style={{
                background: `linear-gradient(135deg, ${categoryColor})`
              }}>
                {categoryName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5 sm:gap-1 font-medium">
                ⭐ {skill.stats.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {skill.stats.use_count.toLocaleString()} {language === 'zh-CN' ? '使用' : 'uses'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(SkillCardComponent);
