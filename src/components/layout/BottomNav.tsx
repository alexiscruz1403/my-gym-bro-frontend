'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Dumbbell, Users, User, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth.store';

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const NAV_ITEMS = [
    { href: '/dashboard', icon: Home, label: t('nav.home') },
    { href: '/workout', icon: Dumbbell, label: t('nav.workouts') },
    { href: '/feed', icon: Users, label: t('nav.feed') },
    { href: '/ranks', icon: Trophy, label: t('nav.ranks') },
    { href: '/ai', icon: Sparkles, label: t('nav.ai') },
    { href: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors',
              pathname.startsWith('/admin')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <ShieldCheck size={24} />
            <span className="text-[10px] font-medium">{t('nav.admin')}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
