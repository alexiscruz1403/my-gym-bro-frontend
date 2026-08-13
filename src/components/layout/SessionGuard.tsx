'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import useSessionStore from '@/store/session.store';
import { getActiveSession } from '@/services/sessions.service';

export function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeSessionId, activeSession, _hasHydrated, setActiveSession, clearSession } = useSessionStore();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (checkedRef.current || !activeSessionId || activeSession) return;
    checkedRef.current = true;

    (async () => {
      try {
        const session = await getActiveSession();
        if (session) {
          setActiveSession(session);
          if (pathname !== '/session') {
            router.push('/session');
          }
        } else {
          clearSession();
        }
      } catch {
        toast.error('No connection. Your session will resume when online.');
      }
    })();
  }, [_hasHydrated, activeSessionId, activeSession, pathname, router, setActiveSession, clearSession]);

  return null;
}
