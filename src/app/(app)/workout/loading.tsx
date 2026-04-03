import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkoutLoading() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <Skeleton className="mb-4 h-5 w-44 rounded-md" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </PageContainer>
  );
}
