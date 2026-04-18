'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Key, ArrowRight, Zap, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { MODEL_PROVIDERS } from '@/lib/agent-architecture';
import { useState } from 'react';

export default function ModelsPage() {
  const [_selectedProvider, _setSelectedProvider] = useState<string | null>(null);

  void _selectedProvider;
  void _setSelectedProvider;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            多模型生态接入
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            模型接入中心
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            一个平台，接入所有主流大模型。提供你的 API 密钥，立即使用任何智能体。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {MODEL_PROVIDERS.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => window.open(provider.url, '_blank')}
              className="group cursor-pointer"
            >
              <div className={`h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border-2 border-transparent hover:border-indigo-500/50 transition-all`}>
                <div className={`p-6 bg-gradient-to-r ${provider.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-5xl">{provider.icon}</div>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-4">
                    {provider.name}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {provider.description}
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">支持模型</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.models.map((model, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Key className="w-4 h-4" />
                      需配置 API Key
                    </div>
                    <Link
                      href="/settings"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:gap-2 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      去配置
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7 text-indigo-500" />
            安全与隐私承诺
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">本地密钥存储</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                所有 API 密钥仅存储在你的浏览器 LocalStorage 中，我们的服务器不保存任何密钥。
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">直接官方调用</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                所有请求直接发送到对应模型厂商的官方 API，不经过任何第三方中转。
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">纯前端运行</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                完全在浏览器端运行，无后端依赖，开源透明，任何人都可以审计代码。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
