'use client';

import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface PrsGuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrsGuideSheet({ open, onOpenChange }: PrsGuideSheetProps) {
  const { t } = useTranslation();

  const whatIsItems = t('guides.prs.whatIsItems', { returnObjects: true }) as string[];
  const predictionItems = t('guides.prs.predictionItems', { returnObjects: true }) as string[];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-primary shrink-0" />
            {t('guides.prs.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('guides.prs.description')}
          </p>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.prs.whatIsTitle')}
            </p>
            <div className="space-y-2">
              {whatIsItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <p className="text-[12px] font-mono font-semibold text-foreground text-center tracking-wide">
                {t('guides.prs.formula')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.prs.predictionTitle')}
            </p>
            <div className="space-y-2">
              {predictionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-3">
            <span className="text-primary shrink-0 font-bold mt-px">ⓘ</span>
            <p className="text-sm leading-relaxed">{t('guides.prs.note')}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
