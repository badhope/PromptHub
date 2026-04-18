'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, Brain, Rocket } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';

const useTypewriter = (text: string, speed: number = 60, startDelay: number = 300) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const startTimer = setTimeout(() => {
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);
      return () => clearInterval(timer);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
};

const useCounter = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return { count, countRef };
};

const Cursor = () => {
  return (
    <span className="inline-block w-1.5 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-indigo-500 to-purple-500 ml-1.5 align-middle rounded-full" style={{ animation: 'blink 1s step-end infinite' }} />
  );
};

const StatCard = ({ value, suffix, label, icon, color }: { value: number; suffix?: string; label: string; icon: string; color: string }) => {
  const { count, countRef } = useCounter(value);
  
  return (
    <motion.div
      ref={countRef}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group p-5 sm:p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
    >
      <div className={`absolute top-3 right-3 w-10 h-10 ${color} rounded-xl flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1">
        {count}{suffix}
        <span className="text-indigo-500">+</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) => {
  const { selection } = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => selection()}
      className="group p-6 sm:p-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

const MouseFollower = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
      <>
        <motion.div
          className="fixed w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 rounded-full pointer-events-none z-0 blur-3xl"
          style={{
            x: useTransform(springX, (x) => x - 250),
            y: useTransform(springY, (y) => y - 250),
          }}
        />
        <motion.div
          className="fixed w-[300px] h-[300px] bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-full pointer-events-none z-0 blur-3xl"
          style={{
            x: useTransform(springX, (x) => x - 150 + 100),
            y: useTransform(springY, (y) => y - 150 + 100),
          }}
        />
      </>
    );
  };

  const FloatingOrbs = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
    const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      rotateX.set(((y - centerY) / centerY) * -5);
      rotateY.set(((x - centerX) / centerX) * 5);
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  export default function HomePage() {
  const { displayText, isComplete } = useTypewriter('Mobile Skills');
  const { success } = useHapticFeedback();

  const features = [
    {
      icon: <Brain className="w-7 h-7 text-indigo-500" />,
      title: '五层Agent架构',
      desc: '感知-记忆-决策-执行-反思，完整的智能体工作流',
    },
    {
      icon: <Zap className="w-7 h-7 text-amber-500" />,
      title: '一键复制即用',
      desc: '精选462+个专业角色，复制粘贴直接使用',
    },
    {
      icon: <Shield className="w-7 h-7 text-emerald-500" />,
      title: '专业提示词',
      desc: '每个角色经过精心打磨，输出质量有保障',
    },
    {
      icon: <Rocket className="w-7 h-7 text-rose-500" />,
      title: '持续更新',
      desc: '每周新增高质量技能，紧跟AI发展潮流',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-black dark:via-gray-900 dark:to-indigo-950/20">
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <MouseFollower />
      <FloatingOrbs />

      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-500/20 mb-6 sm:mb-8"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                462 个专业智能体已上线
              </span>
            </motion.div>

            <TiltCard className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight" style={{ transform: 'translateZ(50px)' }}>
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center h-10 sm:h-12 md:h-16 drop-shadow-sm">
                  {displayText}
                  {!isComplete && <Cursor />}
                </span>
                {isComplete && (
                  <span className="block mt-2">
                    智能体聚合平台
                  </span>
                )}
              </h1>
            </TiltCard>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            >
              专业的 AI 角色技能库，让你的 ChatGPT、Claude、文心一言
              <br className="hidden sm:block" />
              立刻变身行业专家，效率提升 10 倍
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
                <Link
                  href="/skills"
                  onClick={() => success()}
                  className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  开始探索
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/guide"
                  onClick={() => success()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-bold text-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
                >
                  使用指南
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
            <TiltCard>
              <StatCard value={462} label="专业技能" icon="🧠" color="bg-indigo-100 dark:bg-indigo-500/20" />
            </TiltCard>
            <TiltCard>
              <StatCard value={294} label="AI 智能体" icon="✨" color="bg-purple-100 dark:bg-purple-500/20" />
            </TiltCard>
            <TiltCard>
              <StatCard value={168} label="专业工具" icon="🔧" color="bg-amber-100 dark:bg-amber-500/20" />
            </TiltCard>
            <TiltCard>
              <StatCard value={20} label="专业分类" icon="📂" color="bg-emerald-100 dark:bg-emerald-500/20" />
            </TiltCard>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
              为什么选择 Mobile Skills？
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              我们不做数量堆砌，只产出高质量、经过验证的专业提示词
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
