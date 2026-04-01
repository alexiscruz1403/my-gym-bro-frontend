'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import useSessionStore from '@/store/session.store';
import { getActiveSession } from '@/services/sessions.service';

/**
 * Mounts once in the app layout. On load, if a persisted activeSessionId exists
 * but there is no in-memory activeSession, it calls GET /sessions/active.
 * - 200: hydrates the store and redirects to /session (unless already there).
 * - 404: clears the stale sessionId from the store.
 */
export function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeSessionId, activeSession, _hasHydrated, setActiveSession, clearSession } = useSessionStore();
  const checkedRef = useRef(false);

  useEffect(() => {
    // Wait for Zustand to finish reading localStorage before checking for an active session
    if (!_hasHydrated) return;
    // Run only once per mount and only if there is a persisted session to check
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
        // Network error — leave the store as-is, user can retry manually
        toast.error('No connection. Your session will resume when online.');
      }
    })();
  }, [_hasHydrated, activeSessionId, activeSession, pathname, router, setActiveSession, clearSession]);

  return null;
}
