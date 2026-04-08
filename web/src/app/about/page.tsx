import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: '关于我们 - Mobile Skills',
  description: '了解 Mobile Skills 项目，AI Skill 生态系统的构建者',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '关于我们' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl" role="img" aria-label="火箭">🚀</span>
            <div>
              <h1 className="text-4xl font-bold">关于 Mobile Skills</h1>
              <p className="text-white/80 mt-2">AI Skill 生态系统的构建者</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="目标">🎯</span> 我们的使命</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Mobile Skills 致力于构建一个开放、易用的 AI Skill 生态系统。我们相信，通过标准化的技能定义和便捷的激活方式，每个人都能更好地利用 AI 的能力，让 AI 变得更有用、更有趣。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="闪亮">✨</span> 核心特性</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3">
                <span className="text-2xl" role="img" aria-label="链接">🔗</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Raw 链接激活</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  通过 Raw 链接直接激活 AI Skill，无需复杂配置
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 dark:bg-pink-900 rounded-lg p-3">
                <span className="text-2xl" role="img" aria-label="手机">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">跨平台支持</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  支持多种 AI 平台和设备，随时随地使用
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-cyan-100 dark:bg-cyan-900 rounded-lg p-3">
                <span className="text-2xl" role="img" aria-label="拼图">🧩</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">丰富分类</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  功能型、专业型、创意型、角色型、虚构世界五大分类
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                <span className="text-2xl" role="img" aria-label="地球">🌐</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">开源免费</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  MIT 许可证，完全开源，社区驱动发展
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="图表">📊</span> 项目统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">131+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">技能数量</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">5</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">分类</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">100%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">开源</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">MIT</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">许可证</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"><span role="img" aria-label="握手">🤝</span> 参与贡献</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            我们欢迎所有形式的贡献！无论是提交新技能、改进现有技能、修复 Bug 还是完善文档，您的参与都将让这个项目变得更好。
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/badhope/mobile-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub 仓库
            </a>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              使用指南
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
