'use client';

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { MuscleGroup, LoadType } from '@/types/domain.types';

const LOAD_TYPE_VALUES: LoadType[] = [
  'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell', 'resistance_band',
];

const MUSCLE_VALUES: MuscleGroup[] = [
  'chest', 'lats', 'upper_back', 'traps', 'front_delts', 'side_delts', 'rear_delts',
  'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'lower_back',
  'quads', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors',
];

export interface ExerciseFiltersValue {
  search: string;
  muscle: MuscleGroup | undefined;
  loadType: LoadType | undefined;
}

interface ExerciseFiltersProps {
  value: ExerciseFiltersValue;
  onChange: (value: ExerciseFiltersValue) => void;
}

export function ExerciseFilters({ value, onChange }: ExerciseFiltersProps) {
  const { t } = useTranslation();
  const muscleLabels = t('exercises.muscle', { returnObjects: true }) as Record<MuscleGroup, string>;
  const loadTypeLabels = t('exercises.loadType', { returnObjects: true }) as Record<LoadType, string>;

  const hasActiveFilters = value.muscle !== undefined || value.loadType !== undefined;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder={t('exercises.searchPlaceholder')}
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-9 cursor-text"
        />
        {value.search && (
          <button
            onClick={() => onChange({ ...value, search: '' })}
            className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            aria-label={t('exercises.clearSearch')}
            type="button"
            tabIndex={0}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-visible md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:block">
        <div className="flex flex-nowrap gap-2 pb-1 md:flex-wrap">
          {LOAD_TYPE_VALUES.map((lt) => (
            <Button
              key={lt}
              size="sm"
              variant={value.loadType === lt ? 'default' : 'outline'}
              onClick={() =>
                onChange({
                  ...value,
                  loadType: value.loadType === lt ? undefined : lt,
                })
              }
              className="shrink-0 cursor-pointer"
              type="button"
              tabIndex={0}
            >
              {loadTypeLabels[lt]}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-visible md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:block">
        <div className="flex flex-nowrap gap-2 pb-1 md:flex-wrap">
          {MUSCLE_VALUES.map((muscle) => (
            <Button
              key={muscle}
              size="sm"
              variant={value.muscle === muscle ? 'default' : 'outline'}
              onClick={() =>
                onChange({
                  ...value,
                  muscle: value.muscle === muscle ? undefined : muscle,
                })
              }
              className="shrink-0 cursor-pointer"
              type="button"
              tabIndex={0}
            >
              {muscleLabels[muscle]}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => onChange({ ...value, muscle: undefined, loadType: undefined })}
          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
          type="button"
          tabIndex={0}
        >
          <X className="h-3 w-3" />
          {t('exercises.clearFilters')}
        </button>
      )}
    </div>
  );
}
