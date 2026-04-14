import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSet } from '@/types/domain.types';

interface SessionDetailSetRowProps {
  set: SessionSet;
  weightUnit?: 'kg' | 'lbs';
}

export function SessionDetailSetRow({ set, weightUnit }: SessionDetailSetRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2',
        set.completed ? 'bg-primary/10' : 'bg-muted/30',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 text-center text-sm font-medium',
          set.completed ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {set.setIndex + 1}
      </span>

      <div className="flex flex-1 items-center gap-4 text-sm">
        {set.weight !== undefined && (
          <span>
            <span className="font-medium">{set.weight}</span>
            <span className="text-muted-foreground ml-0.5">{weightUnit ?? 'kg'}</span>
          </span>
        )}
        {set.reps !== undefined && (
          <span>
            <span className="font-medium">{set.reps}</span>
            <span className="text-muted-foreground ml-0.5">reps</span>
          </span>
        )}
        {set.duration !== undefined && (
          <span>
            <span className="font-medium">{set.duration}</span>
            <span className="text-muted-foreground ml-0.5">s</span>
          </span>
        )}
      </div>

      <Check
        className={cn(
          'h-4 w-4 shrink-0',
          set.completed ? 'text-primary' : 'text-muted-foreground/30',
        )}
      />
    </div>
  );
}
