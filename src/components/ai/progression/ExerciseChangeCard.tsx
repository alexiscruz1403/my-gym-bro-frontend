'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ExerciseChange, ProgressionChangeType } from '@/types/domain.types';

const CHANGE_CONFIG: Record<
  ProgressionChangeType,
  { label: string; icon: React.ElementType; color: string; badgeClass: string }
> = {
  weight_increase: {
    label: 'Aumento de peso',
    icon: TrendingUp,
    color: 'text-green-500',
    badgeClass: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  weight_decrease: {
    label: 'Reducción de peso',
    icon: TrendingDown,
    color: 'text-red-500',
    badgeClass: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
  weight_maintain: {
    label: 'Sin cambios',
    icon: Minus,
    color: 'text-muted-foreground',
    badgeClass: 'bg-muted text-muted-foreground border-border',
  },
  sets_change: {
    label: 'Cambio de series',
    icon: Zap,
    color: 'text-blue-500',
    badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  reps_change: {
    label: 'Cambio de reps',
    icon: Zap,
    color: 'text-purple-500',
    badgeClass: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  deload: {
    label: 'Descarga',
    icon: TrendingDown,
    color: 'text-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
};

interface ExerciseChangeCardProps {
  change: ExerciseChange;
}

export function ExerciseChangeCard({ change }: ExerciseChangeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = CHANGE_CONFIG[change.changeType];
  const Icon = config.icon;

  const showWeightDiff = change.newWeight !== change.previousWeight;
  const showSetsDiff = change.newSets !== change.previousSets;
  const showRepsDiff = change.newReps !== change.previousReps;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5 flex-shrink-0', config.color)}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{change.exerciseName}</p>
            <Badge
              variant="outline"
              className={cn('mt-1 text-[10px] px-1.5 py-0 border', config.badgeClass)}
            >
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Before → After */}
        <div className="grid grid-cols-3 gap-2">
          {showWeightDiff && (
            <StatDiff
              label="Peso"
              before={`${change.previousWeight}kg`}
              after={`${change.newWeight}kg`}
              positive={change.newWeight > change.previousWeight}
            />
          )}
          {showSetsDiff && (
            <StatDiff
              label="Series"
              before={String(change.previousSets)}
              after={String(change.newSets)}
              positive={change.newSets >= change.previousSets}
            />
          )}
          {showRepsDiff && (
            <StatDiff
              label="Reps"
              before={String(change.previousReps)}
              after={String(change.newReps)}
              positive={change.newReps >= change.previousReps}
            />
          )}
        </div>

        {/* Reasoning (collapsible) */}
        {change.reasoning && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  expanded && 'rotate-180',
                )}
              />
              {expanded ? 'Ocultar razonamiento' : 'Ver razonamiento'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-muted pl-3"
                >
                  {change.reasoning}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function StatDiff({
  label,
  before,
  after,
  positive,
}: {
  label: string;
  before: string;
  after: string;
  positive: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/40 p-2 text-center">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-xs line-through text-muted-foreground">{before}</span>
      <span
        className={cn(
          'text-sm font-bold',
          positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
        )}
      >
        {after}
      </span>
    </div>
  );
}
