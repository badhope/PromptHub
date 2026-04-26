'use client';

import { useState, useEffect, useCallback } from 'react';

interface ApiKeyConfig {
  openai: string;
  deepseek: string;
  anthropic: string;
  qwen: string;
  hunyuan: string;
  wenxin: string;
  doubao: string;
}

const DEFAULT_API_CONFIG: ApiKeyConfig = {
  openai: '',
  deepseek: '',
  anthropic: '',
  qwen: '',
  hunyuan: '',
  wenxin: '',
  doubao: '',
};

export function useWorkspaceState() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [variablesExpanded, setVariablesExpanded] = useState(false);
  const [immersionMode, setImmersionMode] = useState(false);
  const [apiKeyConfig, setApiKeyConfig] = useState<ApiKeyConfig>(DEFAULT_API_CONFIG);

  useEffect(() => {
    const saved = localStorage.getItem('workspace:apiKeys');
    if (saved) {
      try {
        setApiKeyConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workspace:apiKeys', JSON.stringify(apiKeyConfig));
  }, [apiKeyConfig]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  }, []);

  const toggleImmersionMode = useCallback(() => {
    setImmersionMode(prev => {
      const next = !prev;
      if (!next) {
        setSidebarOpen(false);
      }
      return next;
    });
  }, []);

  return {
    selectedModel,
    setSelectedModel,
    sidebarOpen,
    setSidebarOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    showSettings,
    setShowSettings,
    compareMode,
    setCompareMode,
    promptExpanded,
    setPromptExpanded,
    variablesExpanded,
    setVariablesExpanded,
    immersionMode,
    setImmersionMode,
    apiKeyConfig,
    setApiKeyConfig,
    toggleSidebar,
    toggleImmersionMode,
  };
}
