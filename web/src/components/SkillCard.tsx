'use client';

import { memo, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import Balancer from 'react-wrap-balancer';
import { showCopyToast } from './ToastProvider';
import type { Skill, SkillSummary } from '@/types/skill';
import {
  getSkillCategory,
  getSkillDescription,
  getSkillUseCount
} from '@/types/skill';
import {
  getCategoryIcon,
  CATEGORY_I18N_KEYS
} from '@/lib/categories';
import { useI18nContext } from '@/components/I18nProvider';

interface SkillCardProps {
  skill: Skill | SkillSummary;
  index?: number;
}

const SkillCardComponent = function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const { t } = useI18nContext();
  const category = getSkillCategory(skill);
  const description = getSkillDescription(skill);
  const useCount = getSkillUseCount(skill);
  const [isCopied, copyToClipboard] = useCopyToClipboard();
  
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const icon = getCategoryIcon(category);
  const categoryI18nKey = CATEGORY_I18N_KEYS[category];
  const categoryName = categoryI18nKey ? t(categoryI18nKey as Parameters<typeof t>[0]) : category;

  const rotateX = mousePos.y * -6;
  const rotateY = mousePos.x * 6;

  const handleCopyActivation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const activationCmd = 'activation_command' in skill && skill.activation_command
      ? skill.activation_command.content_markdown || ''
      : `你是${skill.name}。请根据你的角色设定，与我进行对话和互动。`;
    copyToClipboard(activationCmd);
    showCopyToast(skill.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.04,
        type: 'spring',
        stiffness: 120
      }}
      className="h-full"
    >
      <HoverCard.Root openDelay={150} closeDelay={100}>
        <HoverCard.Trigger asChild>
          <Link 
            href={`/skills/${skill.id}`}
            className="block h-full group"
          >
            <div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHovered(true)}
              className="relative h-full bg-white border border-gray-200 rounded-2xl p-6 overflow-hidden
                hover:border-black hover:shadow-xl hover:shadow-gray-100
                transition-all duration-300"
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">{icon}</span>
                  </div>
                  <button
                    onClick={handleCopyActivation}
                    className="p-3 bg-gray-100 rounded-xl text-gray-500 hover:bg-black hover:text-white transition-all duration-200 group-hover:opacity-100"
                    aria-label="复制激活指令"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-black mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {skill.name}
                </h3>

                <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                  {categoryName}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[40px] font-medium">
                  <Balancer>{description}</Balancer>
                </p>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    {useCount > 0 ? `${useCount.toLocaleString()} 次使用` : ''}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-black group-hover:gap-3 transition-all duration-300">
                    查看
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            className="z-50 w-80 p-6 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200"
            sideOffset={8}
            align="start"
          >
            <h4 className="text-lg font-bold text-black mb-2">{skill.name}</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 font-medium">
              <Balancer>{description}</Balancer>
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-xs font-semibold text-gray-400">
                {categoryName}
              </div>
              <span className="text-xs font-bold text-gray-400">
                点击卡片查看详情
              </span>
            </div>
            <HoverCard.Arrow className="fill-white" width={20} height={10} />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </motion.div>
  );
};

export default memo(SkillCardComponent);
