'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { usePreferences } from '@/hooks/usePreferences';
import { useNotifications } from '@/hooks/useNotifications';
import { useI18nContext } from '@/components/I18nProvider';

const ITEMS_PER_PAGE_OPTIONS = [12, 20, 32, 48] as const;

export default function SettingsPage() {
  const { t, language, changeLanguage } = useI18nContext();
  const {
    preferences,
    isLoaded,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences
  } = usePreferences();

  const {
    isSupported: notificationSupported,
    permission: notificationPermission,
    requestPermission: requestNotificationPermission,
    toggleEnabled: toggleNotifications
  } = useNotifications();

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
  }, []);

  const THEME_OPTIONS = useMemo(() => [
    { value: 'light' as const, label: t('settings.lightMode'), icon: '☀️', description: t('settings.lightDesc') },
    { value: 'dark' as const, label: t('settings.darkMode'), icon: '🌙', description: t('settings.darkDesc') },
    { value: 'system' as const, label: t('settings.systemMode'), icon: '💻', description: t('settings.systemDesc') }
  ], [t]);

  const LANGUAGE_OPTIONS = useMemo(() => [
    { value: 'zh-CN' as const, label: '简体中文', flag: '🇨🇳' },
    { value: 'en-US' as const, label: 'English', flag: '🇺🇸' }
  ], []);

  const SORT_OPTIONS = useMemo(() => [
    { value: 'popular' as const, label: t('settings.sortPopular'), icon: '🔥' },
    { value: 'newest' as const, label: t('settings.sortNewest'), icon: '🆕' },
    { value: 'rating' as const, label: t('settings.sortRating'), icon: '⭐' },
    { value: 'name' as const, label: t('settings.sortName'), icon: '🔤' }
  ], [t]);

  const VIEW_OPTIONS = useMemo(() => [
    { value: 'grid' as const, label: t('settings.gridView'), icon: '⊞' },
    { value: 'list' as const, label: t('settings.listView'), icon: '☰' }
  ], [t]);

  const handleExportSettings = useCallback(() => {
    try {
      const data = exportPreferences();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mobile-skills-preferences-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', t('settings.importSuccess'));
    } catch {
      showToast('error', language === 'zh-CN' ? '导出失败，请重试' : 'Export failed, please try again');
    }
  }, [exportPreferences, showToast, t, language]);

  const handleImportSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        showToast('error', language === 'zh-CN' ? '文件内容为空' : 'File content is empty');
        return;
      }

      const success = importPreferences(content);
      if (success) {
        showToast('success', t('settings.importSuccess'));
      } else {
        showToast('error', t('settings.importFail'));
      }
      
      event.target.value = '';
    };
    reader.onerror = () => {
      showToast('error', language === 'zh-CN' ? '读取文件失败，请重试' : 'Failed to read file, please try again');
    };
    reader.readAsText(file);
  }, [importPreferences, showToast, t, language]);

  const handleResetSettings = useCallback(() => {
    resetPreferences();
    setIsResetConfirmOpen(false);
    showToast('success', language === 'zh-CN' ? '设置已重置为默认值' : 'Settings have been reset to default');
  }, [resetPreferences, showToast, language]);

  const handleToggleNotifications = useCallback((enabled: boolean) => {
    toggleNotifications(enabled);
    updatePreference('showNotifications', enabled);
    
    if (enabled && notificationPermission === 'default') {
      requestNotificationPermission().then(granted => {
        if (granted) {
          showToast('success', language === 'zh-CN' ? '通知权限已启用！您将收到重要更新提醒' : 'Notifications enabled! You will receive important updates');
        } else {
          showToast('error', language === 'zh-CN' ? '通知权限被拒绝，请在浏览器设置中手动开启' : 'Notification permission denied, please enable it in browser settings');
          updatePreference('showNotifications', false);
        }
      });
    } else if (enabled && notificationPermission === 'denied') {
      showToast('error', language === 'zh-CN' ? '浏览器通知权限已被阻止，请手动开启' : 'Browser notification permission is blocked, please enable it manually');
      updatePreference('showNotifications', false);
    } else if (!enabled) {
      showToast('success', language === 'zh-CN' ? '通知已关闭' : 'Notifications disabled');
    }
  }, [toggleNotifications, updatePreference, notificationPermission, requestNotificationPermission, showToast, language]);

  const handleToggleAutoSave = useCallback(() => {
    const newValue = !preferences.autoSaveSearch;
    updatePreference('autoSaveSearch', newValue);
    showToast('success', newValue 
      ? (language === 'zh-CN' ? '自动保存已开启' : 'Auto-save enabled')
      : (language === 'zh-CN' ? '自动保存已关闭' : 'Auto-save disabled')
    );
  }, [preferences.autoSaveSearch, updatePreference, showToast, language]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t('nav.home'), href: '/' },
            { label: t('settings.title') }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-4xl sm:text-5xl">⚙️</span>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">{t('settings.title')}</h1>
              <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">{t('settings.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {toastMessage && (
          <div className={`mb-6 p-4 rounded-lg border animate-fade-in flex items-center gap-3 ${
            toastMessage.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
          }`}>
            {toastMessage.type === 'success' ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* 外观设置 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎨</span> {t('settings.appearance')}
              <span className="ml-auto text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                ✨ {language === 'zh-CN' ? '实时生效' : 'Live'}
              </span>
            </h2>
            
            <div className="space-y-6">
              {/* 主题模式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings.themeMode')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {THEME_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('theme', option.value)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left group ${
                        preferences.theme === option.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{option.icon}</span>
                        <div>
                          <div className={`font-medium text-sm sm:text-base ${preferences.theme === option.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  {language === 'zh-CN' ? '当前主题：' : 'Current theme: '}
                  <strong>{THEME_OPTIONS.find(o => o.value === preferences.theme)?.label}</strong>
                </p>
              </div>

              {/* 界面语言 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings.language')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {LANGUAGE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => changeLanguage(option.value)}
                      className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        language === option.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{option.flag}</span>
                      <span className={`font-medium text-sm sm:text-base ${language === option.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '切换语言后，界面文本将立即更新' : 'Interface text will update immediately after switching language'}
                </p>
              </div>
            </div>
          </div>

          {/* 搜索与浏览 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🔍</span> {t('settings.searchBrowse')}
              <span className="ml-auto text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {language === 'zh-CN' ? '影响技能列表和搜索页' : 'Affects skill list & search'}
              </span>
            </h2>
            
            <div className="space-y-6">
              {/* 默认排序方式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings.defaultSort')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('defaultSort', option.value)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                        preferences.defaultSort === option.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{option.icon}</span>
                      <span className={`font-medium text-xs sm:text-sm ${preferences.defaultSort === option.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 默认视图模式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings.defaultView')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {VIEW_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('defaultView', option.value)}
                      className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        preferences.defaultView === option.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{option.icon}</span>
                      <span className={`font-medium text-sm sm:text-base ${preferences.defaultView === option.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 每页显示数量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings.itemsPerPage')}：<strong className="text-emerald-600 dark:text-emerald-400">{preferences.itemsPerPage}</strong>
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {ITEMS_PER_PAGE_OPTIONS.map(count => (
                    <button
                      key={count}
                      onClick={() => updatePreference('itemsPerPage', count)}
                      className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg border-2 transition-all font-medium text-sm sm:text-base ${
                        preferences.itemsPerPage === count
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 通知与存储 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🔔</span> {t('settings.notificationsStorage')}
            </h2>
            
            <div className="space-y-4">
              {/* 显示通知 */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('settings.showNotifications')}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.showNotificationsDesc')}
                    {!notificationSupported && (
                      <span className="ml-2 text-orange-500">({language === 'zh-CN' ? '您的浏览器不支持通知' : 'Your browser does not support notifications'})</span>
                    )}
                    {notificationPermission === 'denied' && (
                      <span className="ml-2 text-red-500">({language === 'zh-CN' ? '权限已被阻止' : 'Permission blocked'})</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotifications(!preferences.showNotifications)}
                  disabled={!notificationSupported}
                  className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors flex-shrink-0 ml-3 ${!notificationSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                    preferences.showNotifications ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.showNotifications ? 'left-6 sm:left-8' : 'left-0.5 sm:left-1'
                    }`}
                  />
                </button>
              </div>

              {/* 自动保存搜索 */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('settings.autoSaveSearch')}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.autoSaveSearchDesc')}
                  </div>
                </div>
                <button
                  onClick={handleToggleAutoSave}
                  className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ml-3 ${
                    preferences.autoSaveSearch ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.autoSaveSearch ? 'left-6 sm:left-8' : 'left-0.5 sm:left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📦</span> {t('settings.dataManagement')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleExportSettings}
                className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg font-medium hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t('settings.exportSettings')}
              </button>
              
              <label className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg font-medium hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('settings.importSettings')}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-medium hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/50 dark:hover:to-orange-900/50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('settings.resetToDefault')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 重置确认对话框 */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('settings.confirmReset')}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                {t('settings.cancel')}
              </button>
              <button
                onClick={handleResetSettings}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                {language === 'zh-CN' ? '确认重置' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
