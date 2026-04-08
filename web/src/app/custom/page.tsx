'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useI18nContext } from '@/components/I18nProvider';

const LazyBackground = dynamic(() => import('@/components/AnimatedBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
});

interface CustomSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  skills: CustomSkill[];
}

const COLOR_OPTIONS = [
  { value: 'blue', label: '蓝色', gradient: 'from-blue-400 to-blue-600' },
  { value: 'green', label: '绿色', gradient: 'from-green-400 to-green-600' },
  { value: 'purple', label: '紫色', gradient: 'from-purple-400 to-purple-600' },
  { value: 'pink', label: '粉色', gradient: 'from-pink-400 to-pink-600' },
  { value: 'orange', label: '橙色', gradient: 'from-orange-400 to-orange-600' },
  { value: 'cyan', label: '青色', gradient: 'from-cyan-400 to-cyan-600' }
] as const;

const ICON_OPTIONS = ['📁', '🎨', '💻', '📚', '🎮', '🔧', '💼', '🎯', '⚡', '🌟', '🎪', '🎭'] as const;

function getInitialCategories(): CustomCategory[] {
  if (typeof window === 'undefined') return [];
  const savedCategories = localStorage.getItem('customCategories');
  return savedCategories ? JSON.parse(savedCategories) : [];
}

export default function CustomSkillsPage() {
  const { language } = useI18nContext();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<CustomCategory[]>(getInitialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '📁', color: 'blue' });
  const [newSkill, setNewSkill] = useState({ name: '', description: '', category: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('customCategories', JSON.stringify(categories));
    }
  }, [categories]);

  const addCategory = useCallback(() => {
    if (!newCategory.name.trim()) return;
    
    const category: CustomCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      skills: []
    };
    
    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', icon: '📁', color: 'blue' });
    setShowAddCategory(false);
  }, [newCategory]);

  const addSkill = useCallback(() => {
    if (!newSkill.name.trim() || !newSkill.category) return;
    
    const skill: CustomSkill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      category: newSkill.category,
      createdAt: new Date().toISOString()
    };
    
    setCategories(prev => prev.map(cat => 
      cat.id === newSkill.category 
        ? { ...cat, skills: [...cat.skills, skill] }
        : cat
    ));
    
    setNewSkill({ name: '', description: '', category: '' });
    setShowAddSkill(false);
  }, [newSkill]);

  const deleteCategory = useCallback((categoryId: string) => {
    if (confirm(language === 'zh-CN' ? '确定要删除这个分类吗？' : 'Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setSelectedCategory(prev => prev === categoryId ? null : prev);
    }
  }, [language]);

  const deleteSkill = useCallback((categoryId: string, skillId: string) => {
    if (confirm(language === 'zh-CN' ? '确定要删除这个技能吗？' : 'Are you sure you want to delete this skill?')) {
      setCategories(prev => prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter(skill => skill.id !== skillId) }
          : cat
      ));
    }
  }, [language]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LazyBackground />
      
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              href="/categories" 
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'zh-CN' ? '返回分类导航' : 'Back to Categories'}
            </Link>
            
            <div 
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {language === 'zh-CN' ? '自定义技能管理' : 'Custom Skills Manager'}
              </h1>
              <p className="text-lg sm:text-xl text-white/95 font-medium max-w-2xl">
                {language === 'zh-CN' 
                  ? '创建和管理您的专属技能分类，打造个性化的AI助手库'
                  : 'Create and manage your own skill categories, build a personalized AI assistant library'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div 
            className={`mb-8 flex flex-col sm:flex-row gap-4 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-xl font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-white/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{language === 'zh-CN' ? '添加新分类' : 'Add New Category'}</span>
              </div>
            </button>
            
            {categories.length > 0 && (
              <button
                onClick={() => {
                  setNewSkill({ ...newSkill, category: selectedCategory || categories[0].id });
                  setShowAddSkill(true);
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-xl font-semibold hover:from-purple-500/30 hover:to-pink-500/30 hover:border-white/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{language === 'zh-CN' ? '添加新技能' : 'Add New Skill'}</span>
                </div>
              </button>
            )}
          </div>

          {showAddCategory && (
            <div 
              className={`mb-8 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {language === 'zh-CN' ? '创建新分类' : 'Create New Category'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '分类名称' : 'Category Name'}
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder={language === 'zh-CN' ? '输入分类名称' : 'Enter category name'}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '选择图标' : 'Select Icon'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewCategory({ ...newCategory, icon })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                          newCategory.icon === icon 
                            ? 'bg-white/30 border-2 border-white' 
                            : 'bg-white/10 border border-white/30 hover:bg-white/20'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '选择颜色' : 'Select Color'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                        className={`px-4 py-2 rounded-lg bg-gradient-to-r ${color.gradient} transition-all ${
                          newCategory.color === color.value 
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={addCategory}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    {language === 'zh-CN' ? '创建分类' : 'Create Category'}
                  </button>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    {language === 'zh-CN' ? '取消' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddSkill && (
            <div 
              className={`mb-8 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {language === 'zh-CN' ? '添加新技能' : 'Add New Skill'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '技能名称' : 'Skill Name'}
                  </label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder={language === 'zh-CN' ? '输入技能名称' : 'Enter skill name'}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '技能描述' : 'Skill Description'}
                  </label>
                  <textarea
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    placeholder={language === 'zh-CN' ? '输入技能描述' : 'Enter skill description'}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/50 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    {language === 'zh-CN' ? '选择分类' : 'Select Category'}
                  </label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="" className="bg-gray-800">
                      {language === 'zh-CN' ? '选择分类' : 'Select Category'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-gray-800">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={addSkill}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    {language === 'zh-CN' ? '添加技能' : 'Add Skill'}
                  </button>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    {language === 'zh-CN' ? '取消' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {categories.length === 0 ? (
            <div 
              className={`bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-12 text-center transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                📁
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'zh-CN' ? '还没有自定义分类' : 'No Custom Categories Yet'}
              </h3>
              <p className="text-white/80 font-medium mb-6">
                {language === 'zh-CN' 
                  ? '点击上方"添加新分类"按钮开始创建您的专属技能库'
                  : 'Click the "Add New Category" button above to start building your custom skill library'}
              </p>
            </div>
          ) : (
            <div 
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {categories.map(category => {
                  const colorOption = COLOR_OPTIONS.find(c => c.value === category.color);
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`relative w-full p-6 rounded-2xl transition-all duration-300 cursor-pointer
                        backdrop-blur-xl border-2 text-left min-h-[160px]
                        ${selectedCategory === category.id 
                          ? 'bg-white/25 border-white/50 shadow-2xl scale-105' 
                          : 'bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40 hover:shadow-xl'
                        }`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                          bg-gradient-to-br ${colorOption?.gradient || 'from-blue-400 to-blue-600'} shadow-lg`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {category.skills.length} {language === 'zh-CN' ? '个技能' : 'skills'}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(category.id);
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/40 transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button>
                  );
                })}
              </div>

              {selectedCategory && (
                <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {categories.find(c => c.id === selectedCategory)?.name} - {language === 'zh-CN' ? '技能列表' : 'Skills List'}
                    </h3>
                    <button
                      onClick={() => {
                        setNewSkill({ ...newSkill, category: selectedCategory });
                        setShowAddSkill(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      {language === 'zh-CN' ? '添加技能' : 'Add Skill'}
                    </button>
                  </div>
                  
                  {categories.find(c => c.id === selectedCategory)?.skills.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        {language === 'zh-CN' ? '该分类下还没有技能' : 'No skills in this category yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.find(c => c.id === selectedCategory)?.skills.map(skill => (
                        <div
                          key={skill.id}
                          className="flex items-start justify-between p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all"
                        >
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{skill.name}</h4>
                            <p className="text-sm text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{skill.description}</p>
                            <p className="text-xs text-white font-medium mt-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                              {language === 'zh-CN' ? '创建于' : 'Created at'}: {new Date(skill.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteSkill(selectedCategory, skill.id)}
                            className="ml-4 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/40 transition-colors"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
