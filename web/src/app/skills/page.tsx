'use client';

import { Suspense } from 'react';
import SkillsContent from './SkillsContent';

export default function SkillsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">加载中...</p>
        </div>
      </div>
    }>
      <SkillsContent />
    </Suspense>
  );
}
