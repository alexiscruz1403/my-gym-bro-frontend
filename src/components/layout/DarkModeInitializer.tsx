'use client';

import { useEffect } from 'react';
import useUIStore from '@/store/ui.store';

export function DarkModeInitializer() {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return null;
}
