'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';

export function OAuthCallback() {
  const router = useRouter();
  const { setAuthenticated, setUser } = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Guard against double-invocation in React strict mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // Clean any tokens from the URL immediately for security
    window.history.replaceState({}, '', '/callback');

    const processCallback = async (): Promise<void> => {
      try {
        // The backend set httpOnly cookies on redirect — just fetch the user
        // to confirm authentication and hydrate the store.
        const user = await usersService.getMe();
        setAuthenticated(true);
        setUser(user);
        router.replace('/dashboard');
      } catch {
        toast.error('Error al procesar el inicio de sesión. Intenta de nuevo.');
        setTimeout(() => {
          router.replace('/login');
        }, 2000)
      }
    };

    processCallback();
  }, [setAuthenticated, setUser, router]);

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Iniciando sesión con Google…</p>
    </div>
  );
}
