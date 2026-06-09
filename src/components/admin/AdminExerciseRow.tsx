'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import type { AdminExercise } from '@/types/domain.types';

interface AdminExerciseRowProps {
  exercise: AdminExercise;
  onEdit: (exercise: AdminExercise) => void;
  onDelete: (id: string) => Promise<void>;
}

export function AdminExerciseRow({ exercise, onEdit, onDelete }: AdminExerciseRowProps) {
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    try { await onDelete(exercise.id); } finally { setBusy(false); }
  };

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-sm">
      <ExerciseGifThumbnail
        gifUrl={exercise.gifUrl}
        exerciseName={exercise.name.en}
        exerciseId={exercise.id}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-foreground truncate">{exercise.name.en}</p>
        <p className="text-[11px] text-muted-foreground truncate">{exercise.name.es}</p>
        <div className="flex gap-1 flex-wrap mt-1.25">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border">
            {exercise.trackingType}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border">
            {exercise.loadType}
          </span>
          {exercise.musclesPrimary.slice(0, 2).map((m) => (
            <span key={m} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border capitalize">
              {m.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(exercise)}
          className="w-8 h-8 rounded-lg border border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer flex items-center justify-center transition-colors"
          title="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg border border-border bg-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer flex items-center justify-center transition-colors disabled:opacity-50"
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
