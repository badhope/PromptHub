'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Tag, FileText, FolderOpen, TrendingUp } from 'lucide-react';
import { useAdvancedSearch, type SearchSuggestion } from '@/hooks/useAdvancedSearch';
import type { Skill } from '@/types/skill';
import { useHapticFeedback } from '@/hooks/useGestures';
import TouchButton from './TouchButton';

interface SearchBarProps {
  skills: Skill[];
  onSearch?: (query: string, results: Skill[]) => void;
  placeholder?: string;
  className?: string;
}

const hotKeywords = [
  { text: '写作', icon: '✍️' },
  { text: '编程', icon: '💻' },
  { text: '翻译', icon: '🌐' },
  { text: '设计', icon: '🎨' },
  { text: '职场', icon: '💼' },
];

export default function SearchBar({ 
  skills, 
  onSearch, 
  placeholder = '搜索技能、Agent、工具...',
  className = '' 
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { success, selection } = useHapticFeedback();

  const {
    query,
    setQuery,
    results,
    suggestions,
    addToHistory,
    clearHistory,
    removeFromHistory,
    hasResults,
    resultCount
  } = useAdvancedSearch(skills);

  useEffect(() => {
    if (onSearch) {
      onSearch(query, results);
    }
  }, [query, results, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          addToHistory(query);
          setShowSuggestions(false);
          success();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        selection();
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    addToHistory(suggestion.text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
    success();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    selection();
  };

  const handleHotKeyword = (keyword: string) => {
    setQuery(keyword);
    addToHistory(keyword);
    setShowSuggestions(false);
    success();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'tag':
        return <Tag className="w-4 h-4 text-amber-500" />;
      case 'name':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <FolderOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={inputRef}
        className={`
          relative flex items-center px-4 py-3
          bg-white dark:bg-gray-800/80
          border border-gray-200/60 dark:border-gray-700/60
          rounded-2xl
          transition-all duration-300
          ${showSuggestions 
            ? 'shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-indigo-500/30 dark:border-indigo-500/30' 
            : 'hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
        onClick={() => {
          setShowSuggestions(true);
          inputRef.current?.querySelector('input')?.focus();
        }}
      >
        <motion.div
          animate={{
            scale: showSuggestions ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </motion.div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ml-3"
          aria-label="搜索技能"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        
        <AnimatePresence mode="wait">
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <TouchButton
                onClick={handleClear}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-1"
              >
                <X className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
              </TouchButton>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">⌘K</span>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            id="search-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="absolute top-full left-0 right-0 mt-3 z-50"
          >
            <div className="bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden backdrop-blur-xl">
              {!query && suggestions.length === 0 ? (
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4.5 h-4.5 text-amber-500" />
                    <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotKeywords.map((keyword, index) => (
                      <motion.button
                        key={keyword.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleHotKeyword(keyword.text)}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-[13px] text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center gap-1.5 active:scale-0.95"
                      >
                        <span>{keyword.icon}</span>
                        <span>{keyword.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {resultCount > 0 && (
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700/50">
                      <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                        找到 <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{resultCount}</span> 个相关结果
                      </span>
                    </div>
                  )}
                  
                  <div className="max-h-[320px] overflow-y-auto overscroll-contain">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <motion.button
                          key={`${suggestion.type}-${suggestion.text}`}
                          role="option"
                          aria-selected={index === selectedIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            backgroundColor: index === selectedIndex 
                              ? 'rgba(99, 102, 241, 0.08)' 
                              : 'transparent'
                          }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          onMouseEnter={() => {
                            setSelectedIndex(index);
                            selection();
                          }}
                          className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[14px] text-gray-900 dark:text-white font-medium block truncate">
                              {suggestion.text}
                            </span>
                            <span className="text-[12px] text-gray-500 dark:text-gray-400 capitalize">
                              {suggestion.type === 'history' ? '搜索历史' : 
                               suggestion.type === 'tag' ? '标签' :
                               suggestion.type === 'name' ? '技能名称' : '分类'}
                            </span>
                          </div>
                          {suggestion.type === 'history' && (
                            <TouchButton
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                removeFromHistory(suggestion.text);
                                selection();
                              }}
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3.5 h-3.5 text-gray-400" />
                            </TouchButton>
                          )}
                        </motion.button>
                      ))
                    ) : query ? (
                      <div className="px-5 py-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-[14px] text-gray-500 dark:text-gray-400">
                          未找到相关结果
                        </p>
                      </div>
                    ) : null}
                  </div>
                  
                  {suggestions.some(s => s.type === 'history') && (
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                      <span className="text-[12px] text-gray-500 dark:text-gray-400">搜索历史</span>
                      <button
                        onClick={() => {
                          clearHistory();
                          selection();
                        }}
                        className="text-[12px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                      >
                        清除全部
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
