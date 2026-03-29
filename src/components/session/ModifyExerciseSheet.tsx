'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SessionExercise } from '@/types/domain.types';
import type { ModifyExerciseRequest } from '@/types/api.types';

interface ModifyExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: SessionExercise;
  onSave: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
}

export function ModifyExerciseSheet({
  open,
  onOpenChange,
  exercise,
  onSave,
}: ModifyExerciseSheetProps) {
  const [weight, setWeight] = useState(String(exercise.plannedWeight ?? 0));
  const [reps, setReps] = useState(String(exercise.plannedReps ?? ''));
  const [rest, setRest] = useState(String(exercise.plannedRest));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dto: ModifyExerciseRequest = {};
      const w = parseFloat(weight);
      const r = parseInt(reps, 10);
      const rs = parseInt(rest, 10);
      if (!isNaN(w)) dto.plannedWeight = w;
      if (!isNaN(r)) dto.plannedReps = r;
      if (!isNaN(rs)) dto.plannedRest = rs;
      await onSave(exercise.exerciseId, dto);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Modify — {exercise.exerciseName}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-2">
          <p className="text-muted-foreground text-xs">
            Changes apply to this session only. Your plan is not affected.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="mod-weight" className="text-xs font-medium">Weight (kg)</label>
              <Input
                id="mod-weight"
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={0}
                step={0.5}
                className="min-h-11"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mod-reps" className="text-xs font-medium">Reps</label>
              <Input
                id="mod-reps"
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min={1}
                className="min-h-11"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mod-rest" className="text-xs font-medium">Rest (s)</label>
              <Input
                id="mod-rest"
                type="number"
                inputMode="numeric"
                value={rest}
                onChange={(e) => setRest(e.target.value)}
                min={0}
                className="min-h-11"
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 cursor-pointer">
            {saving ? 'Saving…' : 'Apply'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
