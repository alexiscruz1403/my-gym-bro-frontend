'use client';

import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonitoringUsersTab } from '@/components/admin/monitoring/MonitoringUsersTab';
import { MonitoringSubscriptionsTab } from '@/components/admin/monitoring/MonitoringSubscriptionsTab';
import { MonitoringAiTab } from '@/components/admin/monitoring/MonitoringAiTab';
import { MonitoringErrorsTab } from '@/components/admin/monitoring/MonitoringErrorsTab';

export function AdminMonitoringSection() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="mon-users">
      <TabsList className="mb-4">
        <TabsTrigger value="mon-users">{t('monitoring.tabs.users')}</TabsTrigger>
        <TabsTrigger value="mon-subscriptions">{t('monitoring.tabs.subscriptions')}</TabsTrigger>
        <TabsTrigger value="mon-ai">{t('monitoring.tabs.ai')}</TabsTrigger>
        <TabsTrigger value="mon-logs">{t('monitoring.tabs.logs')}</TabsTrigger>
      </TabsList>
      <TabsContent value="mon-users">
        <MonitoringUsersTab />
      </TabsContent>
      <TabsContent value="mon-subscriptions">
        <MonitoringSubscriptionsTab />
      </TabsContent>
      <TabsContent value="mon-ai">
        <MonitoringAiTab />
      </TabsContent>
      <TabsContent value="mon-logs">
        <MonitoringErrorsTab />
      </TabsContent>
    </Tabs>
  );
}
