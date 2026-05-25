'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CheckCircle, SkipForward } from 'lucide-react';

interface ConfirmFinishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFullyCompleted: boolean;
  onConfirm: () => Promise<void>;
}

export function ConfirmFinishDialog({
  open,
  onOpenChange,
  isFullyCompleted,
  onConfirm,
}: ConfirmFinishDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-0 rounded-t-[20px] border-0 px-5 pt-0 pb-8"
        style={{ background: 'var(--sheet-bg)' }}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-5 h-1 w-10 rounded-full bg-border" />

        {/* Icon */}
        <div
          className={`mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full ${
            isFullyCompleted ? 'bg-accent/10' : 'bg-primary/10'
          }`}
        >
          {isFullyCompleted ? (
            <CheckCircle className="h-6 w-6 text-accent" />
          ) : (
            <SkipForward className="h-6 w-6 text-primary" />
          )}
        </div>

        {/* Title */}
        <SheetTitle className="font-display text-[21px] font-bold tracking-[0.02em] text-center text-foreground">
          {isFullyCompleted
            ? t('session.confirmFinish.titleCompleted')
            : t('session.confirmFinish.titlePartial')}
        </SheetTitle>

        {/* Description */}
        <SheetDescription className="mx-auto mt-1.5 max-w-75 text-center text-[13px] leading-[1.55] text-muted-foreground">
          {isFullyCompleted
            ? t('session.confirmFinish.descriptionCompleted')
            : t('session.confirmFinish.descriptionPartial')}
        </SheetDescription>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="h-11.5 w-full cursor-pointer rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t('common.saving') : t('common.confirm')}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-10.5 w-full cursor-pointer rounded-2xl border border-border bg-transparent text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
