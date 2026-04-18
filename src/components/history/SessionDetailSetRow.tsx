import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSide } from '@/lib/set-format';
import type { SessionSet } from '@/types/domain.types';

interface SessionDetailSetRowProps {
  set: SessionSet;
  weightUnit?: 'kg' | 'lbs';
  bilateral?: boolean;
}

export function SessionDetailSetRow({ set, weightUnit, bilateral }: SessionDetailSetRowProps) {
  const unilateral = bilateral === false || (bilateral === undefined && (set.left || set.right));
  const unit = weightUnit ?? 'kg';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg px-3 py-2',
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

      {unilateral ? (
        <div className="flex-1 space-y-0.5 text-sm">
          <p>
            <span className="text-muted-foreground mr-1 text-xs font-medium">L</span>
            <span>{formatSide(set.left, unit)}</span>
          </p>
          <p>
            <span className="text-muted-foreground mr-1 text-xs font-medium">R</span>
            <span>{formatSide(set.right, unit)}</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-4 text-sm">
          {set.weight !== undefined && (
            <span>
              <span className="font-medium">{set.weight}</span>
              <span className="text-muted-foreground ml-0.5">{unit}</span>
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
      )}

      <Check
        className={cn(
          'mt-1 h-4 w-4 shrink-0',
          set.completed ? 'text-primary' : 'text-muted-foreground/30',
        )}
      />
    </div>
  );
}
