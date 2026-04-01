'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionHeader } from './SessionHeader';
import { ExerciseNavigator } from './ExerciseNavigator';
import { ConfirmFinishDialog } from './ConfirmFinishDialog';
import { ConfirmCancelDialog } from './ConfirmCancelDialog';
import { SessionSummary } from './SessionSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import type { SessionSummary as SessionSummaryType } from '@/types/domain.types';

export function SessionScreen() {
  const router = useRouter();
  const { session, loading, logSet, modifyExercise, replaceExercise, cancelSession, finishSession } = useSession();
  const [finishOpen, setFinishOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [summary, setSummary] = useState<SessionSummaryType | null>(null);

  if (summary) {
    return <SessionSummary summary={summary} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!session) {
    router.replace('/dashboard');
    return null;
  }

  // Determine status automatically: completed only if every planned set in
  // every exercise has been logged as completed.
  const isFullyCompleted = session.exercises.every(
    (ex) => ex.sets.filter((s) => s.completed).length >= ex.plannedSets,
  );

  const handleConfirmFinish = async () => {
    const status = isFullyCompleted ? 'completed' : 'partial';
    const result = await finishSession({ status });
    setFinishOpen(false);
    setSummary(result);
    const label = status === 'completed' ? 'Workout completed' : 'Session saved';
    toast.success(`${label} · ${result.totalSetsLogged} sets · ${Math.round(result.durationSeconds / 60)}min`);
  };

  return (
    <div className="flex h-full flex-col">
      <SessionHeader onFinish={() => setFinishOpen(true)} onCancel={() => setCancelOpen(true)} />

      <ExerciseNavigator
        exercises={session.exercises}
        onLogSet={logSet}
        onModify={modifyExercise}
        onReplace={replaceExercise}
      />

      <ConfirmFinishDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        isFullyCompleted={isFullyCompleted}
        onConfirm={handleConfirmFinish}
      />

      <ConfirmCancelDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={cancelSession}
      />
    </div>
  );
}
