'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationPath = NestedKeyOf<TranslationKey>;

export function useI18n(initialLanguage?: Language) {
  const [language, setLanguage] = useState<Language>(() => {
    if (initialLanguage) return initialLanguage;
    if (typeof window === 'undefined') return 'zh-CN';
    
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        if (prefs.language) {
          return prefs.language;
        }
      } catch (error) {
        console.warn('Failed to parse language preference:', error);
      }
    }
    return 'zh-CN';
  });

  useEffect(() => {
    const checkLanguageChange = () => {
      const stored = localStorage.getItem('user-preferences');
      if (stored) {
        try {
          const prefs = JSON.parse(stored);
          if (prefs.language && prefs.language !== language) {
            setLanguage(prefs.language);
          }
        } catch (error) {
          console.warn('Failed to check language change:', error);
        }
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-preferences' && e.newValue) {
        try {
          const prefs = JSON.parse(e.newValue);
          if (prefs.language && prefs.language !== language) {
            setLanguage(prefs.language);
          }
        } catch (error) {
          console.warn('Failed to handle storage change:', error);
        }
      }
    };

    const interval = setInterval(checkLanguageChange, 500);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  const t = useCallback((path: TranslationPath, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let value: unknown = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }

    if (typeof value !== 'string') {
      return path;
    }

    if (params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val)),
        value
      );
    }

    return value;
  }, [language]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        prefs.language = newLang;
        localStorage.setItem('user-preferences', JSON.stringify(prefs));
      } catch (e) {
        console.error('Failed to save language preference:', e);
      }
    } else {
      localStorage.setItem('user-preferences', JSON.stringify({ language: newLang }));
    }
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user-preferences',
      newValue: JSON.stringify({ language: newLang })
    }));
  }, []);

  return { language, t, changeLanguage };
}
