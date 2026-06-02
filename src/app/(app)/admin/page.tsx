'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminUserList } from '@/components/admin/AdminUserList';
import { AdminExerciseList } from '@/components/admin/AdminExerciseList';
import { AdminPaymentLogList } from '@/components/admin/AdminPaymentLogList';
import { AdminTermsList } from '@/components/admin/AdminTermsList';
import { AdminMonitoringSection } from '@/components/admin/AdminMonitoringSection';
import useAuthStore from '@/store/auth.store';

type AdminTab = 'users' | 'exercises' | 'payments' | 'terms' | 'monitoring';

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<AdminTab>('users');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const TABS: { value: AdminTab; label: string }[] = [
    { value: 'users', label: t('admin.tabs.users') },
    { value: 'exercises', label: t('admin.tabs.exercises') },
    { value: 'payments', label: t('admin.tabs.payments') },
    { value: 'terms', label: t('admin.tabs.terms') },
    { value: 'monitoring', label: t('admin.tabs.monitoring') },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none]">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.value}
              type="button"
              onClick={() => setTab(tabItem.value)}
              className={cn(
                'h-8.5 shrink-0 px-3.5 rounded-full text-[13px] font-semibold cursor-pointer border-[1.5px] whitespace-nowrap transition-colors',
                tab === tabItem.value
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {tab === 'users' && <AdminUserList />}
        {tab === 'exercises' && <AdminExerciseList />}
        {tab === 'payments' && <AdminPaymentLogList />}
        {tab === 'terms' && <AdminTermsList />}
        {tab === 'monitoring' && <AdminMonitoringSection />}
      </div>
    </PageContainer>
  );
}
