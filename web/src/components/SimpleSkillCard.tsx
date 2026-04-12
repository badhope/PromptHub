'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Skill, SkillSummary } from '@/types/skill';
import {
  getSkillCategory,
  getSkillDescription
} from '@/types/skill';
import {
  getCategoryIcon
} from '@/lib/categories';

interface SimpleSkillCardProps {
  skill: Skill | SkillSummary;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function SimpleSkillCard({ skill, index = 0, isFavorite = false, onToggleFavorite }: SimpleSkillCardProps) {
  const category = getSkillCategory(skill);
  const description = getSkillDescription(skill);
  const icon = ('icon' in skill && skill.icon) ? skill.icon : getCategoryIcon(category);
  
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  
  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleFavorite) {
      onToggleFavorite();
    } else {
      try {
        const stored = localStorage.getItem('favorite-skills');
        let favorites: string[] = stored ? JSON.parse(stored) : [];
        
        if (favorites.includes(skill.id)) {
          favorites = favorites.filter((id: string) => id !== skill.id);
          setLocalFavorite(false);
        } else {
          favorites.push(skill.id);
          setLocalFavorite(true);
        }
        
        localStorage.setItem('favorite-skills', JSON.stringify(favorites));
      } catch (error) {
        console.warn('Failed to update favorites in localStorage:', error);
      }
    }
  };

  return (
    <Link 
      href={`/skills/${skill.id}`}
      className="block h-full group"
    >
      <div className="relative h-full bg-white border border-gray-200 rounded-2xl p-6 overflow-hidden
        hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1
        transition-all duration-500 ease-out">
        
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ease-out">
            <span className="text-2xl group-hover:scale-125 transition-transform duration-500 ease-out">{String(icon || '🤖')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                ${localFavorite 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
            >
              <svg className="w-4 h-4" fill={localFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
              v1.0
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-1">
          {skill.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {(skill.categorization?.tags || []).slice(0, 2).map((tag: string) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center text-gray-400 group-hover:text-black transition-colors duration-300">
            <span className="text-xs font-semibold mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">查看</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
