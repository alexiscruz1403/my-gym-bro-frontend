'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { createPost } from '@/services/feed.service';
import type { WorkoutSession } from '@/types/domain.types';

const MAX_CAPTION = 500;

interface CreateFeedPostSheetProps {
  session: WorkoutSession;
  open: boolean;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function CreateFeedPostSheet({ session, open, onClose }: CreateFeedPostSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedExercises = session.exercises.filter(
    (ex) => ex.sets.some((s) => s.completed),
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    if (inputRef.current) inputRef.current.value = '';
  }

  function removePhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  }

  async function handleShare() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createPost({ sessionId: session._id, caption: caption.trim() || undefined, file: file ?? undefined });
      toast.success('Workout shared!');
      handleClose();
    } catch {
      toast.error('Failed to share workout.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setCaption('');
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Share your workout</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-4">
          {/* Session preview */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{session.planName}</span>
              <span>{formatDuration(session.durationSeconds ?? 0)}</span>
            </div>
            {completedExercises.map((ex) => {
              const completedSets = ex.sets.filter((s) => s.completed);
              return (
                <div key={ex.exerciseId} className="space-y-0.5">
                  <p className="text-sm font-medium">{ex.exerciseName}</p>
                  <p className="text-muted-foreground text-xs">
                    {completedSets.map((s, i) => {
                      const metric =
                        ex.trackingType === 'duration'
                          ? `${s.duration ?? 0}s`
                          : `${s.reps ?? 0} reps`;
                      const weight = s.weight ? ` · ${s.weight} kg` : '';
                      return `Set ${s.setIndex + 1}: ${metric}${weight}`;
                    }).join(' · ')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Photo picker */}
          {preview ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image src={preview} alt="Post photo preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remove photo"
                className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-border text-muted-foreground gap-2"
            >
              <Camera size={28} />
              <span className="text-sm">Add a photo (optional)</span>
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Caption */}
          <div className="space-y-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              maxLength={MAX_CAPTION}
              rows={3}
              className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length} / {MAX_CAPTION}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={handleShare} disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Share
            </Button>
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting} className="w-full">
              Skip
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
