'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminExerciseRow } from './AdminExerciseRow';
import dynamic from 'next/dynamic';

const AdminExerciseForm = dynamic(
  () => import('./AdminExerciseForm').then((m) => m.AdminExerciseForm),
  { ssr: false },
);
import { useAdminExercises } from '@/hooks/useAdminExercises';
import type { Exercise, MuscleGroup } from '@/types/domain.types';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'triceps',
  'lats', 'upper_back', 'rear_delts', 'biceps',
  'forearms', 'traps', 'abs', 'obliques',
  'lower_back', 'quads', 'hamstrings', 'glutes', 'calves',
];

export function AdminExerciseList() {
  const {
    exercises,
    total,
    page,
    isLoading,
    nameSearch,
    primaryMuscle,
    fetchPage,
    handleNameSearch,
    handleMuscleFilter,
    create,
    update,
    remove,
  } = useAdminExercises();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);

  const LIMIT = 20;

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editing) {
      await update(editing.id, formData);
    } else {
      await create(formData);
    }
    handleFormClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={nameSearch}
          onChange={(e) => handleNameSearch(e.target.value)}
          placeholder="Search by name…"
          className="max-w-xs"
        />
        <select
          value={primaryMuscle}
          onChange={(e) => handleMuscleFilter(e.target.value as MuscleGroup | '')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All muscles</option>
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{total} exercises</p>
          <Button size="sm" onClick={() => setFormOpen(true)} className="cursor-pointer min-h-9 gap-1">
            <Plus className="h-4 w-4" />
            New Exercise
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-2">
          {exercises.map((ex) => (
            <AdminExerciseRow key={ex.id} exercise={ex} onEdit={handleEdit} onDelete={remove} />
          ))}
        </div>
      )}

      <Pagination page={page} total={total} limit={LIMIT} onPageChange={fetchPage} />

      <AdminExerciseForm
        open={formOpen}
        exercise={editing}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}
