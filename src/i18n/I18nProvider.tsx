'use client';

import { useEffect } from 'react';
import '@/i18n/config';
import i18n from 'i18next';
import useAuthStore from '@/store/auth.store';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const lang = user?.language ?? 'es';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [user?.language]);

  return <>{children}</>;
}
