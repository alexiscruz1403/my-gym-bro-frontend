'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { MuscleGroup, LoadType } from '@/types/domain.types';

const MUSCLE_OPTIONS: { value: MuscleGroup; label: string }[] = [
  { value: 'chest', label: 'Chest' },
  { value: 'lats', label: 'Lats' },
  { value: 'upper_back', label: 'Upper Back' },
  { value: 'traps', label: 'Traps' },
  { value: 'front_delts', label: 'Front Delts' },
  { value: 'side_delts', label: 'Side Delts' },
  { value: 'rear_delts', label: 'Rear Delts' },
  { value: 'biceps', label: 'Biceps' },
  { value: 'triceps', label: 'Triceps' },
  { value: 'forearms', label: 'Forearms' },
  { value: 'core', label: 'Core' },
  { value: 'quads', label: 'Quads' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'calves', label: 'Calves' },
  { value: 'hip_flexors', label: 'Hip Flexors' },
  { value: 'adductors', label: 'Adductors' },
];

const LOAD_TYPE_OPTIONS: { value: LoadType; label: string }[] = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'machine', label: 'Machine' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'cable', label: 'Cable' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'resistance_band', label: 'Band' },
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
  const hasActiveFilters = value.muscle !== undefined || value.loadType !== undefined;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search exercises..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-9"
        />
        {value.search && (
          <button
            onClick={() => onChange({ ...value, search: '' })}
            className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-1">
          {LOAD_TYPE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={value.loadType === opt.value ? 'default' : 'outline'}
              onClick={() =>
                onChange({
                  ...value,
                  loadType: value.loadType === opt.value ? undefined : opt.value,
                })
              }
              className="shrink-0 cursor-pointer"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-1">
          {MUSCLE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={value.muscle === opt.value ? 'default' : 'outline'}
              onClick={() =>
                onChange({
                  ...value,
                  muscle: value.muscle === opt.value ? undefined : opt.value,
                })
              }
              className="shrink-0 cursor-pointer"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => onChange({ ...value, muscle: undefined, loadType: undefined })}
          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
        >
          <X className="h-3 w-3" />
          Clear filters
        </button>
      )}
    </div>
  );
}
