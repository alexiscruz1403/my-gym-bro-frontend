'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionHeader } from './SessionHeader';
import { ExerciseNavigator } from './ExerciseNavigator';
import { ConfirmFinishDialog } from './ConfirmFinishDialog';
import { ConfirmCancelDialog } from './ConfirmCancelDialog';
import { SessionSummary } from './SessionSummary';
import { GlobalRestTimerOverlay } from './GlobalRestTimerOverlay';
import { GlobalCountdownTimerOverlay } from './GlobalCountdownTimerOverlay';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import type { WorkoutSession, ExerciseRankSummaryItem } from '@/types/domain.types';

export function SessionScreen() {
  const router = useRouter();
  const { session, loading, logSet, modifyExercise, replaceExercise, cancelSession, finishSession } = useSession();
  const [finishOpen, setFinishOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [finishedSession, setFinishedSession] = useState<WorkoutSession | null>(null);
  const [rankSummary, setRankSummary] = useState<ExerciseRankSummaryItem[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);

  if (finishedSession) {
    return <SessionSummary session={finishedSession} rankSummary={rankSummary} />;
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

  const hasAnyCompletedSet = session.exercises.some(
    (ex) => ex.sets.some((s) => s.completed),
  );

  // Determine status automatically: completed only if every planned set in
  // every exercise has been logged as completed.
  const isFullyCompleted = session.exercises.every(
    (ex) => ex.sets.filter((s) => s.completed).length >= ex.plannedSets,
  );

  const handleConfirmFinish = async () => {
    const status = isFullyCompleted ? 'completed' : 'partial';
    const result = await finishSession({ status });
    setFinishOpen(false);
    setFinishedSession(result.session);
    setRankSummary(result.rankSummary);
    toast.success(status === 'completed' ? 'Workout completed!' : 'Session saved');
  };

  return (
    <div className="flex h-full flex-col">
      <SessionHeader
        onFinish={() => {
            if (!hasAnyCompletedSet) {
              toast.error('Complete at least one set before finishing.');
              return;
            }
            setFinishOpen(true);
          }}
        onCancel={() => setCancelOpen(true)}
        onToggleCountdown={() => setShowCountdown((v) => !v)}
        countdownActive={showCountdown}
      />
      <GlobalRestTimerOverlay />
      {showCountdown && <GlobalCountdownTimerOverlay onClose={() => setShowCountdown(false)} />}

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
