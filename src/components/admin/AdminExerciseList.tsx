'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminExerciseRow } from './AdminExerciseRow';
import dynamic from 'next/dynamic';

const AdminExerciseForm = dynamic(
  () => import('./AdminExerciseForm').then((m) => m.AdminExerciseForm),
  { ssr: false },
);
import { useAdminExercises } from '@/hooks/useAdminExercises';
import type { Exercise } from '@/types/domain.types';

export function AdminExerciseList() {
  const { exercises, total, page, isLoading, fetchPage, create, update, remove } = useAdminExercises();
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

  const handleFormSubmit = async (dto: Partial<Exercise>) => {
    if (editing) {
      await update(editing.id, dto);
    } else {
      await create(dto);
    }
    handleFormClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} exercises in catalog</p>
        <Button size="sm" onClick={() => setFormOpen(true)} className="cursor-pointer min-h-9 gap-1">
          <Plus className="h-4 w-4" />
          New Exercise
        </Button>
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
