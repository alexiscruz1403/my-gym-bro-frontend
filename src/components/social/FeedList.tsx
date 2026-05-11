'use client';

import { useTranslation } from 'react-i18next';
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
  highlightPostId?: string | null;
}

export function FeedList({
  posts,
  meta,
  page,
  isLoading,
  currentUserId,
  onPageChange,
  onCommentOpen,
  highlightPostId,
}: FeedListProps) {
  const { t } = useTranslation();

  if (isLoading) return <FeedSkeletons />;

  if (posts.length === 0) {
    return (
      <EmptyState
        title={t('feed.empty.title')}
        description={t('feed.empty.description')}
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id} id={`feed-post-${post._id}`}>
          <FeedPostCard
            post={post}
            isOwnPost={currentUserId !== null && post.author._id === currentUserId}
            onCommentOpen={onCommentOpen}
            highlight={highlightPostId === post._id}
          />
        </div>
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
