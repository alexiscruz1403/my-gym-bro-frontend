import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import { SessionGuard } from '@/components/layout/SessionGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SessionGuard />
      {/* Desktop: fixed left sidebar */}
      <SideNav />

      {/* Main column — offset by sidebar width on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-60">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
