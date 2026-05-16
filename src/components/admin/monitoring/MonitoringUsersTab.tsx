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
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
      <div className={`flex items-center gap-2 ${iconColor}`}>
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value.toLocaleString()}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
