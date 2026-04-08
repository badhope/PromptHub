import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: '使用指南 - Mobile Skills',
  description: '了解如何使用 Mobile Skills 激活 AI Skill',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '使用指南' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl" role="img" aria-label="书本">📖</span>
            <div>
              <h1 className="text-4xl font-bold">使用指南</h1>
              <p className="text-white/80 mt-2">快速上手 Mobile Skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="火箭">🚀</span> 快速开始</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">浏览技能</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  在 <Link href="/skills" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">技能列表</Link> 页面浏览所有可用的 AI Skill。您可以使用搜索、分类筛选和排序功能快速找到需要的技能。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">查看详情</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  点击技能卡片进入详情页，查看技能的完整描述、使用场景、激活方式等信息。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">激活技能</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  在详情页点击&ldquo;复制激活指令&rdquo;按钮，然后将复制的指令发送给 AI 助手即可激活该技能。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="灯泡">💡</span> 激活方式</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">方式一：快速激活</h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-indigo-600 dark:text-indigo-400">
                  请访问以下链接并激活技能：[Raw URL]
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                最简单的激活方式，只需复制指令发送给 AI 即可。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">方式二：手动激活</h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-indigo-600 dark:text-indigo-400">
                  请阅读以下技能定义并激活：{'\n'}
                  [技能内容]
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                适用于需要自定义修改技能内容的场景。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="文件夹">📁</span> 技能分类</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/skills/functional" className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="工具">🛠️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">功能型</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">实用工具类技能</p>
                </div>
              </div>
            </Link>
            <Link href="/skills/professional" className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="公文包">💼</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">专业型</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">专业领域技能</p>
                </div>
              </div>
            </Link>
            <Link href="/skills/creative" className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="调色板">🎨</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">创意型</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">创意内容生成</p>
                </div>
              </div>
            </Link>
            <Link href="/skills/character" className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="面具">🎭</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">角色型</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">角色扮演技能</p>
                </div>
              </div>
            </Link>
            <Link href="/skills/fiction" className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="书本">📖</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">虚构世界</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">虚构世界构建技能</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="问号">❓</span> 常见问题</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white">技能激活后如何使用？</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-gray-600 dark:text-gray-400">
                激活技能后，AI 会进入该技能的角色或模式。您可以直接与 AI 进行对话，它会按照技能定义的方式回应您。
              </p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white">如何切换不同的技能？</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-gray-600 dark:text-gray-400">
                您可以随时激活新的技能来切换。新的技能会覆盖之前的技能设置。
              </p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white">收藏的技能保存在哪里？</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-gray-600 dark:text-gray-400">
                收藏的技能保存在您的浏览器本地存储中。清除浏览器数据会导致收藏丢失。
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
