import { PageContainer } from '@/components/layout/PageContainer';
import { AiPlanWizard } from '@/components/ai/wizard/AiPlanWizard';

export default function AiGeneratePage() {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Generar plan con IA</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Completa tu perfil y la IA diseñará tu plan personalizado.
        </p>
      </div>
      <AiPlanWizard />
    </PageContainer>
  );
}
