'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeletePlanDialogProps {
  planName: string;
  onConfirm: () => Promise<void>;
}

export function DeletePlanDialog({ planName, onConfirm }: DeletePlanDialogProps) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
        <p className="text-destructive mr-1 text-xs">
          {t('plans.delete.title', { name: planName })}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="min-h-11 cursor-pointer px-3 text-xs"
        >
          {t('common.cancel')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleConfirm}
          disabled={loading}
          className="min-h-11 cursor-pointer px-3 text-xs"
        >
          {loading ? t('plans.delete.deleting') : t('plans.delete.confirm')}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setConfirming(true)}
      className="flex cursor-pointer items-center gap-1.5"
    >
      <Trash2 className="h-4 w-4" />
      {t('common.delete')}
    </Button>
  );
}
