'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

export function NotificationBell() {
  const router = useRouter();
  const { count } = useUnreadNotifications();

  const display = count > 99 ? '99+' : String(count);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/notifications')}
      aria-label={count > 0 ? `${count} notificaciones sin leer` : 'Notificaciones'}
      className="relative cursor-pointer"
    >
      <Bell size={20} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground"
        >
          {display}
        </span>
      )}
    </Button>
  );
}
