'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { PendingFollowRequestsSection } from '@/components/notifications/PendingFollowRequestsSection';

export default function NotificationsPage() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Notificaciones</h1>
      </div>
      <PendingFollowRequestsSection />
      <NotificationsList />
    </PageContainer>
  );
}
