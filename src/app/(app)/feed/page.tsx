'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FeedList } from '@/components/social/FeedList';
import { CommentsSheet } from '@/components/social/CommentsSheet';
import { useFeed } from '@/hooks/useFeed';

export default function FeedPage() {
  const { posts, meta, page, isLoading, goToPage } = useFeed();
  const [activePostId, setActivePostId] = useState<string | null>(null);

  return (
    <PageContainer>
      <FeedList
        posts={posts}
        meta={meta}
        page={page}
        isLoading={isLoading}
        onPageChange={goToPage}
        onCommentOpen={setActivePostId}
      />

      <CommentsSheet
        postId={activePostId}
        onClose={() => setActivePostId(null)}
      />
    </PageContainer>
  );
}
