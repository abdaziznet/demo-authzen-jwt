'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthSpinner from '@/components/AuthSpinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <AuthSpinner />
    </div>
  );
}
