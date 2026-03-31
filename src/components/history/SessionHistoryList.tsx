import { SessionHistoryCard } from '@/components/history/SessionHistoryCard';
import { Pagination } from '@/components/shared/Pagination';
import type { SessionHistoryItem, PaginatedMeta } from '@/types/domain.types';

interface SessionHistoryListProps {
  data: SessionHistoryItem[];
  meta: PaginatedMeta;
  page: number;
  onPageChange: (page: number) => void;
}

export function SessionHistoryList({
  data,
  meta,
  page,
  onPageChange,
}: SessionHistoryListProps) {
  return (
    <div className="space-y-3">
      {data.map((session) => (
        <SessionHistoryCard key={session._id} session={session} />
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
