'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useGestures';
import { Users, X, Play, Pause } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const idCounter = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const { success } = useHapticFeedback();

  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 1);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const addBarrage = useCallback(() => {
    if (isPaused) return;
    
    const newBarrage = generateBarrage(idCounter.current++);
    setBarrages(prev => {
      const updated = [newBarrage, ...prev].slice(0, 50);
      return updated;
    });
  }, [isPaused]);

  useEffect(() => {
    if (!hasMounted) return;

    for (let i = 0; i < 5; i++) {
      const timeout = setTimeout(() => {
        addBarrage();
      }, i * 200);
      timeoutsRef.current.push(timeout);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.3) {
        addBarrage();
      }
    }, 4000 + Math.random() * 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [addBarrage, hasMounted]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
    success();
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
    success();
  };

  if (!hasMounted) return null;

  const displayBarrages = barrages.slice(0, 5);

  return (
    <>
      <div className="fixed bottom-[88px] right-3 sm:bottom-24 sm:right-4 z-40">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="absolute bottom-12 right-0 w-[85vw] sm:w-72 max-w-sm"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span className="font-bold text-sm">实时动态</span>
                    <span className="text-xs opacity-80">{barrages.length}条</span>
                  </div>
                  <button
                    onClick={toggleExpand}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {displayBarrages.map((barrage) => (
                    <motion.div
                      key={barrage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-lg">{barrage.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{barrage.userName}</span>
                          {' '}{barrage.activity}
                          <span className="text-purple-600 dark:text-purple-400">{barrage.skillName}</span>
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {formatTimeAgo(barrage.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <motion.button
            onClick={toggleExpand}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl flex items-center justify-center text-white border-2 border-white/50"
          >
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            {!isPaused && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </motion.button>
          
          <motion.button
            onClick={togglePause}
            className="absolute -top-0.5 -left-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 dark:bg-gray-700 shadow flex items-center justify-center hover:scale-110 transition-transform"
            title={isPaused ? '开启弹幕' : '暂停弹幕'}
          >
            {isPaused ? (
              <Play className="w-3 h-3 text-emerald-500 ml-0.5" />
            ) : (
              <Pause className="w-3 h-3 text-amber-500" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
