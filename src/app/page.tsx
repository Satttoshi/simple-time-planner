'use client';

import AppContent from '@/components/AppContent';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import SkeletonCard from '@/components/SkeletonCard';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);
  const loading = useStore((state) => state.loading);

  useEffect(() => {
    initPersons();
  }, [initPersons]);

  return (
    <>
      <main className="bg-background text-foreground h-screen flex flex-col max-w-[800px] mx-auto w-full">
        {loading ? <SkeletonCard /> : <AppContent />}
      </main>

      <Toaster />
    </>
  );
}
