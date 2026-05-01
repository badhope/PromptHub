'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Check, Copy, FileText } from 'lucide-react';
import type { Skill, SkillSummary } from '@/types/skill';
import { exportSkillToMarkdown, getExportPlatforms, type ExportPlatform } from '@/lib/skill-export';
import { useHapticFeedback } from '@/hooks/useGestures';
import { useFavorites } from '@/hooks/useFavorites';
import toast from 'react-hot-toast';

interface ExportModalProps {
  skill: Skill | SkillSummary;
  isOpen: boolean;
  onClose: () => void;
}

const SPRING_CONFIG = { type: 'spring', damping: 25, stiffness: 200 } as const;

export default function ExportModal({ skill, isOpen, onClose }: ExportModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<ExportPlatform>('generic');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { success } = useHapticFeedback();
  const { addDownload } = useFavorites();

  const platforms = getExportPlatforms();

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const { content, filename } = exportSkillToMarkdown(skill, selectedPlatform);
      
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addDownload(skill.id);
      success();
      toast.success('导出成功！已记录到下载历史');
      onClose();
    } catch (error) {
      toast.error('导出失败，请重试');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = () => {
    try {
      const { content } = exportSkillToMarkdown(skill, selectedPlatform);
      navigator.clipboard.writeText(content);
      addDownload(skill.id);
      success();
      toast.success('已复制到剪贴板！已记录到下载历史');
    } catch (_error) {
      toast.error('复制失败，请重试');
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  if (!isOpen) return null;

  const selectedPlatformConfig = platforms.find(p => p.id === selectedPlatform);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={SPRING_CONFIG}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">导出角色文档</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">下载后可发送给任意 AI 使用</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  选择 AI 平台
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                        ${selectedPlatform === platform.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{platform.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{platform.description}</div>
                      </div>
                      {selectedPlatform === platform.id && (
                        <Check className="w-4 h-4 text-indigo-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{selectedPlatformConfig?.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">使用方法</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      1. 下载本文档<br />
                      2. 打开 {selectedPlatformConfig?.name}<br />
                      3. 发送文件或粘贴内容<br />
                      4. 等待 AI 确认激活后即可使用
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      预览内容
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                        {exportSkillToMarkdown(skill, selectedPlatform).content.slice(0, 500)}...
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    导出中...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    下载 {selectedPlatformConfig?.name} 文档
                  </>
                )}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制内容
                </button>
                <button
                  onClick={handlePreview}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {showPreview ? '隐藏预览' : '预览内容'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
