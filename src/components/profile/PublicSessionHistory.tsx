'use client';

import { format } from 'date-fns';
import { Clock, Dumbbell, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePublicSessionHistory } from '@/hooks/usePublicSessionHistory';
import { useState } from 'react';
import type { PublicSessionHistoryItem } from '@/types/domain.types';

interface SessionHistoryRowProps {
  item: PublicSessionHistoryItem;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function SessionHistoryRow({ item }: SessionHistoryRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{item.planName}</p>
          <p className="text-muted-foreground text-xs">
            {format(new Date(item.startedAt), 'MMM d, yyyy')}
          </p>
        </div>
        <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(item.durationSeconds)}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Dumbbell className="h-3.5 w-3.5" />
          {item.totalSetsLogged} sets
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <BarChart2 className="h-3.5 w-3.5" />
          {item.volumeKg.toLocaleString()} kg
        </span>
      </div>

      {item.exercises.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between text-xs text-muted-foreground"
          >
            <span>{item.exercises.length} exercises</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="space-y-2">
              {item.exercises.map((ex, i) => {
                const completedSets = ex.sets.filter((s) => s.completed);
                return (
                  <div key={i} className="space-y-0.5">
                    <p className="text-xs font-medium">{ex.exerciseName}</p>
                    {completedSets.map((s, j) => {
                      const metric = s.durationSeconds !== undefined && s.durationSeconds !== null ? `${s.durationSeconds}s` : `${s.reps ?? 0} reps`;
                      const weight = s.weightKg ? ` · ${s.weightKg} kg` : '';
                      return (
                        <p key={j} className="text-xs text-muted-foreground pl-2">
                          Set {s.setIndex + 1}: {metric}{weight}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface PublicSessionHistoryProps {
  userId: string;
}

export function PublicSessionHistory({ userId }: PublicSessionHistoryProps) {
  const { sessions, meta, page, isLoading, error, goToPage } = usePublicSessionHistory(userId);

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) return null;

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions yet"
        description="This user hasn't logged any sessions."
      />
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h2 className="font-display text-lg font-bold">Session History</h2>
      {sessions.map((item) => (
        <SessionHistoryRow key={item._id} item={item} />
      ))}
      {meta && (
        <Pagination page={page} total={meta.total} limit={meta.limit} onPageChange={goToPage} />
      )}
    </div>
  );
}
