'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSet } from '@/types/domain.types';

interface SetRowProps {
  setIndex: number;
  plannedReps?: number;
  plannedWeight?: number;
  loggedSet?: SessionSet;
  onComplete: (setIndex: number, weight: number | undefined, reps: number | undefined) => void;
}

export function SetRow({ setIndex, plannedReps, plannedWeight, loggedSet, onComplete }: SetRowProps) {
  const [weight, setWeight] = useState<string>(
    String(loggedSet?.weight ?? plannedWeight ?? 0),
  );
  const [reps, setReps] = useState<string>(
    String(loggedSet?.reps ?? plannedReps ?? 0),
  );

  const isCompleted = loggedSet?.completed ?? false;

  const handleComplete = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    onComplete(setIndex, isNaN(w) ? undefined : w, isNaN(r) ? undefined : r);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isCompleted ? 'bg-primary/10' : 'bg-muted/30',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 text-center text-sm font-medium',
          isCompleted ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {setIndex + 1}
      </span>

      <div className="flex flex-1 items-center gap-2">
        <div className="flex-1 space-y-0.5">
          <label className="text-muted-foreground text-xs">kg</label>
          <Input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isCompleted}
            className="min-h-11 text-center"
            min={0}
            step={0.5}
          />
        </div>
        <div className="flex-1 space-y-0.5">
          <label className="text-muted-foreground text-xs">reps</label>
          <Input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={isCompleted}
            className="min-h-11 text-center"
            min={0}
          />
        </div>
      </div>

      <Button
        size="icon"
        variant={isCompleted ? 'default' : 'outline'}
        onClick={handleComplete}
        disabled={isCompleted}
        className={cn('h-11 w-11 shrink-0 cursor-pointer', isCompleted && 'cursor-default')}
        aria-label={isCompleted ? 'Set completed' : 'Mark set as complete'}
      >
        <Check className="h-5 w-5" />
      </Button>
    </div>
  );
}
