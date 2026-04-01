'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { FeedPostCard } from '@/components/social/FeedPostCard';
import type { FeedPost } from '@/types/domain.types';

function FeedSkeletons() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  );
}

interface FeedListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FeedListProps {
  posts: FeedPost[];
  meta: FeedListMeta | null;
  page: number;
  isLoading: boolean;
  currentUserId: string | null;
  onPageChange: (n: number) => void;
  onCommentOpen: (postId: string, onAdded: () => void) => void;
}

export function FeedList({
  posts,
  meta,
  page,
  isLoading,
  currentUserId,
  onPageChange,
  onCommentOpen,
}: FeedListProps) {
  if (isLoading) return <FeedSkeletons />;

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Your feed is empty"
        description="Follow other users to see their workouts here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedPostCard
          key={post._id}
          post={post}
          isOwnPost={currentUserId !== null && post.author._id === currentUserId}
          onCommentOpen={onCommentOpen}
        />
      ))}

      {meta && (
        <Pagination
          page={page}
          total={meta.total}
          limit={meta.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
