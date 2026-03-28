'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Guard against double-invocation in React strict mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error('Error en la autenticación con Google. Intenta de nuevo.');
      router.replace('/login');
      return;
    }

    const processCallback = async (): Promise<void> => {
      try {
        setTokens({ accessToken, refreshToken });

        // Clean tokens from the URL immediately for security
        window.history.replaceState({}, '', '/callback');

        const user = await usersService.getMe();
        setUser(user);

        router.replace('/dashboard');
      } catch {
        toast.error('Error al procesar el inicio de sesión. Intenta de nuevo.');
        router.replace('/login');
      }
    };

    processCallback();
  }, [searchParams, setTokens, setUser, router]);

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Iniciando sesión con Google…</p>
    </div>
  );
}
