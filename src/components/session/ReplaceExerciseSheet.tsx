'use client';

import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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
      <SheetContent side="bottom" className="flex max-h-[88vh] flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle>{t('session.replaceExercise.title')}</SheetTitle>
          <SheetDescription>
            {t('session.replaceExercise.description')}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ExerciseCatalog mode="picker" singleSelect onConfirm={handleConfirm} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
