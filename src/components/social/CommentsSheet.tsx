'use client';

import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useComments } from '@/hooks/useComments';

function CommentsSkeletons() {
  return (
    <div className="space-y-3 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

interface CommentsSheetProps {
  postId: string | null;
  onClose: () => void;
}

export function CommentsSheet({ postId, onClose }: CommentsSheetProps) {
  const open = postId !== null;
  const { comments, meta, page, isLoading, isSubmitting, fetchPage, goToPage, submitComment } =
    useComments(postId ?? '');

  const [text, setText] = useState('');

  useEffect(() => {
    if (open && postId) {
      fetchPage(1);
      setText('');
    }
  }, [open, postId, fetchPage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    await submitComment(trimmed);
    setText('');
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="bottom" className="flex flex-col max-h-[80dvh]">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {isLoading && <CommentsSkeletons />}

          {!isLoading && comments.length === 0 && (
            <EmptyState title="No comments yet" description="Be the first to comment." />
          )}

          {!isLoading && comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}

              {meta && (
                <Pagination
                  page={page}
                  total={meta.total}
                  limit={meta.limit}
                  onPageChange={goToPage}
                />
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t px-4 py-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            maxLength={300}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting || !text.trim()}
            aria-label="Post comment"
          >
            <Send />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
