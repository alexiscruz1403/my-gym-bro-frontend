import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';

export default function WorkoutPage() {
  return (
    <PageContainer>
      <EmptyState
        title="Sin planes"
        description="Tus planes de entrenamiento aparecerán aquí. Sprint 2 implementará esta sección."
      />
    </PageContainer>
  );
}
