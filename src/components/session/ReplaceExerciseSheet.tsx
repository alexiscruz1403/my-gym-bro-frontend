'use client';

import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import type { Exercise } from '@/types/domain.types';

interface ReplaceExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercise: Exercise) => void;
}

export function ReplaceExerciseSheet({ open, onOpenChange, onSelect }: ReplaceExerciseSheetProps) {
  const { t } = useTranslation();

  const handleConfirm = (exercises: Exercise[]) => {
    if (exercises[0]) {
      onSelect(exercises[0]);
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
            {t('session.replaceExercise.title')}
          </SheetTitle>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" singleSelect onConfirm={handleConfirm} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
