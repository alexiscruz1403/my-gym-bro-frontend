'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { copySharedPlan } from '@/services/feed.service';
import { usePlans, invalidatePlansCache } from '@/hooks/usePlans';
import { invalidatePlanCache } from '@/hooks/usePlan';
import type { FeedPost } from '@/types/domain.types';

interface CopySharedPlanSheetProps {
  post: FeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CopyMode = 'existing' | 'new';

export function CopySharedPlanSheet({ post, open, onOpenChange }: CopySharedPlanSheetProps) {
  const { t } = useTranslation();
  const { data: plans, loading: plansLoading } = usePlans();

  const [mode, setMode] = useState<CopyMode>('existing');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planSummary = post.planSummary!;
  const isComplete = planSummary.shareType === 'complete';
  const nonAiPlanCount = plans.filter((p) => !p.isAiGenerated).length;
  const atLimit = nonAiPlanCount >= 3;

  function reset() {
    setMode('existing');
    setSelectedPlanId(null);
    setNewPlanName('');
    setIsSubmitting(false);
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  const canSubmit = (() => {
    if (isSubmitting) return false;
    if (isComplete) return !atLimit;
    if (mode === 'existing') return selectedPlanId !== null;
    return newPlanName.trim().length > 0 && !atLimit;
  })();

  async function handleCopy() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      if (isComplete) {
        await copySharedPlan(post._id, {});
        invalidatePlansCache();
        toast.success(t('plans.copyShared.successComplete'));
      } else if (mode === 'existing' && selectedPlanId) {
        const targetPlan = plans.find((p) => p.id === selectedPlanId);
        await copySharedPlan(post._id, { targetPlanId: selectedPlanId });
        invalidatePlanCache(selectedPlanId);
        toast.success(t('plans.copyShared.successMerge', { name: targetPlan?.name ?? '' }));
      } else {
        const trimmedName = newPlanName.trim();
        await copySharedPlan(post._id, { newPlanName: trimmedName });
        invalidatePlansCache();
        toast.success(t('plans.copyShared.successNew', { name: trimmedName }));
      }
      handleClose(false);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 422) {
        toast.error(t('plans.error.maxPlans'));
      } else {
        toast.error(t('plans.copyShared.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="flex flex-col max-h-[92dvh] rounded-t-[20px]">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border shrink-0" />
        <SheetHeader className="shrink-0 px-5 pb-1 pt-3">
          <SheetTitle>{t('plans.copyShared.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('plans.copyShared.title')}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
          {isComplete ? (
            <CompleteCopyBody
              planName={planSummary.planName}
              atLimit={atLimit}
              t={t}
            />
          ) : (
            <PartialCopyBody
              mode={mode}
              onModeChange={(m) => { setMode(m); setSelectedPlanId(null); }}
              plans={plans}
              plansLoading={plansLoading}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
              newPlanName={newPlanName}
              onNewPlanNameChange={setNewPlanName}
              atLimit={atLimit}
              t={t}
            />
          )}

          <Button className="w-full" disabled={!canSubmit} onClick={handleCopy}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('plans.copyShared.copying')}
              </>
            ) : (
              t('plans.copyShared.button')
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CompleteCopyBody({
  planName,
  atLimit,
  t,
}: {
  planName?: string | null;
  atLimit: boolean;
  t: (key: string, opts?: Record<string, string>) => string;
}) {
  return (
    <div className="space-y-3">
      {planName && (
        <p className="text-[14px] text-muted-foreground">
          {t('plans.copyShared.descriptionComplete', { name: planName })}
        </p>
      )}
      {atLimit && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[13px] text-destructive">
          {t('plans.copyShared.limitWarning')}
        </p>
      )}
    </div>
  );
}

function PartialCopyBody({
  mode,
  onModeChange,
  plans,
  plansLoading,
  selectedPlanId,
  onSelectPlan,
  newPlanName,
  onNewPlanNameChange,
  atLimit,
  t,
}: {
  mode: CopyMode;
  onModeChange: (m: CopyMode) => void;
  plans: { id: string; name: string; isActive: boolean; isAiGenerated?: boolean }[];
  plansLoading: boolean;
  selectedPlanId: string | null;
  onSelectPlan: (id: string) => void;
  newPlanName: string;
  onNewPlanNameChange: (v: string) => void;
  atLimit: boolean;
  t: (key: string, opts?: Record<string, string>) => string;
}) {
  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(['existing', 'new'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-[13px] font-medium text-left transition-colors',
              mode === m
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card hover:bg-muted/40',
            )}
          >
            {m === 'existing' ? t('plans.copyShared.existingPlan') : t('plans.copyShared.newPlan')}
          </button>
        ))}
      </div>

      {mode === 'existing' ? (
        <div className="space-y-1.5 max-h-52 overflow-y-auto">
          {plansLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-1.5">
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))
            : plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => onSelectPlan(plan.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:bg-muted/40',
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="truncate font-medium">{plan.name}</span>
                      {plan.isActive && (
                        <Badge className="shrink-0 h-auto rounded-full border border-accent/25 bg-accent/10 px-2 py-0 text-[10px] font-semibold text-accent hover:bg-accent/15">
                          ●
                        </Badge>
                      )}
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 ml-2" />}
                  </button>
                );
              })}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={newPlanName}
            onChange={(e) => onNewPlanNameChange(e.target.value)}
            placeholder={t('plans.copyShared.planNamePlaceholder')}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {atLimit && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[13px] text-destructive">
              {t('plans.copyShared.limitWarning')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
