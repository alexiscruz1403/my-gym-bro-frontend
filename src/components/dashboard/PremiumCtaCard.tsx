'use client';

import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { checkout } from '@/services/subscription.service';

export function PremiumCtaCard() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (dismissed) return null;

  async function handleCta() {
    if (loading) return;
    setLoading(true);
    try {
      const { initPoint } = await checkout('monthly');
      window.location.href = initPoint;
    } catch {
      toast.error(t('subscription.error'));
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, oklch(68% .16 72 / .06) 0%, transparent 60%)',
        }}
      />
      <div className="relative flex items-center gap-3 px-4 py-3.5">
        {/* Icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[15px] bg-warning-soft text-warning"
        >
          <Sparkles className="h-4 w-4" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold">{t('dashboard.premiumCta.title')}</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{t('dashboard.premiumCta.subtitle')}</p>
        </div>

        {/* CTA button */}
        <button
          type="button"
          onClick={handleCta}
          disabled={loading}
          className="flex h-8.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 text-[12.5px] font-semibold bg-warning text-warning-foreground transition-all hover:brightness-110 disabled:opacity-75"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t('dashboard.premiumCta.cta')}
        </button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t('common.cancel')}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
