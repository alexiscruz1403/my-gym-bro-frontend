'use client';

import { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';

interface WorkoutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WorkoutError({ error, reset }: WorkoutErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-display text-lg font-semibold">Something went wrong</p>
        <p className="text-muted-foreground text-sm">
          {error.message ?? 'An unexpected error occurred.'}
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </PageContainer>
  );
}
