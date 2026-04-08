'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdvancedSearch, type SearchSuggestion } from '@/hooks/useAdvancedSearch';
import type { Skill } from '@/types/skill';

interface SearchBarProps {
  skills: Skill[];
  onSearch?: (query: string, results: Skill[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  skills, 
  onSearch, 
  placeholder = '搜索技能...',
  className = '' 
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    addToHistory(suggestion.text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query);
      setShowSuggestions(false);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return '🕐';
      case 'tag':
        return '🏷️';
      case 'name':
        return '📝';
      case 'category':
        return '📂';
      default:
        return '🔍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="搜索技能"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="清除搜索"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getSuggestionIcon(suggestion.type)}</span>
                <span className="text-sm text-gray-900">{suggestion.text}</span>
                {suggestion.type === 'history' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(suggestion.text);
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label="移除历史记录"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {suggestion.count && (
                <span className="text-xs text-gray-500">{suggestion.count} 个结果</span>
              )}
            </div>
          ))}

          {suggestions.some(s => s.type === 'history') && (
            <div className="border-t border-gray-200 px-4 py-2">
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                清除搜索历史
              </button>
            </div>
          )}
        </div>
      )}

      {query && !showSuggestions && (
        <div className="absolute right-0 top-full mt-1 text-xs text-gray-500">
          {hasResults ? `${resultCount} 个结果` : '无结果'}
        </div>
      )}
    </div>
  );
}
