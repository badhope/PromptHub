'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  defaultSort: 'popular' | 'newest' | 'rating' | 'name';
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  showNotifications: boolean;
  autoSaveSearch: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'zh-CN',
  defaultSort: 'popular',
  defaultView: 'grid',
  itemsPerPage: 20,
  showNotifications: true,
  autoSaveSearch: true
};

const PREFERENCES_KEY = 'user-preferences';

function applyTheme(theme: UserPreferences['theme']) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    localStorage.removeItem('theme');
  }
}

function getInitialPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse preferences from localStorage:', error);
  }
  return DEFAULT_PREFERENCES;
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getInitialPreferences());
  const isLoaded = typeof window !== 'undefined';

  useEffect(() => {
    if (isLoaded) {
      applyTheme(preferences.theme);
    }
  }, [isLoaded, preferences.theme]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: value };
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPrefs));
      } catch (error) {
        console.warn('Failed to save preferences to localStorage:', error);
      }
      return newPrefs;
    });
  }, []);

  const savePreferences = useCallback((prefs?: Partial<UserPreferences>) => {
    const prefsToSave = prefs ? { ...preferences, ...prefs } : preferences;
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefsToSave));
    if (prefs) {
      setPreferences(prev => ({ ...prev, ...prefs }));
    }
  }, [preferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    applyTheme(DEFAULT_PREFERENCES.theme);
  }, []);

  const exportPreferences = useCallback((): string => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  const importPreferences = useCallback((jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString);
      const validatedPrefs = { ...DEFAULT_PREFERENCES, ...imported };
      setPreferences(validatedPrefs);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(validatedPrefs));
      applyTheme(validatedPrefs.theme);
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }, []);

  return {
    preferences,
    isLoaded,
    updatePreference,
    savePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences
  };
}
