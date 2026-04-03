'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Exercise, TrackingType, LoadType } from '@/types/domain.types';

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
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setTrackingType(exercise.trackingType);
      setLoadType(exercise.loadType);
    } else {
      setName('');
      setTrackingType('reps');
      setLoadType('barbell');
    }
  }, [exercise, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onSubmit({ name: name.trim(), trackingType, loadType });
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

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={busy} className="w-full">
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
