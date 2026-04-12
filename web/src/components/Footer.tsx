import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Mobile Skills</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              AI Skill 生态系统，提供丰富的 AI 角色和技能，让 AI 变得更有用、更有趣。
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Mobile Skills. MIT License.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              🔗 快速链接
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  技能探索
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  高级搜索
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  技能对比
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  我的收藏
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  使用指南
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/badhope/mobile-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              📂 技能分类
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/category/functional" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span>🛠️</span>
                  功能型
                </Link>
              </li>
              <li>
                <Link href="/category/professional" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span>💼</span>
                  专业型
                </Link>
              </li>
              <li>
                <Link href="/category/creative" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span>🎨</span>
                  创意型
                </Link>
              </li>
              <li>
                <Link href="/category/character" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span>🎭</span>
                  角色型
                </Link>
              </li>
              <li>
                <Link href="/category/fiction" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span>📖</span>
                  虚构世界
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <p className="flex items-center gap-2">
              Made with ❤️ and AI
            </p>
            <div className="flex items-center gap-4">
              <Link href="/sitemap.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sitemap</Link>
              <span>|</span>
              <Link href="/robots.txt" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Robots</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
