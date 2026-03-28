import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';

export default function FeedPage() {
  return (
    <PageContainer>
      <EmptyState title="Próximamente" description="Sprint 5 implementará el feed social." />
    </PageContainer>
  );
}
