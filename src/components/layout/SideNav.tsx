'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Dumbbell, Users, User, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth.store';

export function SideNav() {
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
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-60 flex-col bg-card border-r border-border z-40">
      {/* Logo */}
      <div className="flex h-14 items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/MyGymBro.svg" alt="MyGymBro" width={36} height={16} priority />
          <span className="font-display text-xl font-bold tracking-wide">
            <span className="text-primary">My</span>
            <span className="text-foreground">Gym</span>
            <span className="text-primary">Bro</span>
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith('/admin')
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            <ShieldCheck size={20} />
            {t('nav.admin')}
          </Link>
        )}
      </nav>
    </aside>
  );
}
