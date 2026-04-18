import { ExerciseHistorySessionRow } from '@/components/history/ExerciseHistorySessionRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ExerciseHistorySession, PaginatedMeta } from '@/types/domain.types';

interface ExerciseHistoryListProps {
  data: ExerciseHistorySession[];
  meta: PaginatedMeta;
  bilateral?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function ExerciseHistoryList({
  data,
  meta,
  bilateral,
  page,
  onPageChange,
}: ExerciseHistoryListProps) {
  return (
    <div className="space-y-2">
      {data.map((session) => (
        <ExerciseHistorySessionRow
          key={session.sessionId}
          session={session}
          bilateral={bilateral}
        />
      ))}

      <Pagination
        page={page}
        total={meta.total}
        limit={meta.limit}
        onPageChange={onPageChange}
      />
    </div>
  );
}
