'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Dumbbell, Plus, Sparkles } from 'lucide-react';

interface QuickActionCardProps {
  isPremium: boolean;
}

export function QuickActionCard({ isPremium }: QuickActionCardProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Dumbbell className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-[18px] font-semibold tracking-[0.01em]">
            {t('dashboard.noActivePlan.title')}
          </h3>
          <p className="mt-1 max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
            {t('dashboard.noActivePlan.description')}
          </p>
        </div>
        <div className="mt-1 flex w-full gap-2">
          <Link
            href="/workout/new"
            className="flex h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-border bg-muted text-[13.5px] font-semibold transition-colors hover:border-muted-foreground/50 hover:bg-border"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.noActivePlan.createButton')}
          </Link>
          {isPremium ? (
            <Link
              href="/ai"
              className="flex h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-primary/25 bg-primary/10 text-[13.5px] font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              <Sparkles className="h-4 w-4" />
              {t('dashboard.noActivePlan.aiButton')}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-[42px] flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-border bg-muted text-[13.5px] font-semibold text-muted-foreground opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {t('dashboard.noActivePlan.aiButtonFree')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
