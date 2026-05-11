'use client';

import { useTranslation } from 'react-i18next';
import { LeaderboardRow } from '@/components/ranks/LeaderboardRow';
import { Pagination } from '@/components/shared/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { MuscleGroup } from '@/types/domain.types';

const MUSCLE_VALUES: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'rear_delts', 'triceps', 'biceps',
  'forearms', 'traps', 'lats', 'upper_back', 'lower_back', 'abs', 'obliques',
  'quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves',
];

export function LeaderboardPanel() {
  const { t } = useTranslation();
  const { data, isLoading, error, selectedMuscle, setSelectedMuscle, page, setPage } =
    useLeaderboard();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground shrink-0">{t('ranks.leaderboard.muscle')}</span>
        <select
          value={selectedMuscle ?? ''}
          onChange={(e) =>
            setSelectedMuscle(
              e.target.value ? (e.target.value as MuscleGroup) : undefined,
            )
          }
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">{t('ranks.leaderboard.all')}</option>
          {MUSCLE_VALUES.map((value) => (
            <option key={value} value={value}>
              {t(`exercises.muscle.${value}`)}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState
          title={t('ranks.leaderboard.errorTitle')}
          description={t('ranks.leaderboard.errorDescription')}
        />
      )}

      {!isLoading && !error && data && (
        <div className="space-y-2">
          <LeaderboardRow
            entry={data.self}
            position={0}
            selectedMuscle={selectedMuscle}
          />

          {data.data.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t('ranks.leaderboard.empty')}
            </p>
          )}

          {data.data.map((entry, idx) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              position={idx + 1}
              selectedMuscle={selectedMuscle}
            />
          ))}

          <Pagination
            page={page}
            total={data.meta.total}
            limit={20}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
