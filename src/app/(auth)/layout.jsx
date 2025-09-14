'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthSpinner from '@/components/AuthSpinner';

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <AuthSpinner />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {children}
    </main>
  );
}
