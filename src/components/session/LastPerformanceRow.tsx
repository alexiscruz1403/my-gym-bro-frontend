'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import type { SessionSet } from '@/types/domain.types';

interface LastPerformanceRowProps {
  sets: SessionSet[];
  plannedSets: number;
}

export function LastPerformanceRow({ sets, plannedSets }: LastPerformanceRowProps) {
  const displaySets = sets.slice(0, plannedSets);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between text-sm"
      >
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <History className="h-3.5 w-3.5" />
          Last time
        </span>
        {expanded ? (
          <ChevronUp className="text-muted-foreground h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1">
          {displaySets.map((s) => {
            const hasSides = s.left || s.right;
            if (hasSides) {
              return (
                <div key={s.setIndex} className="text-muted-foreground text-xs">
                  <span className="font-medium">Set {s.setIndex + 1}</span>
                  <div className="pl-3">
                    <p>L: {s.left?.reps !== undefined ? `${s.left.reps} reps` : s.left?.duration !== undefined ? `${s.left.duration}s` : '—'}{s.left?.weight ? ` · ${s.left.weight} kg` : ''}</p>
                    <p>R: {s.right?.reps !== undefined ? `${s.right.reps} reps` : s.right?.duration !== undefined ? `${s.right.duration}s` : '—'}{s.right?.weight ? ` · ${s.right.weight} kg` : ''}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={s.setIndex} className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="w-12">Set {s.setIndex + 1}</span>
                {s.weight !== undefined && s.weight > 0 && <span>{s.weight} kg</span>}
                {s.reps !== undefined && <span>{s.reps} reps</span>}
                {s.duration !== undefined && <span>{s.duration}s</span>}
                {!s.completed && <span className="text-destructive/70">(incomplete)</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
