'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Download, FileDown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { exportHistoryPdf, exportHistoryCsv, type ExportPeriod } from '@/services/export.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const PERIODS: ExportPeriod[] = ['3m', '6m', '1y'];

export function ExportHistorySheet() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const isPremium = user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<ExportPeriod>('3m');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const handleTrigger = () => {
    if (!isPremium) { router.push('/subscription'); return; }
    setOpen(true);
  };

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      await exportHistoryPdf(period);
    } catch {
      toast.error(t('history.export.error'));
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCsv = async () => {
    setCsvLoading(true);
    try {
      await exportHistoryCsv(period);
    } catch {
      toast.error(t('history.export.error'));
    } finally {
      setCsvLoading(false);
    }
  };

  const isLoading = pdfLoading || csvLoading;

  return (
    <>
      <button
        type="button"
        onClick={handleTrigger}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
      >
        {isPremium ? (
          <Download className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {t('history.export.historyTitle')}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{t('history.export.historyTitle')}</SheetTitle>
            <SheetDescription>{t('history.export.selectPeriod')}</SheetDescription>
          </SheetHeader>

          <div className="space-y-2 px-4 pb-2">
            {PERIODS.map((p) => {
              const isSelected = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground',
                    )}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-medium">{t(`history.export.period${p}`)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 px-4 pb-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer gap-2"
              disabled={isLoading}
              onClick={handleCsv}
            >
              {csvLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              {t('history.export.csv')}
            </Button>

            <Button
              className="flex-1 cursor-pointer gap-2"
              disabled={isLoading}
              onClick={handlePdf}
            >
              {pdfLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              {t('history.export.pdf')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
