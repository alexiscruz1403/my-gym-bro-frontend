'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeletePlanDialogProps {
  planName: string;
  onConfirm: () => Promise<void>;
}

export function DeletePlanDialog({ planName, onConfirm }: DeletePlanDialogProps) {
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
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
        <p className="text-destructive mr-1 text-xs">
          Delete &quot;{planName}&quot;?
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="h-7 cursor-pointer px-2 text-xs"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleConfirm}
          disabled={loading}
          className="h-7 cursor-pointer px-2 text-xs"
        >
          {loading ? 'Deleting…' : 'Confirm'}
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
      Delete
    </Button>
  );
}
