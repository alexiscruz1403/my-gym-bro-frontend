'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Check, X } from 'lucide-react';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { useDraggable } from '@/hooks/useDraggable';

const PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
];

function getDefaultPosition() {
  if (typeof window === 'undefined') return { x: 16, y: 260 };
  // Stack below rest timer (rest timer starts at y=80, ~160px tall)
  return { x: 16, y: 260 };
}

interface GlobalCountdownTimerOverlayProps {
  onClose: () => void;
}

export function GlobalCountdownTimerOverlay({ onClose }: GlobalCountdownTimerOverlayProps) {
  const { secondsLeft, isRunning, isPaused, isActive, totalSeconds, start, pause, resume, reset, complete } =
    useCountdownTimer();
  const { position, isDragging, pointerHandlers } = useDraggable({
    defaultPosition: getDefaultPosition(),
  });

  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const handlePreset = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    setCustomMin(String(m));
    setCustomSec(s === 0 ? '0' : String(s));
  };

  const customDuration = parseInt(customMin || '0', 10) * 60 + parseInt(customSec || '0', 10);

  const handleStart = () => {
    if (customDuration <= 0) return;
    start(customDuration);
  };

  const handleComplete = () => {
    complete();
    onClose();
  };

  const progress =
    isActive && totalSeconds > 0
      ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)
      : 0;

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    cursor: isDragging ? 'grabbing' : undefined,
    touchAction: 'none',
    zIndex: 40,
    width: 'min(calc(100vw - 2rem), 20rem)',
  };

  const dragBorderClass = isDragging ? 'border-primary border-2' : 'border';

  return (
    <div
      style={baseStyle}
      className={`rounded-xl ${dragBorderClass} bg-card p-4 shadow-lg`}
      {...pointerHandlers}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ cursor: 'grab' }}>
        <p className="text-muted-foreground text-sm font-medium select-none">Temporizador</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-9 w-9 cursor-pointer"
          aria-label="Cerrar temporizador"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isActive ? (
        /* Active mode */
        <>
          <p className="font-display mt-1 text-center text-4xl font-bold tabular-nums select-none">
            {display}
          </p>
          <Progress value={progress} className="mt-3 h-2" />
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={reset}
              className="h-11 w-11 cursor-pointer"
              aria-label="Reiniciar"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={isRunning ? pause : resume}
              className="h-11 w-11 cursor-pointer"
              aria-label={isRunning ? 'Pausar' : 'Reanudar'}
            >
              {isRunning || secondsLeft === 0 ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={handleComplete}
              className="h-11 w-11 cursor-pointer"
              aria-label="Marcar como listo"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs select-none">
            Mantén presionado para mover · ✓ para cerrar
          </p>
        </>
      ) : (
        /* Setup mode */
        <>
          <div className="mt-3 flex gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(p.seconds)}
                className="flex-1 cursor-pointer px-1"
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1">
              <input
                type="number"
                min={0}
                max={99}
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                placeholder="mm"
                className="w-full rounded border bg-background px-2 py-1.5 text-center text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <span className="text-muted-foreground font-bold">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={customSec}
                onChange={(e) => setCustomSec(e.target.value)}
                placeholder="ss"
                className="w-full rounded border bg-background px-2 py-1.5 text-center text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button
              type="button"
              onClick={handleStart}
              disabled={customDuration <= 0}
              className="cursor-pointer"
              size="sm"
            >
              <Play className="mr-1 h-3 w-3" />
              Iniciar
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs select-none">
            Mantén presionado para mover
          </p>
        </>
      )}
    </div>
  );
}
