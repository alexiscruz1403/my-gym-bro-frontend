'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserList } from '@/components/admin/AdminUserList';
import { AdminExerciseList } from '@/components/admin/AdminExerciseList';
import { AdminPaymentLogList } from '@/components/admin/AdminPaymentLogList';
import { AdminTermsList } from '@/components/admin/AdminTermsList';
import { AdminMonitoringSection } from '@/components/admin/AdminMonitoringSection';
import useAuthStore from '@/store/auth.store';

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold mb-6">{t('admin.title')}</h1>
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">{t('admin.tabs.users')}</TabsTrigger>
          <TabsTrigger value="exercises">{t('admin.tabs.exercises')}</TabsTrigger>
          <TabsTrigger value="payments">{t('admin.tabs.payments')}</TabsTrigger>
          <TabsTrigger value="terms">{t('admin.tabs.terms')}</TabsTrigger>
          <TabsTrigger value="monitoring">{t('admin.tabs.monitoring')}</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="exercises">
          <AdminExerciseList />
        </TabsContent>
        <TabsContent value="payments">
          <AdminPaymentLogList />
        </TabsContent>
        <TabsContent value="terms">
          <AdminTermsList />
        </TabsContent>
        <TabsContent value="monitoring">
          <AdminMonitoringSection />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
