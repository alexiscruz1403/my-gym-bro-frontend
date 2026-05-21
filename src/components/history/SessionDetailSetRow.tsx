import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatSide } from '@/lib/set-format';
import type { SessionSet } from '@/types/domain.types';

interface SessionDetailSetRowProps {
  set: SessionSet;
  weightUnit?: 'kg' | 'lbs';
  bilateral?: boolean;
}

export function SessionDetailSetRow({ set, weightUnit, bilateral }: SessionDetailSetRowProps) {
  const { t } = useTranslation();
  const unilateral = bilateral === false || (bilateral === undefined && (set.left || set.right));
  const unit = weightUnit ?? 'kg';

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-2.5 py-1.75',
        set.completed ? 'bg-green-500/8' : 'bg-muted/40',
      )}
    >
      <span
        className={cn(
          'w-6 shrink-0 text-center font-display text-[12px] font-bold',
          set.completed ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground',
        )}
      >
        {set.setIndex + 1}
      </span>

      {unilateral ? (
        <div className="flex-1 space-y-0.5 text-[13px]">
          <p>
            <span className="mr-1 text-[11px] font-medium text-muted-foreground">{t('history.leftAbbr')}</span>
            <span className="font-semibold text-foreground">{formatSide(set.left, unit)}</span>
          </p>
          <p>
            <span className="mr-1 text-[11px] font-medium text-muted-foreground">{t('history.rightAbbr')}</span>
            <span className="font-semibold text-foreground">{formatSide(set.right, unit)}</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-3 text-[13px]">
          {set.weight !== undefined && (
            <span>
              <span className="font-semibold text-foreground">{set.weight}</span>
              <span className="ml-0.5 text-[11px] text-muted-foreground">{unit}</span>
            </span>
          )}
          {set.weight === undefined && set.reps === undefined && set.duration === undefined && (
            <span className="text-[11px] text-muted-foreground">Peso corporal</span>
          )}
          {set.reps !== undefined && (
            <span>
              <span className="font-semibold text-foreground">{set.reps}</span>
              <span className="ml-0.5 text-[11px] text-muted-foreground">reps</span>
            </span>
          )}
          {set.duration !== undefined && (
            <span>
              <span className="font-semibold text-foreground">{set.duration}</span>
              <span className="ml-0.5 text-[11px] text-muted-foreground">s</span>
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
          set.completed ? 'bg-green-500 text-white' : 'bg-border',
        )}
      >
        {set.completed && <Check className="h-3 w-3" strokeWidth={3} />}
      </div>
    </div>
  );
}
