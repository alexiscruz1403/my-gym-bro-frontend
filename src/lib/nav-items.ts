import { Home, Dumbbell, Users, User, Trophy, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  icon: LucideIcon;
  labelKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: Home, labelKey: 'nav.home' },
  { href: '/workout', icon: Dumbbell, labelKey: 'nav.workouts' },
  { href: '/feed', icon: Users, labelKey: 'nav.feed' },
  { href: '/ranks', icon: Trophy, labelKey: 'nav.ranks' },
  { href: '/ai', icon: Sparkles, labelKey: 'nav.ai' },
  { href: '/profile', icon: User, labelKey: 'nav.profile' },
];
