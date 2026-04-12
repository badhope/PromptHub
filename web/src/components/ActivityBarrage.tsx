'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useGestures';

const USER_AVATARS = ['🧑‍💻', '👩‍🎨', '🧙‍♂️', '👨‍🚀', '👩‍🔬', '🧑‍🎤', '👨‍🍳', '👩‍💼', '🧑‍🔧', '👨‍🎓', '👩‍🦰', '🧔', '👱‍♀️', '🧑‍🦱', '👨‍🦰', '👩‍🦱', '🧝', '🧛', '🧜', '🧚'];
const USER_NAMES = ['小明', '小红', '阿杰', '莉莉', '老王', '小雨', '大雄', '静香', '胖虎', '小夫', '皮卡丘', '程序员小王', '设计师小李', '产品经理小张', '运营小妹', '测试大哥', '咖啡续命', '熬夜选手', '摸鱼大师', '卷王本王'];

const ACTIVITY_TEMPLATES = [
  { type: 'join', text: '刚刚加入了' },
  { type: 'use', text: '正在玩' },
  { type: 'favorite', text: '收藏了' },
  { type: 'share', text: '分享了' },
  { type: 'complete', text: '完成了' },
  { type: 'chat', text: '和' },
];

const POPULAR_SKILLS = [
  '太空狼人杀', '人生重开模拟器', '霸道总裁爱上我', '娱乐圈潜规则', '无限流恐怖游戏',
  '剧本杀·血色古堡', '面试官模拟', '华佗再世', '心理咨询师', '恋爱导师',
  '英语私教', '小红书写手', '段子手', '神回复大师', '毒舌评委',
  '算命先生', '猫主子', '虚拟女友', '虚拟男友', '健身教练'
];

interface Barrage {
  id: number;
  avatar: string;
  userName: string;
  activity: string;
  skillName: string;
  timestamp: number;
}

function generateBarrage(id: number): Barrage {
  const avatar = USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)];
  const userName = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
  const activity = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const skillName = POPULAR_SKILLS[Math.floor(Math.random() * POPULAR_SKILLS.length)];
  
  return {
    id,
    avatar,
    userName,
    activity: activity.text,
    skillName,
    timestamp: Date.now()
  };
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return '刚刚';
  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  return '不久前';
}

export default function ActivityBarrage() {
  const [barrages, setBarrages] = useState<Barrage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const idCounter = useRef(0);
  const { success } = useHapticFeedback();

  const addBarrage = useCallback(() => {
    if (isPaused) return;
    
    const newBarrage = generateBarrage(idCounter.current++);
    setBarrages(prev => {
      const updated = [newBarrage, ...prev].slice(0, 50);
      return updated;
    });
  }, [isPaused]);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        addBarrage();
      }, i * 200);
    }
    
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        addBarrage();
      }
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [addBarrage]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
    success();
  };

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
    success();
  };

  const displayBarrages = showAll ? barrages : barrages.slice(0, 3);

  return (
    <>
      <div className="fixed bottom-24 left-4 z-40 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {displayBarrages.map((barrage, index) => (
            <motion.div
              key={barrage.id}
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ y: index * 52 }}
              onClick={toggleShowAll}
              className="absolute left-0 cursor-pointer"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group hover:scale-105">
                <span className="text-xl">{barrage.avatar}</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 max-w-32 truncate">
                    <span className="text-indigo-600 dark:text-indigo-400">{barrage.userName}</span>
                    {' '}{barrage.activity}
                    <span className="text-purple-600 dark:text-purple-400">{barrage.skillName}</span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatTimeAgo(barrage.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePause}
          className="absolute -right-12 top-0 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
          title={isPaused ? '开启弹幕' : '暂停弹幕'}
        >
          {isPaused ? (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={toggleShowAll}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  🔥 实时动态
                  <span className="ml-auto text-sm font-normal opacity-80">
                    {barrages.length} 条活跃记录
                  </span>
                </h3>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
                {barrages.map(barrage => (
                  <motion.div
                    key={barrage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <span className="text-2xl">{barrage.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{barrage.userName}</span>
                        {' '}{barrage.activity}
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{barrage.skillName}</span>
                      </p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(barrage.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="sticky bottom-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={toggleShowAll}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
