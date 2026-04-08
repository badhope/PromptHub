'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SkillsContent = dynamic(() => import('./SkillsContent'), {
  loading: () => (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mb-6"></div>
          <p className="text-white/80 text-xl font-medium">加载中...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export default function SkillsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mb-6"></div>
            <p className="text-white/80 text-xl font-medium">加载中...</p>
          </div>
        </div>
      </div>
    }>
      <SkillsContent />
    </Suspense>
  );
}
