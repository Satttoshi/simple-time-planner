'use client';

import Table from '@/components/Table';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);
  const loading = useStore((state) => state.loading);

  useEffect(() => {
    initPersons();
  }, [initPersons]);

  return (
    <>
      <main className="bg-background text-foreground h-screen flex flex-col max-w-[800px] mx-auto w-full">
        {loading ? <h2>loading</h2> : <Table />}
      </main>
      <Toaster />
    </>
  );
}
