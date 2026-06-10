'use client';

import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import type { Exercise } from '@/types/domain.types';

interface AddExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (exercises: Exercise[]) => void;
}

export function AddExerciseSheet({ open, onOpenChange, onConfirm }: AddExerciseSheetProps) {
  const { t } = useTranslation();

  const handleConfirm = (exercises: Exercise[]) => {
    if (exercises.length > 0) {
      onConfirm(exercises);
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="flex max-h-[88vh] flex-col gap-0 rounded-t-[20px] border-0 pt-0"
        style={{ background: 'var(--sheet-bg)' }}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-0 h-1 w-10 shrink-0 rounded-full bg-border" />

        {/* Header */}
        <div className="shrink-0 border-b border-border px-[18px] pb-3.5 pt-2">
          <SheetTitle className="font-display mt-1.5 text-[19px] font-bold tracking-[0.02em] text-foreground">
            {t('session.addExercise.title')}
          </SheetTitle>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" onConfirm={handleConfirm} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
