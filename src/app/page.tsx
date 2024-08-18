'use client';

import Table from '@/components/Table';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const initPersons = useStore((state) => state.initPersons);
  const loading = useStore((state) => state.loading);

  useEffect(() => {
    initPersons();
  }, [initPersons]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <main className="bg-blue-950 text-white">
        {loading ? <h2>loading</h2> : <Table />}
      </main>
    </>
  );
}
