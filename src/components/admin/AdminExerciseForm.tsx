'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Exercise, MuscleGroup, TrackingType, LoadType } from '@/types/domain.types';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'triceps',
  'lats', 'upper_back', 'rear_delts', 'biceps',
  'forearms', 'traps', 'abs', 'obliques',
  'lower_back', 'quads', 'hamstrings', 'glutes', 'calves',
];

interface AdminExerciseFormProps {
  open: boolean;
  exercise: Exercise | null;
  onSubmit: (dto: Partial<Exercise>) => Promise<void>;
  onClose: () => void;
}

export function AdminExerciseForm({ open, exercise, onSubmit, onClose }: AdminExerciseFormProps) {
  const [name, setName] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('reps');
  const [loadType, setLoadType] = useState<LoadType>('barbell');
  const [musclesPrimary, setMusclesPrimary] = useState<MuscleGroup[]>([]);
  const [musclesSecondary, setMusclesSecondary] = useState<MuscleGroup[]>([]);
  const [bilateral, setBilateral] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setTrackingType(exercise.trackingType);
      setLoadType(exercise.loadType);
      setMusclesPrimary(exercise.musclesPrimary);
      setMusclesSecondary(exercise.musclesSecondary);
      setBilateral(exercise.bilateral);
    } else {
      setName('');
      setTrackingType('reps');
      setLoadType('barbell');
      setMusclesPrimary([]);
      setMusclesSecondary([]);
      setBilateral(true);
    }
  }, [exercise, open]);

  const toggleMuscle = (muscle: MuscleGroup, list: 'primary' | 'secondary') => {
    if (list === 'primary') {
      setMusclesPrimary((prev) =>
        prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
      );
    } else {
      setMusclesSecondary((prev) =>
        prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || musclesPrimary.length === 0) return;
    setBusy(true);
    try {
      await onSubmit({ name: name.trim(), trackingType, loadType, musclesPrimary, musclesSecondary, bilateral });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{exercise ? 'Edit Exercise' : 'New Exercise'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ex-name">Name</Label>
            <Input
              id="ex-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barbell Squat"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ex-tracking">Tracking Type</Label>
            <select
              id="ex-tracking"
              value={trackingType}
              onChange={(e) => setTrackingType(e.target.value as TrackingType)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="reps">Reps</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ex-load">Load Type</Label>
            <select
              id="ex-load"
              value={loadType}
              onChange={(e) => setLoadType(e.target.value as LoadType)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cable">Cable</option>
              <option value="kettlebell">Kettlebell</option>
              <option value="resistance_band">Resistance Band</option>
            </select>
          </div>

          {/* Bilateral toggle */}
          <div className="space-y-1.5">
            <Label>Movement</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBilateral(true)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  bilateral
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground'
                }`}
              >
                Bilateral
              </button>
              <button
                type="button"
                onClick={() => setBilateral(false)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  !bilateral
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground'
                }`}
              >
                Unilateral
              </button>
            </div>
          </div>

          {/* Primary muscles */}
          <div className="space-y-1.5">
            <Label>Primary Muscles <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const isPrimary = musclesPrimary.includes(muscle);
                const isSecondary = musclesSecondary.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle, 'primary')}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      isPrimary
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isSecondary
                        ? 'border-input bg-muted text-muted-foreground opacity-50'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    {muscle.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary muscles */}
          <div className="space-y-1.5">
            <Label>Secondary Muscles <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const isPrimary = musclesPrimary.includes(muscle);
                const isSecondary = musclesSecondary.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle, 'secondary')}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      isSecondary
                        ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        : isPrimary
                        ? 'border-input bg-muted text-muted-foreground opacity-50'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    {muscle.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={busy || musclesPrimary.length === 0} className="w-full">
              {exercise ? 'Save Changes' : 'Create Exercise'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
