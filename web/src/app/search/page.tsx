'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/skills');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-black mb-2">正在跳转...</h2>
        <p className="text-gray-500">技能分类与搜索已合并为技能探索中心</p>
      </div>
    </div>
  );
}
