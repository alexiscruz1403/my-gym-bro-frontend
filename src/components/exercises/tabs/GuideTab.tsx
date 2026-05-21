'use client';

import { Info, VideoOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Exercise } from '@/types/domain.types';

interface GuideTabProps {
  exercise: Exercise;
}

export function GuideTab({ exercise }: GuideTabProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {/* Media */}
      {exercise.videoUrl ? (
        <div className="overflow-hidden rounded-2xl">
          <video
            src={exercise.videoUrl}
            controls
            className="w-full"
            aria-label={exercise.name}
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-muted/60">
          <VideoOff className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-[12px] text-muted-foreground/60">
            {t('exercises.detail.guide.videoNotAvailable')}
          </p>
        </div>
      )}

      {/* Primary muscles */}
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {t('exercises.detail.guide.primaryMuscles')}
        </p>
        <div className="flex flex-wrap gap-[5px]">
          {exercise.musclesPrimary.map((m) => (
            <span
              key={m}
              className="rounded-full border border-primary/25 bg-primary/10 px-[11px] py-1 text-[12px] font-medium text-primary"
            >
              {t(`exercises.muscle.${m}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Secondary muscles */}
      {exercise.musclesSecondary.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
            {t('exercises.detail.guide.secondaryMuscles')}
          </p>
          <div className="flex flex-wrap gap-[5px]">
            {exercise.musclesSecondary.map((m) => (
              <span
                key={m}
                className="rounded-full border border-border bg-muted px-[11px] py-1 text-[12px] font-medium text-muted-foreground"
              >
                {t(`exercises.muscle.${m}`)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weight guide */}
      {exercise.weightGuide && (
        <>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              {t('exercises.detail.guide.howToLog')}
            </p>
            <div className="flex items-start gap-2 rounded-2xl border border-border bg-muted/60 px-[14px] py-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div>
                <p className="text-[13px] leading-[1.5] text-foreground">
                  {t(`exercises.detail.guide.weightInstruction.${exercise.weightGuide.instruction}`)}
                </p>
                {exercise.weightGuide.note && (
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {exercise.weightGuide.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
