'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { UserRoundSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { FeedList } from '@/components/social/FeedList';
import { CommentsSheet } from '@/components/social/CommentsSheet';
import { UserSearchSheet } from '@/components/social/UserSearchSheet';
import { useFeed } from '@/hooks/useFeed';
import useAuthStore from '@/store/auth.store';
import type { FeedFilter } from '@/types/api.types';

export default function FeedPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const { posts, meta, page, isLoading, goToPage, refresh } = useFeed(filter);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [highlightPostId, setHighlightPostId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const onCommentAddedRef = useRef<(() => void) | null>(null);
  const currentUser = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const postId = searchParams.get('post');
    const openComments = searchParams.get('comments') === '1';
    if (!postId) return;
    setHighlightPostId(postId);
    if (openComments) {
      onCommentAddedRef.current = null;
      setActivePostId(postId);
    }
    router.replace(pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (!highlightPostId || isLoading) return;
    const el = document.getElementById(`feed-post-${highlightPostId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timeout = setTimeout(() => setHighlightPostId(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [highlightPostId, isLoading, posts]);

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
        <h1 className="font-display text-xl font-semibold">{t('feed.title')}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="min-h-11 min-w-11 cursor-pointer"
          aria-label={t('feed.searchAriaLabel')}
        >
          <UserRoundSearch className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="min-h-11 cursor-pointer"
        >
          {t('feed.filter.all')}
        </Button>
        <Button
          variant={filter === 'mine' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('mine')}
          className="min-h-11 cursor-pointer"
        >
          {t('feed.filter.mine')}
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
        highlightPostId={highlightPostId}
      />

      <CommentsSheet
        postId={activePostId}
        onClose={handleCommentsClose}
        onCommentAdded={() => onCommentAddedRef.current?.()}
      />

      <UserSearchSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onFollowed={refresh}
      />
    </PageContainer>
  );
}
