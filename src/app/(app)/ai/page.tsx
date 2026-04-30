import { PageContainer } from '@/components/layout/PageContainer';
import { AiLandingPage } from '@/components/ai/AiLandingPage';

export default function AiPage() {
  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold">Entrenamiento IA</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Planes y progresiones generados por inteligencia artificial
        </p>
      </div>
      <AiLandingPage />
    </PageContainer>
  );
}
