import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import { PageTransition } from '@/components/layout/PageTransition';
import { NavigationProgress } from '@/components/layout/NavigationProgress';
import { SessionGuard } from '@/components/layout/SessionGuard';
import { UserLoader } from '@/components/layout/UserLoader';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { ActiveSessionWidget } from '@/components/session/ActiveSessionWidget';
import { NotificationsProvider } from '@/components/notifications/NotificationsProvider';
import { AchievementUnlockAnimation } from '@/components/achievements/AchievementUnlockAnimation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationProgress />
      <SessionGuard />
      <UserLoader />
      <NotificationsProvider />
      <AchievementUnlockAnimation />
      {/* Desktop: fixed left sidebar */}
      <SideNav />

      {/* Main column — offset by sidebar width on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-60">
        <AppHeader />
        <OfflineBanner />
        <main className="flex-1"><PageTransition>{children}</PageTransition></main>
        <ActiveSessionWidget />
        <BottomNav />
      </div>
    </div>
  );
}
