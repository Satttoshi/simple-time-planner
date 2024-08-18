'use client';

import Table from '@/components/Table';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);
  const loading = useStore((state) => state.loading);

  useEffect(() => {
    initPersons();
  }, [initPersons]);

  return (
    <>
      <main className="bg-background text-foreground">
        {loading ? <h2>loading</h2> : <Table />}
      </main>
      <Toaster />
    </>
  );
}
