'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/providers/auth-store-provider';
import { getMe } from '@/lib/services/api/auth';
import { customLocalStorage } from '@/lib/services/localStorage';

type AuthMode = 'auth' | 'unauth';

interface AuthGuardProps {
  mode: AuthMode;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { mode, children } = props;
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  useEffect(() => {
    const validateAccessToken = async () => {
      try {
        const response = await getMe();
        if (response.success && response.data) {
          setUser(response.data);
          return true;
        }
      } catch (error) {
        customLocalStorage.removeValue('accessToken');
        router.replace('/signin');
      }
    };

    const accessToken = customLocalStorage.getValue('accessToken');
    if (mode === 'auth') {
      if (!accessToken) {
        router.replace('/signin');
      } else {
        validateAccessToken();
      }
    }
    if (mode === 'unauth') {
      if (accessToken) {
        router.replace('/dashboard');
      }
    }
  }, [router, setUser, mode]);

  return <>{children}</>;
};

export default AuthGuard;
