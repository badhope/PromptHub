'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Heart, MessageCircle, Share2, RefreshCw, Home, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { showCopyToast, showFavoriteToast } from '@/components/ToastProvider';
import ChatModal from '@/components/ChatModal';
import AgentPromptPanel from '@/components/AgentPromptPanel';
import SystemPromptSection from '@/components/SystemPromptSection';
import { SkillDetailSkeleton, EmptyState } from '@/components/Skeleton';
import { useSkill } from '@/hooks/useSkills';
import { getSkillCategory, getSkillDescription, getSkillTags, getSkillSystemPrompt, getSkillUseCount } from '@/types/skill';
import { useFavorites } from '@/hooks/useFavorites';
import { useHapticFeedback } from '@/hooks/useGestures';

const TouchButton = ({ children, onClick, className = '', disabled = false }: any) => (
  <motion.button
    whileTap={{ scale: disabled ? 1 : 0.97 }}
    transition={{ duration: 0.1 }}
    onClick={onClick}
    disabled={disabled}
    className={`relative overflow-hidden ${className}`}
  >
    {children}
  </motion.button>
);

export default function SkillClient() {
  const params = useParams();
  const { status, data: rawSkill, error } = useSkill(params.id as string);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { success, selection } = useHapticFeedback();

  const skill = useMemo(() => {
    if (!rawSkill) return null;
    return {
      id: rawSkill.id,
      name: rawSkill.name,
      icon: rawSkill.icon || '🧠',
      category: getSkillCategory(rawSkill),
      description: getSkillDescription(rawSkill),
      guide: rawSkill.guide || '描述你的需求，开始体验吧！',
      scenarios: getSkillTags(rawSkill),
      systemPrompt: getSkillSystemPrompt(rawSkill),
      useCount: getSkillUseCount(rawSkill),
      source: rawSkill.source,
      rawUrl: (rawSkill as any).content?.raw_url
    };
  }, [rawSkill]);

  const handleToggleFavorite = () => {
    selection();
    toggleFavorite(params.id as string);
    if (!isFavorite(params.id as string)) {
      showFavoriteToast(skill?.name || '', true);
    }
  };

  const copyActivation = () => {
    if (skill) {
      success();
      navigator.clipboard.writeText(skill.systemPrompt);
      setCopied(true);
      showCopyToast(skill.name);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startChat = () => {
    success();
    setShowChat(true);
  };

  const favStatus = useMemo(() => {
    return isFavorite(params.id as string);
  }, [isFavorite, params.id]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f2f2f7] dark:bg-black py-8 px-4 sm:px-6 pb-safe">
        <SkillDetailSkeleton />
      </div>
    );
  }

  if (status === 'error' || !skill) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] dark:bg-black pb-safe">
        <EmptyState
          icon="😵"
          title="技能加载失败"
          subtitle={`无法找到 ID: ${params.id} 对应的技能`}
        />
        <div className="flex flex-col gap-3 max-w-xs mx-auto -mt-8">
          <Link 
            href="/skills" 
            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-center transition-colors"
          >
            返回技能库
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 text-white rounded-2xl font-semibold"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-black pb-safe">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-5 mb-5">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-500/90 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 flex-shrink-0"
                >
                  {skill.icon}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h1 className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">
                      {skill.name}
                    </h1>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleToggleFavorite}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    >
                      <Heart 
                        className={`w-6 h-6 transition-all ${
                          favStatus 
                            ? 'text-red-500 fill-red-500 scale-110' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} 
                      />
                    </motion.button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {skill.source === 'skill' ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 text-[13px] rounded-full font-medium">
                        🧠 Agent 智能体
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 text-[13px] rounded-full font-medium">
                        🔧 专业工具
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-[13px] rounded-full font-medium">
                      {skill.category}
                    </span>
                  </div>
                  
                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {skill.scenarios.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[13px] rounded-xl font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TouchButton
                  onClick={copyActivation}
                  className="py-4 rounded-2xl font-semibold text-[14px] bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    {copied ? '已复制' : '复制提示词'}
                  </div>
                </TouchButton>

                <TouchButton
                  onClick={startChat}
                  className="py-4 rounded-2xl font-semibold text-[14px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    开始对话
                  </div>
                </TouchButton>
              </div>
            </div>
          </div>
        </motion.div>

        {skill.source === 'skill' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-8"
          >
            <AgentPromptPanel skillName={skill.name} basePrompt={skill.systemPrompt} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <SystemPromptSection 
            systemPrompt={skill.systemPrompt} 
            onCopy={copyActivation}
            copied={copied}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700/50">
              <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/90 to-emerald-500/90 flex items-center justify-center text-white text-sm">💡</span>
                使用指南
              </h2>
            </div>
            
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-500/5">
              <div className="prose dark:prose-invert prose-sm max-w-none text-emerald-800/90 dark:text-emerald-200/90">
                <ReactMarkdown>{skill.guide}</ReactMarkdown>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="h-8" />
      </div>

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        skillName={skill.name}
        systemPrompt={skill.systemPrompt}
        icon={skill.icon}
      />
    </div>
  );
}
