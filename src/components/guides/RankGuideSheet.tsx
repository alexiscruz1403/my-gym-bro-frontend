'use client';

import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface RankGuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RankGuideSheet({ open, onOpenChange }: RankGuideSheetProps) {
  const { t } = useTranslation();

  const howItWorksItems = t('guides.ranks.howItWorksItems', { returnObjects: true }) as string[];
  const calculationItems = t('guides.ranks.calculationItems', { returnObjects: true }) as string[];
  const levels = t('guides.ranks.levels', { returnObjects: true }) as string[];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-primary shrink-0" />
            {t('guides.ranks.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('guides.ranks.description')}
          </p>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.howItWorks')}
            </p>
            <div className="space-y-2">
              {howItWorksItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.ranks.calculationTitle')}
            </p>
            <div className="space-y-2">
              {calculationItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground px-1">{t('guides.ranks.thresholdsNote')}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.ranks.levelsTitle')}
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              {levels.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-0 text-sm"
                >
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground tabular-nums">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-3">
            <span className="text-primary shrink-0 font-bold mt-px">ⓘ</span>
            <p className="text-sm leading-relaxed">{t('guides.ranks.note')}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
