'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import AuthSpinner from '@/components/AuthSpinner';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    setUser,
    loading,
    checkSession,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <AuthSpinner /> : children}
    </AuthContext.Provider>
  );
}
