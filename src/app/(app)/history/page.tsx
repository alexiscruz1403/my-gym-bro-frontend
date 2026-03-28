import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';

export default function HistoryPage() {
  return (
    <PageContainer>
      <EmptyState title="Sin datos" description="Sprint 4 implementará historial y estadísticas." />
    </PageContainer>
  );
}
