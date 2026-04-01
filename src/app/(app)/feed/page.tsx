'use client';

import { useState, useRef } from 'react';
import { UserRoundSearch } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { FeedList } from '@/components/social/FeedList';
import { CommentsSheet } from '@/components/social/CommentsSheet';
import { UserSearchSheet } from '@/components/social/UserSearchSheet';
import { useFeed } from '@/hooks/useFeed';
import useAuthStore from '@/store/auth.store';
import type { FeedFilter } from '@/types/api.types';

export default function FeedPage() {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const { posts, meta, page, isLoading, goToPage } = useFeed(filter);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const onCommentAddedRef = useRef<(() => void) | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  function handleCommentOpen(postId: string, onAdded: () => void) {
    onCommentAddedRef.current = onAdded;
    setActivePostId(postId);
  }

  function handleCommentsClose() {
    onCommentAddedRef.current = null;
    setActivePostId(null);
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl font-semibold">Feed</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          aria-label="Find people to follow"
        >
          <UserRoundSearch className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'mine' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('mine')}
        >
          My posts
        </Button>
      </div>

      <FeedList
        posts={posts}
        meta={meta}
        page={page}
        isLoading={isLoading}
        currentUserId={currentUser?.id ?? null}
        onPageChange={goToPage}
        onCommentOpen={handleCommentOpen}
      />

      <CommentsSheet
        postId={activePostId}
        onClose={handleCommentsClose}
        onCommentAdded={() => onCommentAddedRef.current?.()}
      />

      <UserSearchSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </PageContainer>
  );
}
