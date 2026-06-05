'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSessionStore from '@/store/session.store';
import type { ExerciseSide, SessionSet } from '@/types/domain.types';

export interface SetCompletePayload {
  weight?: number;
  reps?: number;
  left?: ExerciseSide;
  right?: ExerciseSide;
}

interface SetRowProps {
  exerciseId: string;
  setIndex: number;
  bilateral: boolean;
  plannedMinReps?: number;
  plannedReps?: number;
  plannedWeight?: number;
  plannedLeft?: ExerciseSide | null;
  plannedRight?: ExerciseSide | null;
  weightUnit: 'kg' | 'lbs';
  loggedSet?: SessionSet;
  onComplete: (setIndex: number, payload: SetCompletePayload) => void;
  onUncomplete: (setIndex: number, payload: SetCompletePayload) => void;
}

interface SideInputs {
  weight: string;
  reps: string;
}

function parseSide(state: SideInputs): ExerciseSide {
  const w = parseFloat(state.weight);
  const r = parseInt(state.reps, 10);
  const result: ExerciseSide = {};
  if (!isNaN(r)) result.reps = r;
  if (!isNaN(w) && w > 0) result.weight = w;
  return result;
}

export function SetRow({
  exerciseId,
  setIndex,
  bilateral,
  plannedMinReps,
  plannedReps,
  plannedWeight,
  plannedLeft,
  plannedRight,
  weightUnit,
  loggedSet,
  onComplete,
  onUncomplete,
}: SetRowProps) {
  const { t } = useTranslation();
  const draftKey = `${exerciseId}:${setIndex}`;
  const draft = useSessionStore((s) => s.pendingSetInputs[draftKey]);
  const setPendingSetInput = useSessionStore((s) => s.setPendingSetInput);
  const clearPendingSetInput = useSessionStore((s) => s.clearPendingSetInput);

  const [weight, setWeightRaw] = useState<string>(
    draft?.weight ?? String(loggedSet?.weight ?? plannedWeight ?? 0),
  );
  const [reps, setRepsRaw] = useState<string>(
    draft?.reps ?? String(loggedSet?.reps ?? plannedReps ?? 0),
  );
  const [leftInputs, setLeftInputsRaw] = useState<SideInputs>(() => ({
    weight: draft?.leftWeight ?? String(loggedSet?.left?.weight ?? plannedLeft?.weight ?? 0),
    reps: draft?.leftReps ?? String(loggedSet?.left?.reps ?? plannedLeft?.reps ?? 0),
  }));
  const [rightInputs, setRightInputsRaw] = useState<SideInputs>(() => ({
    weight: draft?.rightWeight ?? String(loggedSet?.right?.weight ?? plannedRight?.weight ?? 0),
    reps: draft?.rightReps ?? String(loggedSet?.right?.reps ?? plannedRight?.reps ?? 0),
  }));

  const isCompleted = loggedSet?.completed ?? false;

  const setWeight = (v: string) => {
    setWeightRaw(v);
    setPendingSetInput(draftKey, { ...draft, weight: v });
  };
  const setReps = (v: string) => {
    setRepsRaw(v);
    setPendingSetInput(draftKey, { ...draft, reps: v });
  };
  const setLeftInputs = (next: SideInputs) => {
    setLeftInputsRaw(next);
    setPendingSetInput(draftKey, { ...draft, leftWeight: next.weight, leftReps: next.reps });
  };
  const setRightInputs = (next: SideInputs) => {
    setRightInputsRaw(next);
    setPendingSetInput(draftKey, { ...draft, rightWeight: next.weight, rightReps: next.reps });
  };

  const handleComplete = () => {
    clearPendingSetInput(draftKey);
    if (bilateral) {
      const w = parseFloat(weight);
      const r = parseInt(reps, 10);
      onComplete(setIndex, {
        weight: isNaN(w) ? undefined : w,
        reps: isNaN(r) ? undefined : r,
      });
    } else {
      onComplete(setIndex, {
        left: parseSide(leftInputs),
        right: parseSide(rightInputs),
      });
    }
  };

  const handleUncomplete = () => {
    clearPendingSetInput(draftKey);
    if (bilateral) {
      const w = parseFloat(weight);
      const r = parseInt(reps, 10);
      onUncomplete(setIndex, {
        weight: isNaN(w) ? undefined : w,
        reps: isNaN(r) ? undefined : r,
      });
    } else {
      onUncomplete(setIndex, {
        left: parseSide(leftInputs),
        right: parseSide(rightInputs),
      });
    }
  };

  const completeButton = isCompleted ? (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleUncomplete}
      className="h-11 w-11 shrink-0 cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80"
      aria-label="Undo set completion"
    >
      <Undo2 className="h-5 w-5" />
    </Button>
  ) : (
    <Button
      size="icon"
      variant="outline"
      onClick={handleComplete}
      className="h-11 w-11 shrink-0 cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent"
      aria-label="Mark set as complete"
    >
      <Check className="h-5 w-5" />
    </Button>
  );

  if (!bilateral) {
    const renderSideRow = (
      label: string,
      state: SideInputs,
      setState: (next: SideInputs) => void,
      planned: ExerciseSide | null | undefined,
    ) => (
      <div className="flex items-center gap-2">
        <span className="w-6 shrink-0 text-center text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex flex-1 items-start gap-2">
          <div className="flex-1 space-y-0.5">
            <label className="block text-center text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.04em]">{weightUnit}</label>
            <Input
              type="number"
              inputMode="decimal"
              value={state.weight}
              onChange={(e) => setState({ ...state, weight: e.target.value })}
              disabled={isCompleted}
              className="min-h-11 text-center font-display font-bold"
              min={0}
              step={0.5}
            />
          </div>
          <div className="flex-1 space-y-0.5">
            <label className="block text-center text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.04em]">reps</label>
            <Input
              type="number"
              inputMode="numeric"
              value={state.reps}
              onChange={(e) => setState({ ...state, reps: e.target.value })}
              disabled={isCompleted}
              className="min-h-11 text-center font-display font-bold"
              min={0}
            />
            {(planned?.minReps !== undefined || planned?.reps !== undefined) && (
              <p className="text-center text-[10px] text-muted-foreground tabular-nums">
                {planned.minReps !== undefined && planned.reps !== undefined && planned.reps !== planned.minReps
                  ? `${planned.minReps} – ${planned.reps}`
                  : (planned.minReps ?? planned.reps)}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
          isCompleted ? 'bg-accent/10' : 'bg-muted/30',
        )}
      >
        <span
          className={cn(
            'w-8 shrink-0 text-center text-sm font-medium',
            isCompleted ? 'text-accent' : 'text-muted-foreground',
          )}
        >
          {setIndex + 1}
        </span>
        <div className="flex flex-1 flex-col gap-2">
          {renderSideRow(t('session.setRow.leftAbbr'), leftInputs, setLeftInputs, plannedLeft)}
          {renderSideRow(t('session.setRow.rightAbbr'), rightInputs, setRightInputs, plannedRight)}
        </div>
        {completeButton}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isCompleted ? 'bg-accent/10' : 'bg-muted/30',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 text-center text-sm font-medium',
          isCompleted ? 'text-accent' : 'text-muted-foreground',
        )}
      >
        {setIndex + 1}
      </span>

      <div className="flex flex-1 items-start gap-2">
        <div className="flex-1 space-y-0.5">
          <label className="block text-center text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.04em]">{weightUnit}</label>
          <Input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isCompleted}
            className="min-h-11 text-center font-display font-bold"
            min={0}
            step={0.5}
          />
        </div>
        <div className="flex-1 space-y-0.5">
          <label className="block text-center text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.04em]">reps</label>
          <Input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={isCompleted}
            className="min-h-11 text-center font-display font-bold"
            min={0}
          />
          {(plannedMinReps !== undefined || plannedReps !== undefined) && (
            <p className="text-center text-[10px] text-muted-foreground tabular-nums">
              {plannedMinReps !== undefined && plannedReps !== undefined && plannedReps !== plannedMinReps
                ? `${plannedMinReps} – ${plannedReps}`
                : (plannedMinReps ?? plannedReps)}
            </p>
          )}
        </div>
      </div>

      {completeButton}
    </div>
  );
}
