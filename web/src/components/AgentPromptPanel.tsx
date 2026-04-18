'use client';

import { useState } from 'react';
import { Copy, Check, Layers, Eye, Download, ChevronDown, ChevronRight, Code, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { AGENT_ARCHITECTURE_LAYERS, generateLayeredSystemPrompt } from '@/lib/agent-architecture';
import { showCopyToast } from '@/components/ToastProvider';
import { useHapticFeedback } from '@/hooks/useGestures';
import PromptEditor from './PromptEditor';

interface AgentPromptPanelProps {
  skillName: string;
  basePrompt: string;
}

type TabType = 'prompt' | 'editor' | 'architecture' | 'layers';

export default function AgentPromptPanel({ skillName, basePrompt }: AgentPromptPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('prompt');
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(['reasoning']));
  const [copied, setCopied] = useState(false);
  const { success } = useHapticFeedback();

  const fullPrompt = generateLayeredSystemPrompt(basePrompt, skillName);

  const copyFullPrompt = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    showCopyToast('完整五层架构提示词');
    setTimeout(() => setCopied(false), 2000);
    success();
  };

  const copyLayerCode = (layerId: string) => {
    const layer = AGENT_ARCHITECTURE_LAYERS.find(l => l.id === layerId);
    if (layer) {
      navigator.clipboard.writeText(layer.implementation);
      showCopyToast(`${layer.name}实现规范`);
      success();
    }
  };

  const toggleLayer = (layerId: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const tabs = [
    { id: 'prompt' as TabType, label: '完整提示词', icon: Code },
    { id: 'editor' as TabType, label: '在线编辑', icon: Pencil },
    { id: 'architecture' as TabType, label: '架构总览', icon: Layers },
    { id: 'layers' as TabType, label: '分层详解', icon: Eye },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Layers className="w-8 h-8" />
              Agent 五层架构系统
            </h3>
            <p className="text-white/80 mt-1">
              按照业界标准构建：感知 → 记忆 → 决策 → 执行 → 反思 完整闭环
            </p>
          </div>
          <button
            onClick={copyFullPrompt}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? '已复制' : '一键复制'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  完整提示词共 {fullPrompt.length} 字符，包含 5 层架构执行规范
                </span>
                <button
                  onClick={() => {
                    const blob = new Blob([fullPrompt], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${skillName}-agent-prompt.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                    success();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  导出 Markdown
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{fullPrompt}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PromptEditor
                initialContent={fullPrompt}
                skillName={skillName}
                onSave={(content) => {
                  console.log('Prompt saved:', content.length);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="relative">
                {AGENT_ARCHITECTURE_LAYERS.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative mb-4"
                  >
                    <div className={`p-5 rounded-2xl bg-gradient-to-r ${
                      index === 0 ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800' :
                      index === 1 ? 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800' :
                      index === 2 ? 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800' :
                      index === 3 ? 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800' :
                      'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                    } border`}>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{layer.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full text-gray-500">
                              第 {index + 1} 层
                            </span>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                              {layer.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {layer.purpose}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {layer.keyComponents.slice(0, 3).map((comp, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                                {comp.split('：')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < AGENT_ARCHITECTURE_LAYERS.length - 1 && (
                      <div className="absolute left-8 -bottom-3 w-0.5 h-3 bg-gray-300 dark:bg-gray-600" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'layers' && (
            <motion.div
              key="layers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {AGENT_ARCHITECTURE_LAYERS.map((layer, index) => (
                <div
                  key={layer.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{layer.icon}</span>
                      <div className="text-left">
                        <span className="font-bold text-gray-900 dark:text-white">
                          第 {index + 1} 层 - {layer.name}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {layer.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLayerCode(layer.id);
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      {expandedLayers.has(layer.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedLayers.has(layer.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                          <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <div className="prose dark:prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{layer.implementation}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
