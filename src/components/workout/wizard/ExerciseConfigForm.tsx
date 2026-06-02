'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  exerciseConfigSchema,
  type ExerciseConfigFormValues,
} from '@/lib/validations/workout-plan.schemas';
import type { ExerciseConfigDraft } from '@/types/ui.types';
import type { ExerciseSide } from '@/types/domain.types';
import { SupersetGroupSelector } from './SupersetGroupSelector';

interface ExerciseConfigFormProps {
  exerciseName: string;
  bilateral: boolean;
  defaultValues?: Partial<ExerciseConfigDraft>;
  onSave: (values: Omit<ExerciseConfigDraft, 'exerciseId' | 'exerciseName'>) => void;
  onCancel: () => void;
}

type MetricMode = 'reps' | 'duration';

interface SideState {
  minReps: string;
  maxReps: string;
  duration: string;
  weight: string;
}

function initialSideState(side: ExerciseSide | null | undefined, mode: MetricMode): SideState {
  return {
    minReps: mode === 'reps' ? String(side?.minReps ?? 10) : '',
    maxReps: mode === 'reps' ? String(side?.maxReps ?? '') : '',
    duration: mode === 'duration' ? String(side?.duration ?? 30) : '',
    weight: String(side?.weight ?? 0),
  };
}

function parseSide(state: SideState, mode: MetricMode): ExerciseSide {
  const weight = parseFloat(state.weight);
  const result: ExerciseSide = {};
  if (mode === 'reps') {
    const min = parseInt(state.minReps, 10);
    const max = parseInt(state.maxReps, 10);
    if (!isNaN(min)) result.minReps = min;
    if (!isNaN(max)) result.maxReps = max;
  } else {
    const d = parseInt(state.duration, 10);
    if (!isNaN(d)) result.duration = d;
  }
  if (!isNaN(weight) && weight > 0) result.weight = weight;
  return result;
}

export function ExerciseConfigForm({
  exerciseName,
  bilateral,
  defaultValues,
  onSave,
  onCancel,
}: ExerciseConfigFormProps) {
  const initialMetric: MetricMode =
    (defaultValues?.duration !== undefined && defaultValues?.duration !== null) ||
    (defaultValues?.left?.duration !== undefined && defaultValues?.left?.duration !== null) ||
    (defaultValues?.right?.duration !== undefined && defaultValues?.right?.duration !== null)
      ? 'duration'
      : 'reps';

  const [metricMode, setMetricMode] = useState<MetricMode>(initialMetric);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    defaultValues?.weightUnit ?? 'kg',
  );
  const [supersetGroupId, setSupersetGroupId] = useState(defaultValues?.supersetGroupId ?? '');

  const [leftState, setLeftState] = useState<SideState>(
    initialSideState(defaultValues?.left, initialMetric),
  );
  const [rightState, setRightState] = useState<SideState>(
    initialSideState(defaultValues?.right, initialMetric),
  );
  const [sideError, setSideError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExerciseConfigFormValues>({
    resolver: zodResolver(exerciseConfigSchema),
    defaultValues: {
      sets: defaultValues?.sets ?? 3,
      minReps:
        bilateral && defaultValues?.duration === undefined
          ? (defaultValues?.minReps ?? 10)
          : undefined,
      maxReps:
        bilateral && defaultValues?.duration === undefined
          ? (defaultValues?.maxReps ?? undefined)
          : undefined,
      duration: bilateral ? defaultValues?.duration : undefined,
      weight: bilateral ? (defaultValues?.weight ?? 0) : undefined,
      rest: defaultValues?.rest ?? 60,
      notes: defaultValues?.notes,
      left: !bilateral ? defaultValues?.left ?? undefined : undefined,
      right: !bilateral ? defaultValues?.right ?? undefined : undefined,
    },
  });

  useEffect(() => {
    if (bilateral) return;
    setValue('left', parseSide(leftState, metricMode));
    setValue('right', parseSide(rightState, metricMode));
  }, [bilateral, leftState, rightState, metricMode, setValue]);

  const handleModeSwitch = (mode: MetricMode) => {
    if (bilateral) {
      if (mode === 'reps') {
        setValue('duration', undefined);
        setValue('minReps', 10);
        setValue('maxReps', undefined);
      } else {
        setValue('minReps', undefined);
        setValue('maxReps', undefined);
        setValue('duration', 30);
      }
    } else {
      setLeftState((s) =>
        mode === 'reps'
          ? { ...s, minReps: s.minReps || '10', maxReps: s.maxReps || '', duration: '' }
          : { ...s, duration: s.duration || '30', minReps: '', maxReps: '' },
      );
      setRightState((s) =>
        mode === 'reps'
          ? { ...s, minReps: s.minReps || '10', maxReps: s.maxReps || '', duration: '' }
          : { ...s, duration: s.duration || '30', minReps: '', maxReps: '' },
      );
    }
    setMetricMode(mode);
  };

  const onSubmit = (values: ExerciseConfigFormValues) => {
    setSideError(null);

    if (bilateral) {
      onSave({
        sets: values.sets,
        minReps: metricMode === 'reps' ? values.minReps : undefined,
        maxReps: metricMode === 'reps' ? values.maxReps : undefined,
        duration: metricMode === 'duration' ? values.duration : undefined,
        weight: values.weight,
        weightUnit,
        rest: values.rest,
        notes: values.notes,
        supersetGroupId: supersetGroupId.trim() || undefined,
        bilateral: true,
      });
      return;
    }

    const left = parseSide(leftState, metricMode);
    const right = parseSide(rightState, metricMode);
    const metricKey = metricMode === 'reps' ? 'minReps' : 'duration';
    if (left[metricKey] === undefined || right[metricKey] === undefined) {
      setSideError(
        metricMode === 'reps'
          ? 'Both sides require a reps value'
          : 'Both sides require a duration value',
      );
      return;
    }

    onSave({
      sets: values.sets,
      weightUnit,
      rest: values.rest,
      notes: values.notes,
      supersetGroupId: supersetGroupId.trim() || undefined,
      bilateral: false,
      left,
      right,
    });
  };

  const renderSidePanel = (label: string, state: SideState, setState: (next: SideState) => void) => (
    <div className="rounded-lg border p-3 space-y-2">
      <p className="text-xs font-medium">{label}</p>
      {metricMode === 'reps' ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Min Reps</label>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              className="min-h-11"
              value={state.minReps}
              onChange={(e) => setState({ ...state, minReps: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Max Reps (optional)</label>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              className="min-h-11"
              placeholder="—"
              value={state.maxReps}
              onChange={(e) => setState({ ...state, maxReps: e.target.value })}
            />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] text-muted-foreground">Weight ({weightUnit})</label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              className="min-h-11"
              placeholder="0"
              value={state.weight}
              onChange={(e) => setState({ ...state, weight: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Duration (s)</label>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              className="min-h-11"
              value={state.duration}
              onChange={(e) => setState({ ...state, duration: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Weight ({weightUnit})</label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              className="min-h-11"
              placeholder="0"
              value={state.weight}
              onChange={(e) => setState({ ...state, weight: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <p className="font-medium">
        {exerciseName}
        {!bilateral && (
          <span className="ml-2 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            Unilateral
          </span>
        )}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeSwitch('reps')}
          className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm transition-colors ${
            metricMode === 'reps'
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Reps
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('duration')}
          className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm transition-colors ${
            metricMode === 'duration'
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Duration (s)
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Unit</span>
        <div className="flex overflow-hidden rounded-md border text-xs">
          {(['kg', 'lbs'] as const).map((unit, i) => (
            <button
              key={unit}
              type="button"
              onClick={() => setWeightUnit(unit)}
              className={`cursor-pointer px-4 py-2 transition-colors ${i > 0 ? 'border-l' : ''} ${
                weightUnit === unit
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {bilateral ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="sets" className="text-xs font-medium">Sets</label>
              <Input
                id="sets"
                type="number"
                inputMode="numeric"
                min={1}
                className="min-h-11"
                {...register('sets', { valueAsNumber: true })}
              />
              {errors.sets && (
                <p className="text-destructive text-xs">{errors.sets.message}</p>
              )}
            </div>

            {metricMode === 'reps' ? (
              <div className="space-y-1">
                <label htmlFor="minReps" className="text-xs font-medium">Min Reps</label>
                <Input
                  id="minReps"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className="min-h-11"
                  {...register('minReps', { valueAsNumber: true })}
                />
                {errors.minReps && (
                  <p className="text-destructive text-xs">{errors.minReps.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <label htmlFor="duration" className="text-xs font-medium">Duration (s)</label>
                <Input
                  id="duration"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className="min-h-11"
                  {...register('duration', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {metricMode === 'reps' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="maxReps" className="text-xs font-medium">Max Reps <span className="text-muted-foreground font-normal">(optional)</span></label>
                <Input
                  id="maxReps"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className="min-h-11"
                  placeholder="—"
                  {...register('maxReps', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="weight" className="text-xs font-medium">Weight</label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.5}
                  className="min-h-11"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {metricMode === 'duration' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="weight" className="text-xs font-medium">Weight</label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.5}
                  className="min-h-11"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="rest" className="text-xs font-medium">Rest (s)</label>
                <Input
                  id="rest"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className="min-h-11"
                  {...register('rest', { valueAsNumber: true })}
                />
                {errors.rest && (
                  <p className="text-destructive text-xs">{errors.rest.message}</p>
                )}
              </div>
            </div>
          )}

          {metricMode === 'reps' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="rest" className="text-xs font-medium">Rest (s)</label>
                <Input
                  id="rest"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className="min-h-11"
                  {...register('rest', { valueAsNumber: true })}
                />
                {errors.rest && (
                  <p className="text-destructive text-xs">{errors.rest.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="sets" className="text-xs font-medium">Sets</label>
              <Input
                id="sets"
                type="number"
                inputMode="numeric"
                min={1}
                className="min-h-11"
                {...register('sets', { valueAsNumber: true })}
              />
              {errors.sets && (
                <p className="text-destructive text-xs">{errors.sets.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="rest" className="text-xs font-medium">Rest (s)</label>
              <Input
                id="rest"
                type="number"
                inputMode="numeric"
                min={0}
                className="min-h-11"
                {...register('rest', { valueAsNumber: true })}
              />
              {errors.rest && (
                <p className="text-destructive text-xs">{errors.rest.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {renderSidePanel('Lado izquierdo', leftState, setLeftState)}
            {renderSidePanel('Lado derecho', rightState, setRightState)}
            {sideError && <p className="text-destructive text-xs">{sideError}</p>}
          </div>
        </>
      )}

      <div className="space-y-1">
        <label htmlFor="notes" className="text-xs font-medium">Notes (optional)</label>
        <Input id="notes" {...register('notes')} placeholder="e.g. Focus on form" className="min-h-11" />
      </div>

      <SupersetGroupSelector value={supersetGroupId} onChange={setSupersetGroupId} />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 cursor-pointer h-11"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 cursor-pointer h-11">
          Save
        </Button>
      </div>
    </form>
  );
}
