'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Copy,
  Check,
  Heart,
  MessageCircle,
  Download,
  Star,
  ChevronRight,
  Shield,
  Clock,
  Eye,
  Share2,
  Flag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { showCopyToast, showFavoriteToast } from '@/shared/components/ToastProvider';
import ChatModal from '@/components/ChatModal';
import SystemPromptSection from '@/components/SystemPromptSection';
import ExportButton from '@/modules/store/components/ExportButton';
import { SkillDetailSkeleton, EmptyState } from '@/shared/components/Skeleton';
import { useSkill } from '@/hooks/useSkills';
import { getSkillCategory, getSkillDescription, getSkillTags, getSkillSystemPrompt, getSkillUseCount } from '@/types/skill';
import { useFavorites } from '@/hooks/useFavorites';
import { useHapticFeedback } from '@/hooks/useGestures';
import AppCard from '@/modules/store/components/AppCard';
import { useSkills } from '@/hooks/useSkills';

const TouchButton = ({ children, onClick, className = '', disabled = false }: { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) => (
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

const screenshotUrls = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1675557009875-436f7a3a5f4d?w=800&h=450&fit=crop',
];

export default function SkillClient() {
  const params = useParams();
  const { status, skill: rawSkill } = useSkill(params.id as string);
  const { skills } = useSkills();
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
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
      scenarios: getSkillTags(rawSkill).map((s: any) => typeof s === 'string' ? s : s.scenario),
      systemPrompt: getSkillSystemPrompt(rawSkill),
      useCount: getSkillUseCount(rawSkill),
      source: rawSkill.source,
      rawUrl: ((rawSkill as any)?.content)?.raw_url as string | undefined,
      price: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0,
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 500) + 50,
      downloads: Math.floor(Math.random() * 5000) + 500,
      version: '2.1.0',
      updatedAt: '2024-04-25',
      developer: {
        name: 'Skillora 官方',
        verified: true,
      },
    };
  }, [rawSkill]);

  const relatedApps = useMemo(() => {
    return skills.filter(s => s.id !== skill?.id).slice(0, 4);
  }, [skills, skill]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 pb-safe">
        <SkillDetailSkeleton />
      </div>
    );
  }

  if (status === 'error' || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-safe">
        <EmptyState
          icon="😵"
          title="应用加载失败"
          subtitle={`无法找到 ID: ${params.id} 对应的应用`}
        />
        <div className="flex flex-col gap-3 max-w-xs mx-auto -mt-8">
          <Link 
            href="/explore" 
            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-center transition-colors"
          >
            返回应用商店
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-indigo-500/30 flex-shrink-0"
                >
                  {skill.icon}
                </motion.div>
                
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        {skill.name}
                      </h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          由
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {skill.developer.name}
                          </span>
                          开发
                          {skill.developer.verified && (
                            <Shield className="w-4 h-4 text-emerald-500" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleFavorite}
                        className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Heart 
                          className={`w-6 h-6 transition-all ${
                            favStatus 
                              ? 'fill-red-500 text-red-500 scale-110' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`} 
                        />
                      </motion.button>
                      <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {skill.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({skill.reviews} 评价)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Download className="w-4 h-4" />
                      <span>{skill.downloads.toLocaleString()} 下载</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{skill.useCount.toLocaleString()} 使用</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                    {skill.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {skill.price > 0 ? (
                        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                            ¥{skill.price}
                          </span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-5 h-5" />
                            免费
                          </span>
                        </div>
                      )}
                      <ExportButton skill={skill as any} />
                    </div>

                    <div className="flex items-center gap-2 sm:justify-end">
                      <TouchButton
                        onClick={copyActivation}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-500" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            复制提示词
                          </>
                        )}
                      </TouchButton>

                      <TouchButton
                        onClick={startChat}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5" />
                        立即体验
                      </TouchButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                {[
                  { icon: Star, label: '评分', value: `${skill.rating.toFixed(1)}` },
                  { icon: Download, label: '下载', value: skill.downloads.toLocaleString() },
                  { icon: Clock, label: '版本', value: skill.version },
                  { icon: Shield, label: '更新', value: skill.updatedAt },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <Icon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                      <div className="font-bold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                应用截图
              </h2>
            </div>
            <div className="p-6">
              <div className="rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-700">
                <motion.img
                  key={activeScreenshot}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={screenshotUrls[activeScreenshot]}
                  alt="Screenshot"
                  className="w-full h-48 sm:h-72 object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                {screenshotUrls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveScreenshot(i)}
                    className={`w-12 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                      activeScreenshot === i
                        ? 'border-indigo-500 scale-110'
                        : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={screenshotUrls[i]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                系统提示词
              </h2>
            </div>
            <div className="p-0">
              <SystemPromptSection systemPrompt={skill.systemPrompt} onCopy={copyActivation} copied={copied} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                使用指南
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                复制系统提示词到任意 AI 对话中即可使用
              </p>
            </div>
            <div className="p-6">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{skill.guide}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                  相关推荐
                </h2>
                <Link
                  href="/explore"
                  className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedApps.map((app, i) => (
                  <AppCard key={app.id} skill={app} index={i} variant="compact" />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
              <Flag className="w-4 h-4" />
              举报此应用
            </button>
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
