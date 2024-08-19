'use client';

import AppContent from '@/components/AppContent';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import SkeletonCard from '@/components/SkeletonCard';

export default function Home() {
  const loading = useStore((state) => state.loading);
  const initWeeks = useStore((state) => state.initWeeks);

  useEffect(() => {
    initWeeks();
  }, [initWeeks]);

  return (
    <>
      <main className="bg-background text-foreground h-screen flex flex-col max-w-[800px] mx-auto w-full">
        {loading ? <SkeletonCard /> : <AppContent />}
      </main>
      <Toaster />
    </>
  );
}
