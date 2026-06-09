'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminExerciseRow } from './AdminExerciseRow';
import dynamic from 'next/dynamic';

const AdminExerciseForm = dynamic(
  () => import('./AdminExerciseForm').then((m) => m.AdminExerciseForm),
  { ssr: false },
);
import { useAdminExercises } from '@/hooks/useAdminExercises';
import type { AdminExercise, MuscleGroup } from '@/types/domain.types';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'triceps',
  'lats', 'upper_back', 'rear_delts', 'biceps',
  'forearms', 'traps', 'abs', 'obliques',
  'lower_back', 'quads', 'hamstrings', 'glutes', 'calves',
];

const LIMIT = 20;

export function AdminExerciseList() {
  const { t } = useTranslation();
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
  const [editing, setEditing] = useState<AdminExercise | null>(null);

  const muscleLabels = t('exercises.muscle', { returnObjects: true }) as Record<MuscleGroup, string>;

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleEdit = (exercise: AdminExercise) => {
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

  const selectCls = 'h-10 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] px-2.5 outline-none cursor-pointer focus:border-primary transition-colors';

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={nameSearch}
            onChange={(e) => handleNameSearch(e.target.value)}
            placeholder={t('admin.exercises.searchPlaceholder')}
            className="w-full h-10 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] pl-9 pr-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
          />
        </div>
        <select
          value={primaryMuscle}
          onChange={(e) => handleMuscleFilter(e.target.value as MuscleGroup | '')}
          className={selectCls}
        >
          <option value="">{t('admin.exercises.allMuscles')}</option>
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>{muscleLabels[m]}</option>
          ))}
        </select>
      </div>

      {/* Section head */}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-display text-[15px] font-semibold text-foreground tracking-[0.01em]">
          {t('admin.exercises.exerciseCount', { count: total })}
        </span>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="h-9 px-3.5 bg-primary text-primary-foreground border-none rounded-xl text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.75 w-3.75" />
          {t('admin.exercises.newExercise')}
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
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
