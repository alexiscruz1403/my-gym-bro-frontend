'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUIStore from '@/store/ui.store';
import useAuthStore from '@/store/auth.store';
import { useEffect } from 'react';
import Image from 'next/image'
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface AppHeaderProps {
  title?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, action }: AppHeaderProps) {
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Apply .dark class to <html> whenever isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:invisible">
          <Image src="/MyGymBro.svg" alt="MyGymBro" width={36} height={16} priority />
          <span className="font-display text-xl font-bold tracking-wide">
            <span className="text-primary">My</span>
            <span className="text-foreground">Gym</span>
            <span className="text-primary">Bro</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {action}
          {isAuthenticated && <NotificationBell />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            className={'cursor-pointer'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
