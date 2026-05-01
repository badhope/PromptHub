'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/lib/llm';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  model: string;
  prompt?: string;
  variables?: Array<{ name: string; value: string }>;
}

const STORAGE_KEY = 'workspace:sessions';
const STORAGE_KEY_CURRENT = 'workspace:currentSession';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getTitleFromMessages(messages: Message[]): string {
  const firstUser = messages.find(m => m.role === 'user');
  if (firstUser) {
    return firstUser.content.slice(0, 30) + (firstUser.content.length > 30 ? '...' : '');
  }
  return '新对话';
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY);
      const savedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
      
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed)) {
          setSessions(parsed);
          if (parsed.length > 0) {
            setCurrentId(savedCurrent || parsed[0].id);
          }
        }
      }
    } catch {}
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized && sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, initialized]);

  useEffect(() => {
    if (initialized && currentId) {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentId);
    }
  }, [currentId, initialized]);

  const currentSession = sessions.find(s => s.id === currentId) || null;

  const createSession = useCallback((options: Partial<ChatSession> = {}) => {
    const id = generateId();
    const now = Date.now();
    const session: ChatSession = {
      id,
      title: '新对话',
      createdAt: now,
      updatedAt: now,
      messages: [],
      model: 'ollama',
      prompt: '',
      variables: [],
      ...options,
    };
    setSessions(prev => [session, ...prev]);
    setCurrentId(id);
    return id;
  }, []);

  const ensureSession = useCallback(() => {
    if (!currentId || !sessions.find(s => s.id === currentId)) {
      return createSession();
    }
    return currentId;
  }, [currentId, sessions, createSession]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      if (currentId === id) {
        if (next.length > 0) {
          setCurrentId(next[0].id);
        } else {
          const newId = generateId();
          const now = Date.now();
          next.push({
            id: newId,
            title: '新对话',
            createdAt: now,
            updatedAt: now,
            messages: [],
            model: 'ollama',
            prompt: '',
            variables: [],
          });
          setCurrentId(newId);
        }
      }
      return next;
    });
  }, [currentId]);

  const renameSession = useCallback((id: string, title: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, title: title || '新对话', updatedAt: Date.now() };
      }
      return s;
    }));
  }, []);

  const exportSession = useCallback((id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return null;
    return JSON.stringify(session, null, 2);
  }, [sessions]);

  const updateSession = useCallback((id: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates, updatedAt: Date.now() };
        if (updates.messages && updates.messages.length > 0) {
          updated.title = getTitleFromMessages(updates.messages);
        }
        return updated;
      }
      return s;
    }));
  }, []);

  return {
    sessions,
    currentId,
    currentSession,
    createSession,
    deleteSession,
    renameSession,
    exportSession,
    updateSession,
    ensureSession,
    setCurrentId,
    initialized,
  };
}
