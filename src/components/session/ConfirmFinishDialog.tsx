'use client';

import { useState } from 'react';
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
            {isFullyCompleted ? 'Finish workout?' : 'End session early?'}
          </DialogTitle>
          <DialogDescription>
            {isFullyCompleted
              ? 'All sets are done. This will be saved as a completed session.'
              : 'Some sets are still pending. This will be saved as a partial session.'}
          </DialogDescription>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {loading ? 'Saving…' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
