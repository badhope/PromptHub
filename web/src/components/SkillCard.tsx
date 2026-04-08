'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { Skill, SkillSummary } from '@/types/skill';
import {
  getSkillCategory,
  getSkillDescription,
  getSkillRating,
  getSkillUseCount
} from '@/types/skill';
import {
  getCategoryIcon,
  getCategoryGradient,
  getCategoryColor,
  CATEGORY_I18N_KEYS
} from '@/lib/categories';
import { useI18nContext } from '@/components/I18nProvider';

interface SkillCardProps {
  skill: Skill | SkillSummary;
}

const SkillCardComponent = function SkillCard({ skill }: SkillCardProps) {
  const { t } = useI18nContext();
  const category = getSkillCategory(skill);
  const description = getSkillDescription(skill);
  const rating = getSkillRating(skill);
  const useCount = getSkillUseCount(skill);
  
  const icon = getCategoryIcon(category);
  const colorGradient = getCategoryGradient(category);
  const categoryColor = getCategoryColor(category);
  const categoryI18nKey = CATEGORY_I18N_KEYS[category];
  const categoryName = categoryI18nKey ? t(categoryI18nKey as Parameters<typeof t>[0]) : category;

  return (
    <Link href={`/skills/${skill.id}`} className="group block h-full">
      <article className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className={`h-28 sm:h-36 bg-gradient-to-br ${colorGradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-lg">
            {icon}
          </span>
        </div>
        
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-200 transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {skill.name}
          </h3>
          
          <p className="text-white font-semibold text-sm mb-4 line-clamp-2 leading-relaxed flex-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t border-white/20">
            <span 
              className="text-xs font-bold text-white px-2.5 py-1 rounded-full backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              style={{
                background: `linear-gradient(135deg, ${categoryColor})`
              }}
            >
              {categoryName}
            </span>
            
            <div className="flex items-center gap-2 text-xs text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              <span className="flex items-center gap-1">
                ⭐ {rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                🔥 {useCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default memo(SkillCardComponent);
