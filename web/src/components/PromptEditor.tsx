'use client';

import { useState, useEffect, useCallback } from 'react';
import { Edit, Eye, Save, RotateCcw, Clock, Copy, Check, History, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { showCopyToast, showToast } from '@/components/ToastProvider';
import { useHapticFeedback } from '@/hooks/useGestures';

interface Version {
  id: number;
  content: string;
  timestamp: number;
  author: string;
  message: string;
}

interface PromptEditorProps {
  initialContent: string;
  skillName: string;
  onSave?: (content: string) => void;
}

export default function PromptEditor({ initialContent, skillName, onSave }: PromptEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [content, setContent] = useState(initialContent);
  const [versions, setVersions] = useState<Version[]>([
    {
      id: 1,
      content: initialContent,
      timestamp: Date.now() - 86400000,
      author: 'System',
      message: '初始版本'
    }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { success, warning } = useHapticFeedback();

  const isModified = content !== initialContent;

  const saveVersion = useCallback(() => {
    if (!isModified) {
      showToast({
        type: 'info',
        message: '没有检测到修改'
      });
      return;
    }

    const newVersion: Version = {
      id: versions.length + 1,
      content,
      timestamp: Date.now(),
      author: 'User',
      message: `版本 ${versions.length + 1}`
    };

    setVersions(prev => [...prev, newVersion]);
    onSave?.(content);
    showToast({
      type: 'success',
      message: '版本已保存'
    });
    success();
  }, [content, isModified, versions.length, onSave, success]);

  const revertToVersion = useCallback((version: Version) => {
    setContent(version.content);
    showToast({
      type: 'success',
      message: `已回滚到 ${version.message}`
    });
    warning();
  }, [warning]);

  const copyContent = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showCopyToast('提示词');
    setTimeout(() => setCopied(false), 2000);
    success();
  }, [content, success]);

  const exportMarkdown = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skillName}-prompt-v${versions.length}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'success',
      message: '已导出 Markdown 文件'
    });
    success();
  }, [content, skillName, versions.length, success]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const characters = content.length;
  const words = content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit className="w-6 h-6 text-indigo-500" />
              提示词编辑器
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              支持 Markdown 语法，实时预览，版本历史
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
              {characters} 字符 · {words} 词
            </span>
            {isModified && (
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full font-medium">
                未保存
              </span>
            )}
            <button
              onClick={copyContent}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="复制"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-xl transition-colors ${
                showHistory
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
              }`}
              title="版本历史"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={saveVersion}
              disabled={!isModified}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isModified
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              保存版本
            </button>
          </div>
        </div>

        <div className="flex gap-1 mt-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit">
          {[
            { id: 'edit' as const, label: '编辑', icon: Edit },
            { id: 'split' as const, label: '分屏', icon: Edit },
            { id: 'preview' as const, label: '预览', icon: Eye },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === tab.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="absolute top-0 right-0 bottom-0 z-20 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  版本历史 ({versions.length})
                </h4>
              </div>
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {versions.slice().reverse().map((version, index) => (
                  <button
                    key={version.id}
                    onClick={() => revertToVersion(version)}
                    className="w-full p-3 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {version.message}
                      </span>
                      <RotateCcw className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{version.author}</span>
                      <span>·</span>
                      <span>{formatTime(version.timestamp)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid ${
          mode === 'split' ? 'md:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700' : 'grid-cols-1'
        }`}>
          {(mode === 'edit' || mode === 'split') && (
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此输入提示词，支持 Markdown..."
                className="w-full min-h-[500px] p-6 bg-gray-50 dark:bg-gray-900 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200 resize-none focus:outline-none placeholder-gray-400"
                spellCheck={false}
              />
              <div className="absolute top-4 right-4 text-xs text-gray-400 font-mono">
                Markdown
              </div>
            </div>
          )}

          {(mode === 'preview' || mode === 'split') && (
            <div className="min-h-[500px] p-6 overflow-y-auto max-h-[600px]">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
            ✓ Markdown 支持
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
            ✓ 实时预览
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg">
            ✓ 版本历史
          </span>
        </div>
        <button
          onClick={exportMarkdown}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
        >
          导出 .md 文件
        </button>
      </div>
    </div>
  );
}
