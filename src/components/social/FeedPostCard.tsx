'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { usePostInteraction } from '@/hooks/usePostInteraction';
import type { FeedPost, SessionSummarySnapshot } from '@/types/domain.types';

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

function SessionSummarySlide({ summary }: { summary: SessionSummarySnapshot }) {
  const completedExercises = summary.exercises.filter((ex) =>
    ex.sets.some((s) => s.completed),
  );

  return (
    <div className="w-full shrink-0 snap-center overflow-y-auto bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{summary.totalSets} sets</span>
        <span>{formatDuration(summary.durationSeconds)}</span>
      </div>
      {completedExercises.map((ex, i) => {
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
  const isCarousel = hasPhoto && hasSummary;
  const slideCount = isCarousel ? 2 : 0;

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveSlide(Math.round(scrollLeft / clientWidth));
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

      {/* Media area */}
      {isCarousel ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            onScroll={handleScroll}
          >
            {/* Slide 1: photo */}
            <div className="relative w-full shrink-0 snap-center aspect-square overflow-hidden">
              <Image
                src={post.photoUrl!}
                alt="Workout photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            {/* Slide 2: summary */}
            <SessionSummarySlide summary={post.sessionSummary!} />
          </div>
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
      ) : hasSummary ? (
        <SessionSummarySlide summary={post.sessionSummary!} />
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
          <Heart
            className={userReacted ? 'fill-destructive text-destructive' : ''}
          />
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
