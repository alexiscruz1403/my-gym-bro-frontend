'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUIStore from '@/store/ui.store';
import { useEffect } from 'react';

interface AppHeaderProps {
  title?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, action }: AppHeaderProps) {
  const { isDarkMode, toggleDarkMode } = useUIStore();

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
        <h1 className="font-display text-lg font-semibold text-foreground truncate">
          {title ?? 'MyGymBro'}
        </h1>

        <div className="flex items-center gap-2">
          {action}
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
