'use client';

import { useState } from 'react';
import { UserRoundSearch } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { FeedList } from '@/components/social/FeedList';
import { CommentsSheet } from '@/components/social/CommentsSheet';
import { UserSearchSheet } from '@/components/social/UserSearchSheet';
import { useFeed } from '@/hooks/useFeed';

export default function FeedPage() {
  const { posts, meta, page, isLoading, goToPage } = useFeed();
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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

      <UserSearchSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </PageContainer>
  );
}
