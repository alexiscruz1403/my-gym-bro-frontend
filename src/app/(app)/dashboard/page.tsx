'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <h2 className="font-display text-2xl font-bold">
        Hola, {user?.username ?? '…'} 👋
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Bienvenido a Gym Planner. Sprint 2 completará esta pantalla.
      </p>
    </PageContainer>
  );
}
