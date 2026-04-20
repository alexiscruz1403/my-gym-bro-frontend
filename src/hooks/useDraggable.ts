'use client';

import { useState, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  defaultPosition: Position;
  longPressDelay?: number;
}

export function useDraggable({ defaultPosition, longPressDelay = 500 }: UseDraggableOptions) {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointer = useRef<Position>({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  // Cache pointer id so we can release capture even if currentTarget changes
  const pointerIdRef = useRef<number | null>(null);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Don't start drag if touching a button or interactive element
      if ((e.target as HTMLElement).closest('button, input')) return;

      lastPointer.current = { x: e.clientX, y: e.clientY };
      pointerIdRef.current = e.pointerId;
      const el = e.currentTarget;

      longPressTimer.current = setTimeout(() => {
        draggingRef.current = true;
        setIsDragging(true);
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // element may have been removed — ignore
        }
      }, longPressDelay);
    },
    [longPressDelay],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      cancelLongPress();
      if (draggingRef.current) {
        draggingRef.current = false;
        setIsDragging(false);
        // Clamp using the overlay's actual bounding rect
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - rect.width, prev.x)),
          y: Math.max(0, Math.min(window.innerHeight - rect.height, prev.y)),
        }));
      }
    },
    [cancelLongPress],
  );

  const handlePointerCancel = useCallback(() => {
    cancelLongPress();
    draggingRef.current = false;
    setIsDragging(false);
  }, [cancelLongPress]);

  return {
    position,
    isDragging,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
