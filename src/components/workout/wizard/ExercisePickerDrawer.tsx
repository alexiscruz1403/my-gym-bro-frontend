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
  onSelect: (exercises: Exercise[]) => void;
}

export function ExercisePickerDrawer({
  open,
  onOpenChange,
  onSelect,
}: ExercisePickerDrawerProps) {
  const handleConfirm = (exercises: Exercise[]) => {
    onSelect(exercises);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Exercises</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" onConfirm={handleConfirm} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
