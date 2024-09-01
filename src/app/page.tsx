'use client';

import Protected from '@/components/Protected';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks/useStore';
import PasswordForm from '@/components/PasswordForm';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validatePassword = useStore((state) => state.validatePassword);
  const password = useStore((state) => state.password);

  useEffect(() => {
    async function checkPassword() {
      if (!password) return;
      const isAuthenticated = await validatePassword(password);
      setIsAuthenticated(isAuthenticated);
    }

    checkPassword().catch(console.error);
  }, [password]);

  return isAuthenticated ? <Protected /> : <PasswordForm />;
}
