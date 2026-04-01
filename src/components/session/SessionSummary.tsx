'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Dumbbell, BarChart2 } from 'lucide-react';
import { CreateFeedPostSheet } from '@/components/social/CreateFeedPostSheet';
import type { SessionSummary as SessionSummaryType } from '@/types/domain.types';

interface SessionSummaryProps {
  summary: SessionSummaryType;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function SessionSummary({ summary }: SessionSummaryProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <div className="space-y-2">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="font-display text-3xl font-bold">
            {summary.status === 'completed' ? 'Workout complete!' : 'Session saved'}
          </h1>
          <p className="text-muted-foreground text-sm">Great work. Here&apos;s your summary.</p>
        </div>

        <div className="grid w-full max-w-xs grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-3 text-center">
            <Clock className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">{formatDuration(summary.durationSeconds)}</p>
            <p className="text-muted-foreground text-xs">Duration</p>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <Dumbbell className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">{summary.exercisesCompleted}</p>
            <p className="text-muted-foreground text-xs">Exercises</p>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <BarChart2 className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-lg font-bold">{summary.totalSetsLogged}</p>
            <p className="text-muted-foreground text-xs">Sets</p>
          </div>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-2">
          {(summary.status === 'completed' || summary.status === 'partial') && (
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
            onClick={() => router.push('/dashboard')}
          >
            Back to dashboard
          </Button>
        </div>
      </div>

      {(summary.status === 'completed' || summary.status === 'partial') && (
        <CreateFeedPostSheet
          sessionId={summary._id}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
