'use client';

import { useState } from 'react';
import { SessionHeader } from './SessionHeader';
import { ExerciseNavigator } from './ExerciseNavigator';
import { FinishSessionDialog } from './FinishSessionDialog';
import { SessionSummary } from './SessionSummary';
import { useSession } from '@/hooks/useSession';
import type { SessionSummary as SessionSummaryType } from '@/types/domain.types';

export function SessionScreen() {
  const { session, logSet, modifyExercise, finishSession } = useSession();
  const [finishOpen, setFinishOpen] = useState(false);
  const [summary, setSummary] = useState<SessionSummaryType | null>(null);

  if (summary) {
    return <SessionSummary summary={summary} />;
  }

  if (!session) return null;

  const handleFinish = async (status: 'completed' | 'partial') => {
    const result = await finishSession({ status });
    setFinishOpen(false);
    setSummary(result);
  };

  return (
    <div className="flex h-full flex-col">
      <SessionHeader onFinish={() => setFinishOpen(true)} />

      <ExerciseNavigator
        exercises={session.exercises}
        onLogSet={logSet}
        onModify={modifyExercise}
      />

      <FinishSessionDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        onFinish={handleFinish}
      />
    </div>
  );
}
