'use client';

import { useRef, useState, useEffect } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionSummaryCard } from './SessionSummaryCard';
import { createPost } from '@/services/feed.service';
import { getSessionSummary } from '@/services/sessions.service';
import type { SessionSummarySnapshot } from '@/types/domain.types';

const MAX_CAPTION = 500;

interface CreateFeedPostSheetProps {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}

export function CreateFeedPostSheet({ sessionId, open, onClose }: CreateFeedPostSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<SessionSummarySnapshot | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSummaryLoading(true);
    getSessionSummary(sessionId)
      .then((data) => { if (!cancelled) setSummary(data); })
      .catch(() => { /* non-blocking — hide card on failure */ })
      .finally(() => { if (!cancelled) setSummaryLoading(false); });
    return () => { cancelled = true; };
  }, [open, sessionId]);

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
      await createPost({ sessionId, caption: caption.trim() || undefined, file: file ?? undefined });
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
    setSummary(null);
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Share your workout</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-4">
          {/* Session summary preview */}
          {summaryLoading && <Skeleton className="h-24 w-full rounded-xl" />}
          {!summaryLoading && summary && <SessionSummaryCard summary={summary} />}

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
