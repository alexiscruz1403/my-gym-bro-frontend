'use client';

import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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
  onCommentAdded?: () => void;
}

export function CommentsSheet({ postId, onClose, onCommentAdded }: CommentsSheetProps) {
  const open = postId !== null;
  const { comments, meta, page, isLoading, isSubmitting, fetchPage, goToPage, submitComment, submitReply } =
    useComments(postId ?? '', onCommentAdded);

  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [visibleReplyCount, setVisibleReplyCount] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open && postId) {
      fetchPage(1);
      setText('');
      setReplyingTo(null);
      setReplyText('');
      setVisibleReplyCount({});
    }
  }, [open, postId, fetchPage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    await submitComment(trimmed);
    setText('');
  }

  async function handleReplySubmit(commentId: string) {
    const trimmed = replyText.trim();
    if (!trimmed || isSubmitting) return;
    await submitReply(commentId, trimmed);
    setReplyText('');
    setReplyingTo(null);
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="bottom" showCloseButton={false} className="rounded-t-[20px] border-0 p-0 flex flex-col max-h-[80dvh]">
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />

        <div className="flex shrink-0 items-center justify-between border-b border-border px-[18px] pt-2 pb-[14px]">
          <SheetTitle className="font-display text-[19px] font-bold tracking-[0.02em]">Comentarios</SheetTitle>
          <SheetDescription className="sr-only">Comentarios de la publicación</SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          {isLoading && <div className="px-4 pt-3"><CommentsSkeletons /></div>}

          {!isLoading && comments.length === 0 && (
            <EmptyState title="Sin comentarios" description="Sé el primero en comentar." className="pt-8" />
          )}

          {!isLoading && comments.length > 0 && (
            <div>
              {comments.map((comment, i) => (
                <div key={comment._id ?? i} className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-0">
                  {/* Base comment */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-semibold">{comment.username}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-[1.45]">{comment.text}</p>
                  {comment._id && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(replyingTo === comment._id ? null : comment._id);
                        setReplyText('');
                      }}
                      className="self-start text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Responder
                    </button>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-3.5 mt-1 flex flex-col gap-1.5 border-l-2 border-border pl-2.5">
                      {comment.replies
                        .slice(0, visibleReplyCount[comment._id] ?? 3)
                        .map((reply) => (
                          <div key={reply._id} className="flex flex-col gap-0.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[12px] font-semibold">{reply.username}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-[12.5px] leading-[1.45]">{reply.text}</p>
                          </div>
                        ))}
                      {comment.replies.length > (visibleReplyCount[comment._id] ?? 3) && (
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleReplyCount((prev) => ({
                              ...prev,
                              [comment._id]: (prev[comment._id] ?? 3) + 3,
                            }))
                          }
                          className="self-start text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Ver más ({comment.replies.length - (visibleReplyCount[comment._id] ?? 3)} más)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Inline reply input */}
                  {replyingTo === comment._id && (
                    <div className="ml-3.5 mt-1 flex items-center gap-1.5 border-l-2 border-border pl-2.5">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Responder a @${comment.username}…`}
                        maxLength={300}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(comment._id)}
                        className="h-[34px] flex-1 rounded-full border-[1.5px] border-border bg-muted/50 px-3.5 text-[13px] outline-none transition-all focus:border-primary focus:bg-background"
                      />
                      <button
                        type="button"
                        disabled={isSubmitting || !replyText.trim()}
                        onClick={() => handleReplySubmit(comment._id)}
                        aria-label="Enviar respuesta"
                        className="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {meta && (
                <div className="px-4 pb-3">
                  <Pagination
                    page={page}
                    total={meta.total}
                    limit={meta.limit}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3 pb-5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí un comentario…"
            maxLength={300}
            className="h-10 flex-1 rounded-full border-[1.5px] border-border bg-muted/50 px-4 text-[14px] outline-none transition-all focus:border-primary focus:bg-background"
          />
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            aria-label="Publicar comentario"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {isSubmitting
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              : <Send className="h-4 w-4" />
            }
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
