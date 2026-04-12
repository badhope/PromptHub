'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AIToolsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/skills');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-6">🔀</div>
        <h1 className="text-3xl font-bold text-black mb-4">正在跳转...</h1>
        <p className="text-gray-500 mb-6">AI工具库已合并到统一的 AI 探索中心</p>
        <Link 
          href="/skills"
          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          立即前往 →
        </Link>
      </div>
    </div>
  );
}
