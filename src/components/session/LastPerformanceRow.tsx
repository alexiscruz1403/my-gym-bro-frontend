'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import type { SessionSet } from '@/types/domain.types';

interface LastPerformanceRowProps {
  sets: SessionSet[];
}

export function LastPerformanceRow({ sets }: LastPerformanceRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between text-sm"
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
          {sets.map((s) => (
            <div key={s.setIndex} className="text-muted-foreground flex items-center gap-3 text-xs">
              <span className="w-12">Set {s.setIndex + 1}</span>
              {s.weight !== undefined && s.weight > 0 && <span>{s.weight} kg</span>}
              {s.reps !== undefined && <span>{s.reps} reps</span>}
              {s.duration !== undefined && <span>{s.duration}s</span>}
              {!s.completed && <span className="text-destructive/70">(incomplete)</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
