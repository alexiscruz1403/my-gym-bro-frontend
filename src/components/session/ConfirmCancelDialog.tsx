'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Trash2 } from 'lucide-react';

interface ConfirmCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmCancelDialog({ open, onOpenChange, onConfirm }: ConfirmCancelDialogProps) {
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
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="h-6 w-6 text-destructive" />
        </div>

        {/* Title */}
        <SheetTitle className="font-display text-[21px] font-bold tracking-[0.02em] text-center text-foreground">
          {t('session.confirmCancel.title')}
        </SheetTitle>

        {/* Description */}
        <SheetDescription className="mx-auto mt-1.5 max-w-75 text-center text-[13px] leading-[1.55] text-muted-foreground">
          {t('session.confirmCancel.description')}
        </SheetDescription>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="h-11.5 w-full cursor-pointer rounded-2xl bg-destructive text-[15px] font-semibold text-destructive-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t('session.confirmCancel.cancelling') : t('session.cancelSession')}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-10.5 w-full cursor-pointer rounded-2xl border border-border bg-transparent text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('session.confirmCancel.keepGoing')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
