'use client';

import { useEffect, useState } from 'react';
import UserMenu from '@/modules/layout/components/UserMenu';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  developerMode?: boolean;
}

interface SessionData {
  user?: User;
}

export function AuthUserMenu() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setSession(Object.keys(data).length > 0 ? data : null);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return <UserMenu user={session?.user} />;
}
