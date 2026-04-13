'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  exerciseConfigSchema,
  type ExerciseConfigFormValues,
} from '@/lib/validations/workout-plan.schemas';
import type { ExerciseConfigDraft } from '@/types/ui.types';
import { SupersetGroupSelector } from './SupersetGroupSelector';

interface ExerciseConfigFormProps {
  exerciseName: string;
  defaultValues?: Partial<ExerciseConfigDraft>;
  onSave: (values: Omit<ExerciseConfigDraft, 'exerciseId' | 'exerciseName'>) => void;
  onCancel: () => void;
}

type MetricMode = 'reps' | 'duration';

export function ExerciseConfigForm({
  exerciseName,
  defaultValues,
  onSave,
  onCancel,
}: ExerciseConfigFormProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>(
    defaultValues?.duration !== undefined ? 'duration' : 'reps',
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    defaultValues?.weightUnit ?? 'kg',
  );
  const [supersetGroupId, setSupersetGroupId] = useState(defaultValues?.supersetGroupId ?? '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExerciseConfigFormValues>({
    resolver: zodResolver(exerciseConfigSchema),
    defaultValues: {
      sets: defaultValues?.sets ?? 3,
      reps: defaultValues?.duration !== undefined ? undefined : (defaultValues?.reps ?? 10),
      duration: defaultValues?.duration,
      weight: defaultValues?.weight ?? 0,
      rest: defaultValues?.rest ?? 60,
      notes: defaultValues?.notes,
    },
  });

  // BUG 1 FIX: clear the inactive field from RHF state when switching modes
  // valueAsNumber turns empty inputs into NaN (not undefined), so both fields
  // appear "defined" to the zod refine unless we explicitly unregister them.
  const handleModeSwitch = (mode: MetricMode) => {
    if (mode === 'reps') {
      setValue('duration', undefined);
      setValue('reps', 10);
    } else {
      setValue('reps', undefined);
      setValue('duration', 30);
    }
    setMetricMode(mode);
  };

  const onSubmit = (values: ExerciseConfigFormValues) => {
    onSave({
      sets: values.sets,
      reps: metricMode === 'reps' ? values.reps : undefined,
      duration: metricMode === 'duration' ? values.duration : undefined,
      weight: values.weight,
      weightUnit,
      rest: values.rest,
      notes: values.notes,
      supersetGroupId: supersetGroupId.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <p className="font-medium">{exerciseName}</p>

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
          <label htmlFor="metric" className="text-xs font-medium">
            {metricMode === 'reps' ? 'Reps' : 'Duration (s)'}
          </label>
          {metricMode === 'reps' ? (
            <Input
              id="metric"
              type="number"
              inputMode="numeric"
              min={1}
              className="min-h-11"
              {...register('reps', { valueAsNumber: true })}
            />
          ) : (
            <Input
              id="metric"
              type="number"
              inputMode="numeric"
              min={1}
              className="min-h-11"
              {...register('duration', { valueAsNumber: true })}
            />
          )}
          {errors.reps && (
            <p className="text-destructive text-xs">{errors.reps.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="weight" className="text-xs font-medium">Weight</label>
            <div className="flex overflow-hidden rounded-md border text-xs">
              {(['kg', 'lbs'] as const).map((unit, i) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setWeightUnit(unit)}
                  className={`cursor-pointer px-2 py-0.5 transition-colors ${i > 0 ? 'border-l' : ''} ${
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
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 cursor-pointer">
          Save
        </Button>
      </div>
    </form>
  );
}
