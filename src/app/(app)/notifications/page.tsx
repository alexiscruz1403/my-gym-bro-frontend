'use client';

import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { PendingFollowRequestsSection } from '@/components/notifications/PendingFollowRequestsSection';

export default function NotificationsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('notifications.title')} />
      <PageContainer>
        <PendingFollowRequestsSection />
        <NotificationsList />
      </PageContainer>
    </>
  );
}
