'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserX, Wifi } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMonitoringUsers } from '@/hooks/useAdminMonitoring';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconColor?: string;
  valueColor?: string;
}

function StatCard({ icon, label, value, iconColor = 'text-muted-foreground', valueColor = 'text-foreground' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${iconColor}`}>
        {icon}
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`font-display text-[28px] font-bold leading-none ${valueColor}`}>{value.toLocaleString()}</p>
    </div>
  );
}

export function MonitoringUsersTab() {
  const { t } = useTranslation();
  const { data, isLoading, fetch } = useMonitoringUsers();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <StatCard
        icon={<Users size={18} />}
        label={t('monitoring.users.active')}
        value={data.activeUsers}
        iconColor="text-blue-500"
        valueColor="text-blue-600"
      />
      <StatCard
        icon={<UserX size={18} />}
        label={t('monitoring.users.inactive')}
        value={data.inactiveUsers}
        iconColor="text-muted-foreground"
      />
      <StatCard
        icon={<Wifi size={18} />}
        label={t('monitoring.users.realTime')}
        value={data.realTimeActiveUsers}
        iconColor="text-green-500"
        valueColor="text-green-600"
      />
    </div>
  );
}
