'use client';

import { useState, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
}

function getInitialNotificationState() {
  if (typeof window === 'undefined') {
    return { isSupported: false, permission: 'default' as NotificationPermission, isEnabled: false };
  }
  const isSupported = 'Notification' in window;
  const permission = isSupported ? Notification.permission : 'default';
  
  let isEnabled = true;
  const stored = localStorage.getItem('user-preferences');
  if (stored) {
    try {
      const prefs = JSON.parse(stored);
      isEnabled = prefs.showNotifications ?? true;
    } catch (error) {
      console.warn('Failed to parse notification preferences:', error);
    }
  }
  
  return { isSupported, permission, isEnabled };
}

export function useNotifications() {
  const [state, setState] = useState(() => getInitialNotificationState());
  const { isSupported, permission, isEnabled } = state;

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: result }));
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(async (options: NotificationOptions): Promise<void> => {
    if (!isSupported || !isEnabled || permission !== 'granted') return;

    try {
      const { title, body, icon, tag } = options;
      
      if (document.visibilityState === 'visible') {
        return;
      }

      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: tag || `prompthub-${Date.now()}`,
        badge: '/favicon.ico'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [isSupported, isEnabled, permission]);

  const toggleEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, isEnabled: enabled }));
    
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        prefs.showNotifications = enabled;
        localStorage.setItem('user-preferences', JSON.stringify(prefs));
        
        if (enabled && permission === 'default') {
          requestPermission();
        }
      } catch (e) {
        console.error('Failed to save notification preference:', e);
      }
    }
  }, [permission, requestPermission]);

  const notifySkillUpdate = useCallback(() => {
    sendNotification({
      title: '🚀 PromptHub',
      body: '有新的提示词上线！点击查看详情。',
      tag: 'skill-update'
    });
  }, [sendNotification]);

  const notifyFavoriteAdded = useCallback((skillName: string) => {
    sendNotification({
      title: '❤️ 收藏成功',
      body: `"${skillName}" 已添加到您的收藏夹`,
      tag: 'favorite-added'
    });
  }, [sendNotification]);

  return {
    isSupported,
    permission,
    isEnabled,
    requestPermission,
    sendNotification,
    toggleEnabled,
    notifySkillUpdate,
    notifyFavoriteAdded
  };
}
