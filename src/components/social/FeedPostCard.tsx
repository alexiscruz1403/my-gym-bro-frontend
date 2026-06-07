'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, ChevronLeft, ChevronRight, ClipboardCopy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import { useState, useRef } from 'react';
import { usePostInteraction } from '@/hooks/usePostInteraction';
import { useAuth } from '@/hooks/useAuth';
import { PlanSummaryCard } from './PlanSummaryCard';
import { CopySharedPlanSheet } from './CopySharedPlanSheet';
import type { FeedPost, SessionSummaryExerciseSnapshot } from '@/types/domain.types';

interface FeedPostCardProps {
  post: FeedPost;
  isOwnPost: boolean;
  onCommentOpen: (postId: string, onAdded: () => void) => void;
  highlight?: boolean;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

const EXERCISES_PER_SLIDE = 3;

interface SummarySlideProps {
  exercises: SessionSummaryExerciseSnapshot[];
  durationSeconds: number;
  totalSets: number;
  showHeader: boolean;
}

function SummarySlide({ exercises, durationSeconds, totalSets, showHeader }: SummarySlideProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full shrink-0 snap-center bg-muted/30 p-4 space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('plans.setCount', { count: totalSets })}</span>
          <span>{formatDuration(durationSeconds)}</span>
        </div>
      )}
      {exercises.map((ex, i) => {
        const completedSets = ex.sets.filter((s) => s.completed);
        const isUni = ex.bilateral === false;
        const fmtSide = (side?: { reps?: number; duration?: number; weight?: number } | null, unit?: string) => {
          if (!side) return '—';
          const m =
            side.reps !== undefined
              ? `${side.reps} reps`
              : side.duration !== undefined
                ? `${side.duration}s`
                : '—';
          return side.weight ? `${m} · ${side.weight} ${unit ?? 'kg'}` : m;
        };
        return (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <ExerciseGifThumbnail
                gifUrl={ex.gifUrl}
                exerciseName={ex.exerciseName}
                exerciseId={ex.exerciseId}
              />
              {ex.exerciseId ? (
                <Link
                  href={`/workout/exercises/${ex.exerciseId}`}
                  className="text-sm font-medium hover:underline truncate"
                >
                  {ex.exerciseName}
                </Link>
              ) : (
                <p className="text-sm font-medium">{ex.exerciseName}</p>
              )}
            </div>
            {isUni || completedSets.some((s) => s.left || s.right) ? (
              <div className="text-muted-foreground text-xs space-y-0.5">
                {completedSets.map((s, j) => (
                  <div key={j}>
                    <p className="pl-2">L: {fmtSide(s.left, s.weightUnit)}</p>
                    <p className="pl-2">R: {fmtSide(s.right, s.weightUnit)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-xs space-y-0.5">
                {completedSets.map((s, j) => {
                  const metric =
                    s.durationSeconds !== undefined
                      ? `${s.durationSeconds}s`
                      : `${s.reps ?? 0} reps`;
                  const weight = s.weightKg ? ` · ${s.weightKg} ${s.weightUnit ?? 'kg'}` : '';
                  return <p key={j} className="pl-2">{metric}{weight}</p>;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FeedPostCard({ post, isOwnPost, onCommentOpen, highlight }: FeedPostCardProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { userReacted, reactionsCount, toggle } = usePostInteraction(
    post._id,
    post.userReacted,
    post.reactionsCount,
  );

  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [activeSlide, setActiveSlide] = useState(0);
  const [copySheetOpen, setCopySheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initials = post.author.username.slice(0, 2).toUpperCase();
  const dateLocale = i18n.language === 'en' ? enUS : es;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale });

  const isPlanPost = post.type === 'plan';
  const isSharedOnlyWithMe =
    isPlanPost && post.audience === 'individual' && post.recipientId === user?.id;

  const hasPhoto = !!post.photoUrl;
  const hasSummary = !!post.sessionSummary;

  const exerciseChunks =
    !isPlanPost && hasSummary
      ? chunk(post.sessionSummary!.exercises.filter((ex) => ex.sets.some((s) => s.completed)), EXERCISES_PER_SLIDE)
      : [];

  const slideCount = (hasPhoto ? 1 : 0) + exerciseChunks.length;
  const isCarousel = slideCount > 1;

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveSlide(Math.round(scrollLeft / (clientWidth || 1)));
  }

  function goTo(index: number) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  }

  return (
    <article className={cn(
      'bg-card border-b border-border transition-shadow',
      'lg:rounded-2xl lg:border lg:shadow-sm lg:mb-4 lg:overflow-hidden',
      highlight && 'ring-2 ring-primary ring-inset',
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-3.5 pt-3 pb-2.5">
        <Link href={`/users/${post.author._id}`}>
          <Avatar size="default">
            {post.author.avatar && (
              <AvatarImage src={post.author.avatar} alt={post.author.username} />
            )}
            <AvatarFallback className={cn(isOwnPost && 'bg-primary text-white border-primary')}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/users/${post.author._id}`}
              className="text-sm font-semibold hover:underline truncate"
            >
              {post.author.username}
            </Link>
            {isOwnPost && (
              <Badge variant="secondary" className="shrink-0">{t('feed.yourPost')}</Badge>
            )}
            {isSharedOnlyWithMe && (
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {t('plans.share.sharedOnlyWithYou')}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Plan summary */}
      {isPlanPost && post.planSummary && (
        <div className="px-3.5 pb-2 pt-1">
          <PlanSummaryCard planSummary={post.planSummary} />
        </div>
      )}

      {/* Session media / summary area */}
      {!isPlanPost && isCarousel ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            onScroll={handleScroll}
          >
            {hasPhoto && (
              <div className="relative w-full shrink-0 snap-center aspect-square overflow-hidden">
                <Image
                  src={post.photoUrl!}
                  alt={t('feed.workoutPhoto')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}
            {exerciseChunks.map((chunk, i) => (
              <SummarySlide
                key={i}
                exercises={chunk}
                durationSeconds={post.sessionSummary!.durationSeconds}
                totalSets={post.sessionSummary!.totalSets}
                showHeader={i === 0}
              />
            ))}
          </div>

          {/* Desktop nav buttons */}
          {activeSlide > 0 && (
            <button
              type="button"
              onClick={() => goTo(activeSlide - 1)}
              aria-label={t('feed.prevSlide')}
              className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {activeSlide < slideCount - 1 && (
            <button
              type="button"
              onClick={() => goTo(activeSlide + 1)}
              aria-label={t('feed.nextSlide')}
              className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-[5px]">
            {Array.from({ length: slideCount }, (_, i) => (
              <span
                key={i}
                className={`h-[5px] rounded-full transition-all ${
                  i === activeSlide ? 'w-3.5 bg-white' : 'w-[5px] bg-white/40'
                }`}
                style={{ borderRadius: i === activeSlide ? '3px' : undefined }}
              />
            ))}
          </div>
        </div>
      ) : hasPhoto ? (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={post.photoUrl!}
            alt={t('feed.workoutPhoto')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      ) : hasSummary && exerciseChunks.length > 0 ? (
        <SummarySlide
          exercises={exerciseChunks[0]}
          durationSeconds={post.sessionSummary!.durationSeconds}
          totalSets={post.sessionSummary!.totalSets}
          showHeader
        />
      ) : null}

      {post.caption && (
        <div className="px-3.5 pb-2 pt-4">
          <p className="text-sm">{post.caption}</p>
        </div>
      )}

      <div className="flex items-center px-2 pb-2.5">
        <button
          type="button"
          onClick={toggle}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={userReacted ? 'Remove reaction' : 'React to post'}
        >
          <Heart className={cn('h-[18px] w-[18px]', userReacted && 'fill-destructive text-destructive')} />
          <span className="text-[13px] font-medium">{reactionsCount}</span>
        </button>

        <button
          type="button"
          onClick={() => onCommentOpen(post._id, () => setCommentsCount((n) => n + 1))}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="View comments"
        >
          <MessageCircle className="h-[18px] w-[18px]" />
          <span className="text-[13px] font-medium">{commentsCount}</span>
        </button>

        {isPlanPost && !isOwnPost && (
          <button
            type="button"
            onClick={() => setCopySheetOpen(true)}
            className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t('plans.copyShared.button')}
          >
            <ClipboardCopy className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {isPlanPost && !isOwnPost && post.planSummary && (
        <CopySharedPlanSheet post={post} open={copySheetOpen} onOpenChange={setCopySheetOpen} />
      )}
    </article>
  );
}
