'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ConfirmCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmCancelDialog({ open, onOpenChange, onConfirm }: ConfirmCancelDialogProps) {
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
          <Trash2 className="text-destructive h-12 w-12" />
          <DialogTitle>Cancel session?</DialogTitle>
          <DialogDescription>
            This session will be permanently deleted. No sets or progress will be saved.
          </DialogDescription>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            Keep going
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {loading ? 'Cancelling…' : 'Cancel session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
