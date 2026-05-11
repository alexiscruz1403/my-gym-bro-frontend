'use client';

import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { AiLandingPage } from '@/components/ai/AiLandingPage';

export default function AiPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold">{t('ai.title')}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{t('ai.subtitle')}</p>
      </div>
      <AiLandingPage />
    </PageContainer>
  );
}
