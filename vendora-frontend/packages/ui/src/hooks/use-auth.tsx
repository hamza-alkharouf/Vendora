'use client';

import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@repo/api';

interface User {
  id: string;
  phone: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await auth.getMe();
          setUser(prev => {
             // Simple comparison to avoid re-render if data is identical
             if (prev && prev.id === res.data.id && prev.role === res.data.role) return prev;
             return res.data;
          });
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (phone: string, otp: string) => {
    const res = await auth.verifyOtp(phone, otp);
    const { access_token, user } = res.data;
    localStorage.setItem('token', access_token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // Use window.location for a full refresh on logout to clear all states
    window.location.href = '/';
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
