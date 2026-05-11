'use client';

import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { PendingFollowRequestsSection } from '@/components/notifications/PendingFollowRequestsSection';

export default function NotificationsPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">{t('notifications.title')}</h1>
      </div>
      <PendingFollowRequestsSection />
      <NotificationsList />
    </PageContainer>
  );
}
