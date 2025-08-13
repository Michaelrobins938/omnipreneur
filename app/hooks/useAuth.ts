"use client"

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  subscription?: any;
  usage?: any;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/me', { 
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for auth changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_changed') {
        checkAuth();
      }
    };

    // Listen for visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    // Poll for cookie changes (for auth persistence)
    let lastAuthCookie = document.cookie.includes('auth_token=');
    const pollCookies = () => {
      const currentAuthCookie = document.cookie.includes('auth_token=');
      if (lastAuthCookie !== currentAuthCookie) {
        lastAuthCookie = currentAuthCookie;
        checkAuth();
      }
    };

    const cookiePollInterval = setInterval(pollCookies, 1000);

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkAuth);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkAuth);
      clearInterval(cookiePollInterval);
    };
  }, [checkAuth]);

  return {
    user,
    loading,
    checkAuth,
    logout
  };
}

// Helper function to trigger auth recheck across tabs
export function triggerAuthChange() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_changed', Date.now().toString());
    localStorage.removeItem('auth_changed');
  }
}