'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExerciseHistorySetRow } from '@/components/history/ExerciseHistorySetRow';
import type { ExerciseHistorySession } from '@/types/domain.types';

const DAY_LABEL: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface ExerciseHistorySessionRowProps {
  session: ExerciseHistorySession;
}

export function ExerciseHistorySessionRow({ session }: ExerciseHistorySessionRowProps) {
  const [expanded, setExpanded] = useState(false);
  const completedSets = session.sets.filter((s) => s.completed).length;

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left min-h-11"
      >
        <div>
          <p className="text-sm font-medium">
            {DAY_LABEL[session.dayOfWeek]} · {formatDate(session.sessionDate)}
          </p>
          <p className="text-muted-foreground text-xs">
            {completedSets}/{session.sets.length} series
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
      </button>

      {expanded && session.sets.length > 0 && (
        <div className="border-t px-1 py-1.5">
          {session.sets.map((set) => (
            <ExerciseHistorySetRow key={set.setIndex} set={set} />
          ))}
        </div>
      )}
    </div>
  );
}
