'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { UserRoundSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
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

  const searchAction = (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      aria-label={t('feed.searchAriaLabel')}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <UserRoundSearch className="h-5 w-5" />
    </button>
  );

  return (
    <>
      <PageHeader title={t('feed.title')} action={searchAction} />
      <PageContainer>
      <div className="flex gap-2 mb-4">
        {(['all', 'mine'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'h-8 cursor-pointer rounded-full border-[1.5px] px-3.5 text-[13px] font-medium transition-all',
              filter === f
                ? 'border-primary bg-primary font-semibold text-white'
                : 'border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {t(f === 'all' ? 'feed.filter.all' : 'feed.filter.mine')}
          </button>
        ))}
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
    </>
  );
}
