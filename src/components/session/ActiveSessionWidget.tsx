'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';
import useSessionStore from '@/store/session.store';

export function ActiveSessionWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const activeSessionId = useSessionStore((s) => s.activeSessionId);

  if (!activeSessionId || pathname === '/session') return null;

  return (
    <button
      type="button"
      onClick={() => router.push('/session')}
      aria-label="Return to active session"
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-2 lg:bottom-6"
    >
      <Dumbbell className="h-4 w-4 shrink-0" />
      Active session
    </button>
  );
}
