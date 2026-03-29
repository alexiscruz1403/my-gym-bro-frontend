'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';

export default function ExercisesPage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-4 text-2xl font-bold">Exercise Catalog</h1>
      <ExerciseCatalog mode="browse" />
    </PageContainer>
  );
}
