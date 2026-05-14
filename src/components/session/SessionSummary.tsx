'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Dumbbell, BarChart2 } from 'lucide-react';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CreateFeedPostSheet = dynamic(
  () => import('@/components/social/CreateFeedPostSheet').then((m) => m.CreateFeedPostSheet),
  { ssr: false, loading: () => <Skeleton className="h-10 w-full" /> },
);
import type { WorkoutSession, ExerciseRankSummaryItem, RankLevel } from '@/types/domain.types';
import { useSession } from '@/hooks/useSession';
import { getRankColor } from '@/lib/ranks';

interface SessionSummaryProps {
  session: WorkoutSession;
  rankSummary?: ExerciseRankSummaryItem[];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function RankProgressBar({ widthPct, color }: { widthPct: number; color: string }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: animate ? `${widthPct}%` : '0%', backgroundColor: color }}
      />
    </div>
  );
}

export function SessionSummary({ session, rankSummary }: SessionSummaryProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const { clearSessionData } = useSession();
  // Clear session store on unmount regardless of how the user leaves this screen
  useEffect(() => {
    return () => { clearSessionData(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure the viewport width of the clipping container so slides are exact
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setSlideWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const touchStartX = useRef<number | null>(null);
  const hasRanks = rankSummary && rankSummary.length > 0;
  const totalSlides = hasRanks ? 2 : 1;

  const completedExercises = session.exercises.filter(
    (ex) => ex.sets.some((s) => s.completed),
  );
  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0 && slide < totalSlides - 1) setSlide(slide + 1);
      if (delta < 0 && slide > 0) setSlide(slide - 1);
    }
    touchStartX.current = null;
  };

  const actions = (
    <div className="flex flex-col gap-2 pt-2 pb-8">
      {(session.status === 'completed' || session.status === 'partial') && (
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => setShareOpen(true)}
        >
          Share workout
        </Button>
      )}
      <Button className="w-full cursor-pointer" onClick={handleBackToDashboard}>
        Back to dashboard
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Fixed header: icon + title + stats + dots */}
        <div className="flex-shrink-0 px-4 pt-8 pb-4 space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="font-display text-3xl font-bold">
              {session.status === 'completed' ? 'Workout complete!' : 'Session saved'}
            </h1>
            <p className="text-muted-foreground text-sm">Great work. Here&apos;s your summary.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-card p-3 text-center">
              <Clock className="text-primary mx-auto mb-1 h-5 w-5" />
              <p className="font-display text-lg font-bold">
                {formatDuration(session.durationSeconds ?? 0)}
              </p>
              <p className="text-muted-foreground text-xs">Duration</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <Dumbbell className="text-primary mx-auto mb-1 h-5 w-5" />
              <p className="font-display text-lg font-bold">{completedExercises.length}</p>
              <p className="text-muted-foreground text-xs">Exercises</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <BarChart2 className="text-primary mx-auto mb-1 h-5 w-5" />
              <p className="font-display text-lg font-bold">{totalSets}</p>
              <p className="text-muted-foreground text-xs">Sets</p>
            </div>
          </div>

          {/* Dots — only when ranks exist */}
          {hasRanks && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    i === slide ? 'w-5 bg-primary' : 'w-2 bg-muted-foreground/30',
                  )}
                  aria-label={i === 0 ? 'Exercises slide' : 'Ranks slide'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Carousel viewport — clips overflow */}
        <div
          ref={viewportRef}
          className="relative flex-1 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Track — moves horizontally; each slide is exactly slideWidth px wide */}
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              width: slideWidth ? `${slideWidth * totalSlides}px` : '100%',
              transform: slideWidth ? `translateX(-${slide * slideWidth}px)` : 'none',
            }}
          >
            {/* Slide 0 — Exercises */}
            <div
              className="h-full overflow-y-auto px-4"
              style={{ width: slideWidth ? `${slideWidth}px` : '100%' }}
            >
              <div className="space-y-3 pb-4">
                <h2 className="text-sm font-semibold">Exercises</h2>
                {completedExercises.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-6">
                    No completed sets recorded.
                  </p>
                )}
                {completedExercises.map((ex) => {
                  const completedSets = ex.sets.filter((s) => s.completed);
                  return (
                    <div key={ex.exerciseId} className="rounded-xl border bg-card px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ExerciseGifThumbnail
                          gifUrl={ex.gifUrl ?? undefined}
                          exerciseName={ex.exerciseName}
                          exerciseId={ex.exerciseId}
                        />
                        <p className="text-sm font-semibold truncate">{ex.exerciseName}</p>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        {completedSets.map((s, i) => {
                          const unit = ex.weightUnit ?? 'kg';
                          const isUni = ex.bilateral === false;
                          if (isUni || s.left || s.right) {
                            const fmt = (side?: typeof s.left) => {
                              if (!side) return '—';
                              const m =
                                side.reps !== undefined
                                  ? `${side.reps} reps`
                                  : side.duration !== undefined
                                    ? `${side.duration}s`
                                    : '—';
                              return side.weight ? `${m} · ${side.weight} ${unit}` : m;
                            };
                            return (
                              <div key={i} className="text-muted-foreground text-xs">
                                <p>Set {s.setIndex + 1}</p>
                                <p className="pl-3">L: {fmt(s.left)}</p>
                                <p className="pl-3">R: {fmt(s.right)}</p>
                              </div>
                            );
                          }
                          const metric =
                            ex.trackingType === 'duration'
                              ? `${s.duration ?? 0}s`
                              : `${s.reps ?? 0} reps`;
                          const weight = s.weight ? ` · ${s.weight}` : '';
                          return (
                            <p key={i} className="text-muted-foreground text-xs">
                              Set {s.setIndex + 1}: {metric}{weight}{weight && ` ${unit}`}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {actions}
            </div>

            {/* Slide 1 — Rank progress */}
            {hasRanks && (
              <div
                className="h-full overflow-y-auto px-4"
                style={{ width: slideWidth ? `${slideWidth}px` : '100%' }}
              >
                <div className="space-y-3 pb-4">
                  <h2 className="text-sm font-semibold">Rank progress</h2>
                  {rankSummary.map((item) => {
                    const color = getRankColor(item.rankAfter as RankLevel);
                    const widthPct = Math.round((item.rankAfter / 7) * 100);
                    const isRankUp = item.rankBefore !== null && item.rankBefore !== item.rankAfter;
                    const isFirstTime = item.rankBefore === null;
                    return (
                      <div key={item.exerciseId} className="space-y-2 rounded-xl border bg-card px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <ExerciseGifThumbnail
                              gifUrl={item.gifUrl ?? undefined}
                              exerciseName={item.exerciseName}
                              exerciseId={item.exerciseId}
                            />
                            <p className="truncate text-sm font-semibold">{item.exerciseName}</p>
                          </div>
                          {isRankUp && (
                            <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                              Rank up!
                            </span>
                          )}
                          {isFirstTime && (
                            <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              First time!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{isFirstTime ? '—' : item.rankNameBefore}</span>
                          <span>→</span>
                          <span style={{ color }} className="font-semibold">{item.rankNameAfter}</span>
                        </div>
                        <RankProgressBar widthPct={widthPct} color={color} />
                      </div>
                    );
                  })}
                </div>
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {(session.status === 'completed' || session.status === 'partial') && (
        <CreateFeedPostSheet
          session={session}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
