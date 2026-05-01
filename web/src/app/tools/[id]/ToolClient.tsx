'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { showCopyToast, showFavoriteToast } from '@/shared/components/ToastProvider';
import ChatModal from '@/components/ChatModal';
import { getSkillByIdSync, invalidateAllData } from '@/lib/unified-data-loader';
import { getSkillCategory, getSkillDescription, getSkillTags, getSkillSystemPrompt, getSkillUseCount } from '@/types/skill';
import { useFavorites } from '@/hooks/useFavorites';
import { useHapticFeedback } from '@/hooks/useGestures';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  guide: string;
  scenarios: string[];
  systemPrompt: string;
  useCount: number;
  rawUrl?: string;
}

export default function ToolClient() {
  const params = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success } = useHapticFeedback();

  useEffect(() => {
    setMounted(true);
    invalidateAllData();
    
    const found = getSkillByIdSync(params.id as string);
    if (found) {
      setSkill({
        id: found.id,
        name: found.name,
        icon: found.icon || '🔧',
        category: getSkillCategory(found),
        description: getSkillDescription(found),
        guide: found.guide || '描述你的需求，开始体验吧！',
        scenarios: getSkillTags(found),
        systemPrompt: getSkillSystemPrompt(found),
        useCount: getSkillUseCount(found),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawUrl: ((found as any)?.content)?.raw_url as string | undefined
      });
    } else {
      invalidateAllData();
      const retry = getSkillByIdSync(params.id as string);
      if (retry) {
        setSkill({
          id: retry.id,
          name: retry.name,
          icon: retry.icon || '🔧',
          category: getSkillCategory(retry),
          description: getSkillDescription(retry),
          guide: retry.guide || '描述你的需求，开始体验吧！',
          scenarios: getSkillTags(retry),
          systemPrompt: getSkillSystemPrompt(retry),
          useCount: getSkillUseCount(retry),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawUrl: ((retry as any)?.content)?.raw_url as string | undefined
        });
      }
    }
  }, [params.id]);

  const favStatus = useMemo(() => {
    return isFavorite(params.id as string);
  }, [isFavorite, params.id]);

  if (!mounted || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(params.id as string);
    if (!isFavorite(params.id as string)) {
      showFavoriteToast(skill?.name || '', true);
    }
    success();
  };

  const copyActivation = () => {
    if (skill) {
      navigator.clipboard.writeText(skill.systemPrompt);
      setCopied(true);
      showCopyToast(skill.name);
      setTimeout(() => setCopied(false), 2000);
      success();
    }
  };

  const startChat = () => {
    setShowChat(true);
    success();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/skills" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回探索中心
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-7xl mb-4">{skill.icon}</div>
                <h1 className="text-4xl font-bold mb-3">{skill.name}</h1>
                <p className="text-white/90 text-lg max-w-xl">{skill.description}</p>
                <div className="flex items-center gap-2 mt-4 text-white/75 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {skill.useCount.toLocaleString()} 人正在使用
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-4 rounded-2xl transition-all ${
                  favStatus 
                    ? 'bg-white/20 text-red-400 scale-110' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Heart className={`w-7 h-7 ${favStatus ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={startChat}
                className="flex-1 py-5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-7 h-7" />
                🚀 立即开始使用
              </button>
              <button
                onClick={copyActivation}
                className={`sm:w-auto px-8 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                  copied
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                {copied ? '已复制' : '复制指令'}
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                适用场景
              </h3>
              <div className="flex flex-wrap gap-3">
                {skill.scenarios.map((scenario, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-50 dark:from-blue-900/30 to-cyan-50 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-medium"
                  >
                    {scenario}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 dark:from-gray-700/50 to-gray-100 dark:to-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                使用指南
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                <ReactMarkdown>{skill.guide}</ReactMarkdown>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <span className="text-lg">✨</span>
                  <span><strong>小贴士：</strong>点击「立即开始使用」，第一次设置你的 OpenAI API Key，存在本地以后就不用再填了！</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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
