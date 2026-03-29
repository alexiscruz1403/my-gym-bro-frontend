'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import type { Exercise } from '@/types/domain.types';

interface ExercisePickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercise: Exercise) => void;
}

export function ExercisePickerDrawer({
  open,
  onOpenChange,
  onSelect,
}: ExercisePickerDrawerProps) {
  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Exercise</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" onSelect={handleSelect} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
