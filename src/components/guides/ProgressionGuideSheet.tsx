'use client';

import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ProgressionGuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgressionGuideSheet({ open, onOpenChange }: ProgressionGuideSheetProps) {
  const { t } = useTranslation();

  const methodItems = t('guides.progression.methodItems', { returnObjects: true }) as string[];
  const modesItems = t('guides.progression.modesItems', { returnObjects: true }) as string[];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary shrink-0" />
            {t('guides.progression.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('guides.progression.description')}
          </p>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.progression.methodTitle')}
            </p>
            <div className="space-y-2">
              {methodItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.progression.deloadTitle')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed px-1">
              {t('guides.progression.deloadDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              {t('guides.progression.modesTitle')}
            </p>
            <div className="space-y-2">
              {modesItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
                  <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-3">
            <span className="text-primary shrink-0 font-bold mt-px">ⓘ</span>
            <p className="text-sm leading-relaxed">{t('guides.progression.requirementNote')}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
