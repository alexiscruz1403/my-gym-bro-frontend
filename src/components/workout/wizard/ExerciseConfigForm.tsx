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
      rest: values.rest,
      notes: values.notes,
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
          <label className="text-xs font-medium">Sets</label>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            {...register('sets', { valueAsNumber: true })}
          />
          {errors.sets && (
            <p className="text-destructive text-xs">{errors.sets.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">
            {metricMode === 'reps' ? 'Reps' : 'Duration (s)'}
          </label>
          {metricMode === 'reps' ? (
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              {...register('reps', { valueAsNumber: true })}
            />
          ) : (
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              {...register('duration', { valueAsNumber: true })}
            />
          )}
          {errors.reps && (
            <p className="text-destructive text-xs">{errors.reps.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Weight (kg)</label>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            {...register('weight', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Rest (s)</label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            {...register('rest', { valueAsNumber: true })}
          />
          {errors.rest && (
            <p className="text-destructive text-xs">{errors.rest.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Notes (optional)</label>
        <Input {...register('notes')} placeholder="e.g. Focus on form" />
      </div>

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
