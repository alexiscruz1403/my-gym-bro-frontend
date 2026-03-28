'use client';

import { useEffect } from 'react';
import useUIStore from '@/store/ui.store';

/**
 * Applies the persisted dark mode preference to <html>
 * on first client render. Placed in the root layout so it
 * runs before any page content is painted.
 */
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
