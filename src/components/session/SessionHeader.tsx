'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Flag, MoreVertical, Trash2 } from 'lucide-react';
import useSessionStore from '@/store/session.store';

const DAY_LABEL: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

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
  onCancel: () => void;
}

export function SessionHeader({ onFinish, onCancel }: SessionHeaderProps) {
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
        {activeSession && (
          <p className="text-muted-foreground text-xs">
            {DAY_LABEL[activeSession.dayOfWeek]}
            {activeSession.dayName && ` · ${activeSession.dayName}`}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-display text-xl font-bold tabular-nums">
          {formatElapsed(sessionStartTime)}
        </span>

        {/* Desktop: explicit buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="min-h-11 cursor-pointer gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Cancel
          </Button>
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

        {/* Mobile: dropdown menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  className="min-h-11 min-w-9 cursor-pointer"
                  aria-label="Session options"
                />
              }
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="bg-background">
              <DropdownMenuItem onClick={onFinish}>
                <Flag className="h-4 w-4" />
                Finish workout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onCancel}>
                <Trash2 className="h-4 w-4" />
                Cancel session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
