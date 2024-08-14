'use client';

import Table from '@/components/Table';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);
  const loading = useStore((state) => state.loading);

  useEffect(() => {
    initPersons();
  }, [initPersons]);

  return (
    <main className="bg-blue-950 text-white">
      {loading ? <h2>loading</h2> : <Table />}
    </main>
  );
}
