'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sparkles, BrainCircuit, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCtaCard } from '@/components/dashboard/PremiumCtaCard';
import {
  AiPlanProfileCard,
  AiPlanProfileCardSkeleton,
  AiPlanCountBadge,
} from './AiPlanProfileCard';
import { AiPlanGuideSheet } from '@/components/guides/AiPlanGuideSheet';
import { useAuth } from '@/hooks/useAuth';
import { useAiProfiles } from '@/hooks/useAiProfiles';

const MAX_AI_PLANS = 3;

export function AiLandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium = user?.membershipTier === 'premium' && user?.membershipStatus === 'active';
  const { profiles, loading: profilesLoading } = useAiProfiles();
  const atLimit = profiles.length >= MAX_AI_PLANS;
  const features = t('ai.landing.features', { returnObjects: true }) as string[];
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Hero card — dark gradient, always shown */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-primary/40 bg-gradient-to-br from-[oklch(20%_0.07_35)] to-[oklch(12%_0.018_248)] px-[18px] py-5">
        <BrainCircuit className="mb-0.5 h-8 w-8 text-primary" />
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[22px] font-bold leading-[1.1] tracking-[0.02em] text-white">
            {t('ai.landing.title')}
          </p>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="mt-1 flex shrink-0 items-center text-white/40 transition-colors hover:text-white/70"
            aria-label={t('guides.howItWorks')}
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[13px] leading-[1.5] text-white/70">
          {t('ai.landing.description')}
        </p>
        <div className="flex flex-col gap-[5px]">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-[7px] text-[12px] text-white/70">
              <Check className="h-3.5 w-3.5 shrink-0 text-green-400" />
              {f}
            </div>
          ))}
        </div>
        {isPremium && (
          <div className="mt-1">
            {atLimit ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <p className="text-[13px] font-medium text-white">
                  {t('ai.landing.limitTitle')}
                </p>
                <p className="mt-0.5 text-[12px] text-white/60">
                  {t('ai.landing.limitDescription', { max: MAX_AI_PLANS })}
                </p>
              </div>
            ) : (
              <Link href="/ai/generate" className="w-full">
                <Button
                  className="h-[46px] w-full gap-2 rounded-2xl text-[15px] font-semibold"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  {t('ai.landing.generate')}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Non-premium: upgrade CTA */}
      {!isPremium && <PremiumCtaCard />}

      {/* Premium: count badge + previous generations */}
      {isPremium && (
        <>
          <AiPlanCountBadge count={profiles.length} max={MAX_AI_PLANS} />
          {profilesLoading ? (
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 2 }).map((_, i) => (
                <AiPlanProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                {t('ai.landing.previousGenerations')}
              </p>
              {profiles.map((p, i) => (
                <AiPlanProfileCard key={p.id} profile={p} index={i} />
              ))}
            </div>
          ) : null}
        </>
      )}
    <AiPlanGuideSheet open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
