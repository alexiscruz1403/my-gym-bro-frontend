'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Dumbbell, BarChart2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const CreateFeedPostSheet = dynamic(
  () => import('@/components/social/CreateFeedPostSheet').then((m) => m.CreateFeedPostSheet),
  { ssr: false, loading: () => <Skeleton className="h-10 w-full" /> },
);
import type { WorkoutSession } from '@/types/domain.types';
import { useSession } from '@/hooks/useSession';

interface SessionSummaryProps {
  session: WorkoutSession;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function SessionSummary({ session }: SessionSummaryProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const { clearSessionData } = useSession();

  const completedExercises = session.exercises.filter(
    (ex) => ex.sets.some((s) => s.completed),
  );
  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );

  const handleBackToDashboard = () => {
    clearSessionData();
    router.push('/dashboard');
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h1 className="font-display text-3xl font-bold">
            {session.status === 'completed' ? 'Workout complete!' : 'Session saved'}
          </h1>
          <p className="text-muted-foreground text-sm">Great work. Here&apos;s your summary.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-card p-3 text-center">
            <Clock className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">
              {formatDuration(session.durationSeconds ?? 0)}
            </p>
            <p className="text-muted-foreground text-xs">Duration</p>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <Dumbbell className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">{completedExercises.length}</p>
            <p className="text-muted-foreground text-xs">Exercises</p>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <BarChart2 className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">{totalSets}</p>
            <p className="text-muted-foreground text-xs">Sets</p>
          </div>
        </div>

        {/* Exercise breakdown */}
        {completedExercises.length > 0 && (
          <div className="space-y-3">
            {completedExercises.map((ex) => {
              const completedSets = ex.sets.filter((s) => s.completed);
              return (
                <div key={ex.exerciseId} className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-sm font-semibold">{ex.exerciseName}</p>
                  <div className="mt-1.5 space-y-0.5">
                    {completedSets.map((s, i) => {
                      const metric =
                        ex.trackingType === 'duration'
                          ? `${s.duration ?? 0}s`
                          : `${s.reps ?? 0} reps`;
                      const weight = s.weight ? ` · ${s.weight}` : '';
                      const weightUnit = ex.weightUnit ? ex.weightUnit : '';
                      return (
                        <p key={i} className="text-muted-foreground text-xs">
                          Set {s.setIndex + 1}: {metric}{weight}{weightUnit && ` ${weightUnit}`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pb-24">
          {(session.status === 'completed' || session.status === 'partial') && (
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setShareOpen(true)}
            >
              Share workout
            </Button>
          )}
          <Button
            className="w-full cursor-pointer"
            onClick={handleBackToDashboard}
          >
            Back to dashboard
          </Button>
        </div>
      </div>

      {(session.status === 'completed' || session.status === 'partial') && (
        <CreateFeedPostSheet
          session={session}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
