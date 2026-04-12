'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';
import Button from '@/components/Button';

export default function NotFound() {
  const { success } = useHapticFeedback();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-black dark:via-gray-900 dark:to-indigo-950/20 flex items-center justify-center">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(2deg); }
          75% { transform: translateY(5px) rotate(-2deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-500/15 to-pink-500/15 rounded-full blur-3xl"
          style={{ animation: 'float 10s ease-in-out infinite reverse' }}
        />
      </div>

      <div className="relative text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div 
              className="text-[120px] sm:text-[150px] leading-none font-black"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>
            
            <motion.div 
              className="absolute -top-2 -right-4 text-5xl sm:text-6xl"
              style={{ animation: 'blink 3s infinite' }}
            >
              😵
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4"
        >
          页面飞到外太空了！
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed"
        >
          这个页面可能被 AI 吃掉了，或者链接输入错误。
          别担心，让我们回到安全的地方！
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/" onClick={() => success()}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Home className="w-5 h-5" />}
            >
              返回首页
            </Button>
          </Link>
          
          <Link href="/skills" onClick={() => success()}>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              浏览技能库
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<RefreshCw className="w-5 h-5" />}
            onClick={() => {
              success();
              window.location.reload();
            }}
          >
            重新加载
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
