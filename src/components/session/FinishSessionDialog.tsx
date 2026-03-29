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

interface FinishSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: (status: 'completed' | 'partial') => Promise<void>;
}

export function FinishSessionDialog({ open, onOpenChange, onFinish }: FinishSessionDialogProps) {
  const [loading, setLoading] = useState(false);

  const handle = async (status: 'completed' | 'partial') => {
    setLoading(true);
    try {
      await onFinish(status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Finish workout?</DialogTitle>
        <DialogDescription>
          Choose how to record this session.
        </DialogDescription>

        <div className="mt-2 flex flex-col gap-3">
          <Button
            onClick={() => handle('completed')}
            disabled={loading}
            className="min-h-14 cursor-pointer flex-col gap-0.5"
          >
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle className="h-5 w-5" />
              Completed
            </span>
            <span className="text-xs font-normal opacity-80">All sets done</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handle('partial')}
            disabled={loading}
            className="min-h-14 cursor-pointer flex-col gap-0.5"
          >
            <span className="flex items-center gap-2 font-semibold">
              <SkipForward className="h-5 w-5" />
              Partial
            </span>
            <span className="text-xs font-normal opacity-80">Ended early</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
