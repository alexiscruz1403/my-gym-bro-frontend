'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import type { Exercise } from '@/types/domain.types';

interface ReplaceExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercise: Exercise) => void;
}

export function ReplaceExerciseSheet({ open, onOpenChange, onSelect }: ReplaceExerciseSheetProps) {
  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[88vh] flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle>Replace exercise</SheetTitle>
          <SheetDescription>
            Choose an exercise from the catalog to swap in for this slot.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" onSelect={handleSelect} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
