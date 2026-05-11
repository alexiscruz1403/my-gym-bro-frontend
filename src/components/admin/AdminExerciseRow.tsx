'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Exercise } from '@/types/domain.types';

interface AdminExerciseRowProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: string) => Promise<void>;
}

export function AdminExerciseRow({ exercise, onEdit, onDelete }: AdminExerciseRowProps) {
  const [busy, setBusy] = useState(false);
  const { i18n } = useTranslation();
  const displayName = exercise.name[i18n.language as 'es' | 'en'] ?? exercise.name.en;

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(exercise.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{displayName}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">{exercise.trackingType}</Badge>
          <Badge variant="secondary" className="text-xs">{exercise.loadType}</Badge>
          {exercise.musclesPrimary.slice(0, 2).map((m) => (
            <Badge key={m} variant="outline" className="text-xs capitalize">
              {m.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={() => onEdit(exercise)} className="cursor-pointer min-h-9 text-xs">
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={busy}
          onClick={handleDelete}
          className="min-h-9 text-xs cursor-pointer"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
