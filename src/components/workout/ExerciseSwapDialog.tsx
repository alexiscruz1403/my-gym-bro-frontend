'use client';

import { useState } from 'react';
import { RefreshCw, Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useExerciseSwap } from '@/hooks/useExerciseSwap';

interface ExerciseSwapDialogProps {
  planId: string;
  exerciseId: string;
  exerciseName: string;
}

export function ExerciseSwapDialog({
  planId,
  exerciseId,
  exerciseName,
}: ExerciseSwapDialogProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const reasonError = reason.length > 0 && reason.length < 10
    ? t('ai.swap.reasonMinLength')
    : null;

  const { state, proposal, error, requestSwap, confirmSwap, reset, isRequesting, isConfirming } =
    useExerciseSwap({ planId, exerciseId });

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setReason('');
    }
    setOpen(isOpen);
  };

  const handleRequest = async () => {
    if (reason.length < 10) return;
    await requestSwap(reason);
  };

  const handleConfirm = async (approved: boolean) => {
    await confirmSwap(approved);
    toast.success(approved ? t('ai.swap.acceptedToast') : t('ai.swap.rejectedToast'));
    setOpen(false);
  };

  const lang = i18n.language as 'es' | 'en';
  const proposalName = proposal
    ? (proposal.suggestedExercise.name[lang] ?? proposal.suggestedExercise.name.es)
    : '';

  return (
    <>
      <button
        type="button"
        title={t('ai.swap.trigger')}
        onClick={() => handleOpen(true)}
        className="text-muted-foreground hover:text-primary cursor-pointer rounded p-0.5 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('ai.swap.title')}</DialogTitle>
            <DialogDescription>
              {t('ai.swap.description', { exercise: exerciseName })}
            </DialogDescription>
          </DialogHeader>

          {error && state === 'idle' && (
            <p className="text-destructive text-sm">{t('ai.swap.errorToast')}</p>
          )}

          {state === 'idle' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('ai.swap.reasonLabel')}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('ai.swap.reasonPlaceholder')}
                  rows={3}
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-3 resize-none"
                />
                {reasonError ? (
                  <p className="text-destructive text-xs">{reasonError}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">{t('ai.swap.reasonHint')}</p>
                )}
              </div>
              <Button
                onClick={handleRequest}
                disabled={reason.length < 10}
                className="w-full cursor-pointer"
              >
                {t('ai.swap.request')}
              </Button>
            </div>
          )}

          {state === 'requesting' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">{t('ai.swap.requesting')}</p>
              <p className="text-muted-foreground text-xs">{t('ai.swap.requestNote')}</p>
            </div>
          )}

          {(state === 'proposed' || state === 'confirming') && proposal && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary h-4 w-4 shrink-0" />
                  <p className="text-sm font-semibold">{t('ai.swap.proposalTitle')}</p>
                </div>
                <p className="text-sm font-medium">{proposalName}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {proposal.justification}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  disabled={isConfirming}
                  onClick={() => handleConfirm(false)}
                >
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="mr-1.5 h-4 w-4" />
                      {t('ai.swap.reject')}
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 cursor-pointer"
                  disabled={isConfirming}
                  onClick={() => handleConfirm(true)}
                >
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      {t('ai.swap.accept')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
