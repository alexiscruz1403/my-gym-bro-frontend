import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedLoading() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-16 rounded-lg" />
        <Skeleton className="h-11 w-11 rounded-lg" />
      </div>
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-11 w-16 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </PageContainer>
  );
}
