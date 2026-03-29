'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import useSessionStore from '@/store/session.store';

function formatElapsed(startTime: number | null): string {
  const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface SessionHeaderProps {
  onFinish: () => void;
}

export function SessionHeader({ onFinish }: SessionHeaderProps) {
  const { sessionStartTime, activeSession } = useSessionStore();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div>
        <p className="text-muted-foreground text-xs">In progress</p>
        <p className="font-display text-lg font-bold">{activeSession?.planName ?? 'Workout'}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-xl font-bold tabular-nums">
          {formatElapsed(sessionStartTime)}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onFinish}
          className="min-h-11 cursor-pointer gap-1.5"
        >
          <Flag className="h-4 w-4" />
          Finish
        </Button>
      </div>
    </div>
  );
}
