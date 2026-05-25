'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Loader2, Trash2 } from 'lucide-react';

interface DeletePlanDialogProps {
  planName: string;
  onConfirm: () => Promise<void>;
}

export function DeletePlanDialog({ planName, onConfirm }: DeletePlanDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 cursor-pointer gap-1.5 border border-destructive/30 bg-transparent px-3.5 text-[13px] font-semibold text-destructive shadow-none hover:bg-destructive/5 hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {t('common.delete')}
      </Button>

      <Sheet open={open} onOpenChange={(v) => !loading && setOpen(v)}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-[20px] border-0 px-5 pb-8 pt-0"
          style={{ background: 'var(--sheet-bg)' }}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 mb-5 h-1 w-10 rounded-full bg-border" />

          {/* Icon */}
          <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>

          {/* Title */}
          <SheetTitle className="font-display text-[21px] font-bold tracking-[0.02em] text-center">
            {t('plans.delete.title')}
          </SheetTitle>

          {/* Description */}
          <SheetDescription className="mx-auto mt-1.5 max-w-75 text-center text-[13px] leading-[1.55]">
            {t('plans.delete.description', { name: planName })}
          </SheetDescription>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex h-11.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-destructive text-[15px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {loading ? t('plans.delete.deleting') : t('plans.delete.confirm')}
            </button>
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-10.5 w-full cursor-pointer rounded-2xl border border-border text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
