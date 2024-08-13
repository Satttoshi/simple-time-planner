'use client';

import Table from '@/components/Table';
import { useStore } from '@/hooks/useStore';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);

  initPersons();

  return (
    <main className="bg-blue-950">
      <Table />
    </main>
  );
}
