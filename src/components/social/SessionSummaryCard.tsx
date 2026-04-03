'use client';

import { useState } from 'react';
import { Clock, Dumbbell, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSummarySnapshot } from '@/types/domain.types';

interface SessionSummaryCardProps {
  summary: SessionSummarySnapshot;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function SessionSummaryCard({ summary }: SessionSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1">
          <Clock className="text-primary h-4 w-4" />
          <p className="font-display text-base font-bold tabular-nums">
            {formatDuration(summary.durationSeconds)}
          </p>
          <p className="text-muted-foreground text-xs">Duration</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Dumbbell className="text-primary h-4 w-4" />
          <p className="font-display text-base font-bold tabular-nums">{summary.totalSets}</p>
          <p className="text-muted-foreground text-xs">Sets</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <BarChart2 className="text-primary h-4 w-4" />
          <p className="font-display text-base font-bold tabular-nums">
            {summary.volumeKg.toLocaleString()} kg
          </p>
          <p className="text-muted-foreground text-xs">Volume</p>
        </div>
      </div>

      {summary.exercises.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between text-xs text-muted-foreground"
        >
          <span>{summary.exercises.length} exercises</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      )}

      {expanded && (
        <div className="space-y-1.5">
          {summary.exercises.map((ex, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{ex.name}</p>
              <p className="text-muted-foreground text-xs">
                {ex.sets
                  .filter((s) => s.completed)
                  .map((s, j) => {
                    if (s.reps !== undefined && s.weightKg !== undefined) {
                      return `${s.reps}×${s.weightKg}kg`;
                    }
                    if (s.reps !== undefined) return `${s.reps} reps`;
                    return `set ${j + 1}`;
                  })
                  .join(' · ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
