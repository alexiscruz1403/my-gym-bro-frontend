'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RECOVERY_COLORS } from '@/lib/recovery-colors';
import type { MuscleRecoveryItem } from '@/types/recovery.types';

interface RecoveryDetailPanelProps {
  item: MuscleRecoveryItem | undefined;
  open: boolean;
  onClose: () => void;
}

function formatHours(hoursUntilFresh: number) {
  const h = Math.floor(hoursUntilFresh);
  const m = Math.round((hoursUntilFresh % 1) * 60);
  return { hours: h, minutes: m };
}

export function RecoveryDetailPanel({ item, open, onClose }: RecoveryDetailPanelProps) {
  const { t, i18n } = useTranslation();

  const muscleName = item ? t(`exercises.muscle.${item.muscle}`) : '';

  const lastTrainedLabel = item?.lastTrainedAt
    ? new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(item.lastTrainedAt),
      )
    : t('muscleRecovery.neverTrained');

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-[20px] border-0 p-0"
        style={{ background: 'var(--sheet-bg)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />

        {item ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-[18px] pt-2 pb-[14px]">
              <div className="flex flex-col gap-1">
                <SheetTitle className="font-display text-[20px] font-bold tracking-[0.02em]">
                  {muscleName}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {t('muscleRecovery.title')}
                </SheetDescription>
                <span
                  className="w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-black"
                  style={{ backgroundColor: RECOVERY_COLORS[item.status] }}
                >
                  {t(`muscleRecovery.status.${item.status}`)}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 pb-6 [scrollbar-width:none]">
              {/* Recovery progress */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{t('muscleRecovery.recoveryPercent', { value: item.recoveryPercent.toFixed(1) })}</span>
                  <span className="font-semibold tabular-nums" style={{ color: RECOVERY_COLORS[item.status] }}>
                    {item.recoveryPercent.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={item.recoveryPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.recoveryPercent}%`,
                      backgroundColor: RECOVERY_COLORS[item.status],
                    }}
                  />
                </div>
              </div>

              {/* Time until fresh */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-[13px] text-muted-foreground">
                  {item.status === 'FRESH'
                    ? t('muscleRecovery.readyToTrain')
                    : (() => {
                        const { hours, minutes } = formatHours(item.hoursUntilFresh);
                        return t('muscleRecovery.hoursUntilFresh', { hours, minutes });
                      })()}
                </span>
              </div>

              {/* Last trained */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-[13px] text-muted-foreground">{t('muscleRecovery.lastTrained')}</span>
                <span className="text-[13px] font-medium">{lastTrainedLabel}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <SheetTitle className="sr-only">{t('muscleRecovery.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('muscleRecovery.neverTrained')}</SheetDescription>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
