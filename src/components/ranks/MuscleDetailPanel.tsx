'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RankBadge } from '@/components/ranks/RankBadge';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import { useExerciseCatalog } from '@/hooks/useExerciseCatalog';
import type { MuscleRankItem, ExerciseRankItem } from '@/types/domain.types';

const MUSCLE_LABEL: Record<string, string> = {
  chest: 'Pecho',
  front_delts: 'Deltoides ant.',
  side_delts: 'Deltoides lat.',
  triceps: 'Tríceps',
  lats: 'Dorsales',
  upper_back: 'Espalda alta',
  rear_delts: 'Deltoides post.',
  biceps: 'Bíceps',
  forearms: 'Antebrazos',
  traps: 'Trapecios',
  abs: 'Abdominales',
  obliques: 'Oblicuos',
  lower_back: 'Lumbar',
  quads: 'Cuádriceps',
  hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos',
  calves: 'Gemelos',
  adductors: 'Aductores',
  abductors: 'Abductores',
};

function ExerciseRankRow({ ex }: { ex: ExerciseRankItem }) {
  const { data: catalogExercise } = useExerciseCatalog(ex.exerciseId);
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-[10px_12px]">
      <ExerciseGifThumbnail
        gifUrl={catalogExercise?.gifUrl}
        exerciseName={ex.exerciseName}
        exerciseId={ex.exerciseId}
      />
      <Link
        href={`/workout/exercises/${ex.exerciseId}`}
        className="min-w-0 flex-1 truncate text-[13.5px] font-semibold hover:underline"
      >
        {ex.exerciseName}
      </Link>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-[12px] text-muted-foreground tabular-nums">
          {ex.bestValue.toLocaleString('es', { maximumFractionDigits: 1 })}
        </span>
        <RankBadge rank={ex.rank} size="sm" />
      </div>
    </div>
  );
}

interface MuscleDetailPanelProps {
  item: MuscleRankItem | null;
  open: boolean;
  onClose: () => void;
}

export function MuscleDetailPanel({ item, open, onClose }: MuscleDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-[20px] border-0 p-0"
        style={{ background: 'var(--sheet-bg)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />

        {item ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-[18px] pt-2 pb-[14px]">
              <div>
                <SheetTitle className="font-display text-[20px] font-bold tracking-[0.02em]">
                  {MUSCLE_LABEL[item.muscle] ?? item.muscle}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Ejercicios y ranks del músculo seleccionado
                </SheetDescription>
                <RankBadge rank={item.rank} />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto px-4 py-2.5 pb-5 [scrollbar-width:none]">
              {item.exercises.length === 0 ? (
                <p className="py-2 text-[13px] text-muted-foreground">
                  Sin ejercicios registrados para este músculo.
                </p>
              ) : (
                item.exercises.map((ex) => <ExerciseRankRow key={ex.exerciseId} ex={ex} />)
              )}
            </div>
          </>
        ) : (
          <>
            <SheetTitle className="sr-only">Músculo sin datos</SheetTitle>
            <SheetDescription className="sr-only">Sin datos para este músculo</SheetDescription>
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <span className="text-3xl">💪</span>
              <p className="text-[14px] font-semibold text-foreground">Sin registros aún</p>
              <p className="text-[13px] text-muted-foreground leading-[1.55]">
                Completa sesiones con ejercicios de este músculo para obtener un rango.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
