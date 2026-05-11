'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          {isFullyCompleted ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : (
            <SkipForward className="text-muted-foreground h-12 w-12" />
          )}
          <DialogTitle>
            {isFullyCompleted
              ? t('session.confirmFinish.titleCompleted')
              : t('session.confirmFinish.titlePartial')}
          </DialogTitle>
          <DialogDescription>
            {isFullyCompleted
              ? t('session.confirmFinish.descriptionCompleted')
              : t('session.confirmFinish.descriptionPartial')}
          </DialogDescription>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {loading ? t('common.saving') : t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
