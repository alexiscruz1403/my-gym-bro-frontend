'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { usePostInteraction } from '@/hooks/usePostInteraction';
import type { FeedPost, SessionSummaryExerciseSnapshot } from '@/types/domain.types';

interface FeedPostCardProps {
  post: FeedPost;
  isOwnPost: boolean;
  onCommentOpen: (postId: string, onAdded: () => void) => void;
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

const EXERCISES_PER_SLIDE = 4;

interface SummarySlideProps {
  exercises: SessionSummaryExerciseSnapshot[];
  durationSeconds: number;
  totalSets: number;
  showHeader: boolean;
}

function SummarySlide({ exercises, durationSeconds, totalSets, showHeader }: SummarySlideProps) {
  return (
    <div className="w-full shrink-0 snap-center bg-muted/30 p-4 space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{totalSets} sets</span>
          <span>{formatDuration(durationSeconds)}</span>
        </div>
      )}
      {exercises.map((ex, i) => {
        const completedSets = ex.sets.filter((s) => s.completed);
        return (
          <div key={i} className="space-y-0.5">
            <p className="text-sm font-medium">{ex.name}</p>
            <p className="text-muted-foreground text-xs">
              {completedSets
                .map((s) => {
                  const metric =
                    s.durationSeconds !== undefined
                      ? `${s.durationSeconds}s`
                      : `${s.reps ?? 0} reps`;
                  const weight = s.weightKg ? ` · ${s.weightKg} kg` : '';
                  return `${metric}${weight}`;
                })
                .join(' · ')}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function FeedPostCard({ post, isOwnPost, onCommentOpen }: FeedPostCardProps) {
  const { userReacted, reactionsCount, toggle } = usePostInteraction(
    post._id,
    post.userReacted,
    post.reactionsCount,
  );

  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initials = post.author.username.slice(0, 2).toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const hasPhoto = !!post.photoUrl;
  const hasSummary = !!post.sessionSummary;

  const exerciseChunks = hasSummary
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href={`/users/${post.author._id}`}>
            <Avatar size="default">
              {post.author.avatar && (
                <AvatarImage src={post.author.avatar} alt={post.author.username} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/users/${post.author._id}`}
                className="text-sm font-semibold hover:underline truncate"
              >
                {post.author.username}
              </Link>
              {isOwnPost && (
                <Badge variant="secondary" className="shrink-0">Your post</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>

      {/* Media / summary area */}
      {isCarousel ? (
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
                  alt="Workout photo"
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
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {activeSlide < slideCount - 1 && (
            <button
              type="button"
              onClick={() => goTo(activeSlide + 1)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {Array.from({ length: slideCount }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === activeSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      ) : hasPhoto ? (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={post.photoUrl!}
            alt="Workout photo"
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
        <CardContent>
          <p className="text-sm">{post.caption}</p>
        </CardContent>
      )}

      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="flex items-center gap-1.5 min-h-11"
          aria-label={userReacted ? 'Remove reaction' : 'React to post'}
        >
          <Heart className={userReacted ? 'fill-destructive text-destructive' : ''} />
          <span className="text-sm">{reactionsCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCommentOpen(post._id, () => setCommentsCount((n) => n + 1))}
          className="flex items-center gap-1.5 min-h-11"
          aria-label="View comments"
        >
          <MessageCircle />
          <span className="text-sm">{commentsCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
