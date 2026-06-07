'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import { cn } from '@/lib/utils';
import type { PlanSummaryDto, PlanSummaryDayDto, PlanSummaryExerciseDto } from '@/types/domain.types';

interface PlanSummaryCardProps {
  planSummary: PlanSummaryDto;
}

function formatExerciseDetail(ex: PlanSummaryExerciseDto, t: ReturnType<typeof useTranslation>['t']): string {
  const sets = ex.sets;
  if (ex.bilateral) {
    if (ex.duration != null) return `${sets} × ${ex.duration}s`;
    const reps =
      ex.minReps != null && ex.maxReps != null && ex.minReps !== ex.maxReps
        ? `${ex.minReps}–${ex.maxReps}`
        : (ex.maxReps ?? ex.minReps ?? '?');
    const weight = ex.weight != null ? ` · ${ex.weight}${ex.weightUnit}` : '';
    return `${sets} × ${reps}${weight}`;
  }
  const side = ex.left ?? ex.right;
  if (side) {
    if (side.duration != null) return `${sets} × ${side.duration}s (cada lado)`;
    const reps =
      side.minReps != null && side.maxReps != null && side.minReps !== side.maxReps
        ? `${side.minReps}–${side.maxReps}`
        : (side.maxReps ?? side.minReps ?? '?');
    const weight = side.weight != null ? ` · ${side.weight}${ex.weightUnit}` : '';
    return `${sets} × ${reps}${weight} (cada lado)`;
  }
  if (ex.duration != null) return `${sets} × ${ex.duration}s`;
  const reps =
    ex.minReps != null && ex.maxReps != null && ex.minReps !== ex.maxReps
      ? `${ex.minReps}–${ex.maxReps}`
      : (ex.maxReps ?? ex.minReps ?? '?');
  const weight = ex.weight != null ? ` · ${ex.weight}${ex.weightUnit}` : '';
  return `${sets} × ${reps}${weight}`;
}

function groupExercises(exercises: PlanSummaryExerciseDto[]): Array<{ groupId: string | null; items: PlanSummaryExerciseDto[] }> {
  const groups: Array<{ groupId: string | null; items: PlanSummaryExerciseDto[] }> = [];
  const seen = new Map<string, number>();
  for (const ex of exercises) {
    const gid = ex.supersetGroupId ?? null;
    if (gid && seen.has(gid)) {
      groups[seen.get(gid)!].items.push(ex);
    } else {
      seen.set(gid ?? `__solo_${groups.length}`, groups.length);
      groups.push({ groupId: gid, items: [ex] });
    }
  }
  return groups;
}

interface DaySlideProps {
  day: PlanSummaryDayDto;
  dayLabel: string;
  slideIndex: number;
  totalSlides: number;
}

function DaySlide({ day, dayLabel, slideIndex, totalSlides }: DaySlideProps) {
  const { t } = useTranslation();
  const groups = groupExercises(day.exercises);

  return (
    <div className="w-full shrink-0 snap-center px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
          {dayLabel}
        </p>
        {totalSlides > 1 && (
          <p className="text-[11px] text-muted-foreground">
            {slideIndex + 1} / {totalSlides}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className={cn(
              'rounded-xl',
              group.groupId ? 'border border-primary/20 bg-primary/5 p-2 space-y-1.5' : '',
            )}
          >
            {group.groupId && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {t('plans.share.superset')} {group.groupId}
              </Badge>
            )}
            {group.items.map((ex) => (
              <div key={ex.exerciseId} className="flex items-start gap-2.5">
                <ExerciseGifThumbnail
                  gifUrl={ex.gifUrl ?? undefined}
                  exerciseName={ex.exerciseName}
                  exerciseId={ex.exerciseId}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium leading-tight">{ex.exerciseName}</p>
                  <p className="text-[11.5px] text-muted-foreground">
                    {formatExerciseDetail(ex, t)}
                    {' · '}
                    {ex.rest}s {t('session.rest.label').toLowerCase()}
                  </p>
                  {ex.notes && (
                    <p className="mt-0.5 text-[11px] italic text-muted-foreground/80 leading-snug">
                      {ex.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanSummaryCard({ planSummary }: PlanSummaryCardProps) {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = planSummary.days;
  const isCarousel = days.length > 1;

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {planSummary.planName && (
        <div className="border-b border-border bg-muted/30 px-4 py-2.5">
          <p className="text-[13px] font-semibold">{planSummary.planName}</p>
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          onScroll={handleScroll}
        >
          {days.map((day, i) => {
            const dayLabel = day.dayName
              ? `${t(`days.${day.dayOfWeek}`)} · ${day.dayName}`
              : t(`days.${day.dayOfWeek}`);
            return (
              <DaySlide
                key={day.dayOfWeek}
                day={day}
                dayLabel={dayLabel}
                slideIndex={i}
                totalSlides={days.length}
              />
            );
          })}
        </div>

        {isCarousel && activeSlide > 0 && (
          <button
            type="button"
            onClick={() => goTo(activeSlide - 1)}
            aria-label="Día anterior"
            className="cursor-pointer absolute left-1.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {isCarousel && activeSlide < days.length - 1 && (
          <button
            type="button"
            onClick={() => goTo(activeSlide + 1)}
            aria-label="Día siguiente"
            className="cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {isCarousel && (
          <div className="flex justify-center gap-1.25 pb-2.5 pt-1">
            {days.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al día ${i + 1}`}
                className={cn(
                  'h-1.25 rounded-full transition-all',
                  i === activeSlide
                    ? 'w-3.5 bg-foreground/70'
                    : 'w-1.25 bg-foreground/20',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
