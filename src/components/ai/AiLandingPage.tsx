'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Dumbbell, Plus, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PremiumCtaCard } from '@/components/dashboard/PremiumCtaCard';
import {
  AiPlanProfileCard,
  AiPlanProfileCardSkeleton,
  AiPlanCountBadge,
} from './AiPlanProfileCard';
import { useAuth } from '@/hooks/useAuth';
import { useAiProfiles } from '@/hooks/useAiProfiles';
import { usePlans } from '@/hooks/usePlans';

const MAX_AI_PLANS = 3;

export function AiLandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium =
    user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

  const { profiles, loading: profilesLoading } = useAiProfiles();
  const { data: plans, loading: plansLoading } = usePlans();

  const aiPlans = plans.filter((p) => p.isAiGenerated);
  const atLimit = profiles.length >= MAX_AI_PLANS;

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center space-y-3"
        >
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-bold">{t('ai.landing.title')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('ai.landing.description')}
          </p>
          <div className="flex flex-col gap-2 text-sm text-left">
            {(t('ai.landing.features', { returnObjects: true }) as string[]).map((f) => (
              <div key={f} className="text-muted-foreground">
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        <PremiumCtaCard />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <BrainCircuit className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">{t('ai.landing.title')}</p>
          <p className="text-xs text-muted-foreground">
            {t('ai.subtitle')}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            Premium
          </span>
        </div>
      </motion.div>

      <Tabs defaultValue="generate">
        <TabsList className="w-full bg-muted/60 p-1 rounded-xl">
          <TabsTrigger
            value="generate"
            className="flex-1 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            {t('ai.landing.tabGenerate')}
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="flex-1 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            {t('ai.landing.tabPlans')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4 mt-4">
          <AiPlanCountBadge count={profiles.length} max={MAX_AI_PLANS} />

          {atLimit ? (
            <div className="rounded-xl border border-dashed border-muted-foreground/30 p-6 text-center space-y-2">
              <p className="text-sm font-medium">{t('ai.landing.limitTitle')}</p>
              <p className="text-xs text-muted-foreground">
                {t('ai.landing.limitDescription', { max: MAX_AI_PLANS })}
              </p>
            </div>
          ) : (
            <Button
              render={<Link href="/ai/generate" />}
              className="w-full gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              {t('ai.landing.generate')}
            </Button>
          )}

          {profilesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <AiPlanProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t('ai.landing.previousGenerations')}
              </p>
              {profiles.map((p, i) => (
                <AiPlanProfileCard key={p.id} profile={p} index={i} />
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="plans" className="space-y-3 mt-4">
          {plansLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : aiPlans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-muted-foreground/30 p-8 text-center space-y-3">
              <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">{t('ai.landing.noPlansTitle')}</p>
              <p className="text-xs text-muted-foreground">
                {t('ai.landing.noPlansDescription')}
              </p>
              {!atLimit && (
                <Button
                  render={<Link href="/ai/generate" />}
                  size="sm"
                  variant="outline"
                  className="gap-2 mt-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('ai.landing.generateShort')}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {aiPlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/workout/${plan.id}`}>
                    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('ai.landing.planDays', { count: plan.daysCount })}
                        </p>
                      </div>
                      {plan.isActive && (
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 flex-shrink-0">
                          {t('ai.landing.planActive')}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
