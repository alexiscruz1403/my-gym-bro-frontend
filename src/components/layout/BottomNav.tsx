'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, ChartBar, Users, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth.store';

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Inicio' },
  { href: '/workout', icon: Dumbbell, label: 'Rutinas' },
  { href: '/history', icon: ChartBar, label: 'Stats' },
  { href: '/feed', icon: Users, label: 'Feed' },
  { href: '/profile', icon: User, label: 'Perfil' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

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
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
