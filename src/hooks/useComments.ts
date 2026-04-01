'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getComments, addComment } from '@/services/feed.service';
import type { FeedComment } from '@/types/domain.types';

interface CommentsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [meta, setMeta] = useState<CommentsMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (targetPage: number) => {
      if (!postId) return;

      setIsLoading(true);
      setError(null);

      getComments(postId, { page: targetPage, limit: 20 })
        .then(({ data, meta: responseMeta }) => {
          setComments(data);
          setMeta(responseMeta);
          setPage(targetPage);
        })
        .catch(() => setError('Failed to load comments.'))
        .finally(() => setIsLoading(false));
    },
    [postId],
  );

  async function submitComment(text: string) {
    if (!postId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newComment = await addComment(postId, text);
      setComments((prev) => [...prev, newComment]);
      if (meta) {
        setMeta({ ...meta, total: meta.total + 1 });
      }
    } catch {
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToPage(n: number) {
    fetchPage(n);
  }

  return { comments, meta, page, isLoading, isSubmitting, error, fetchPage, goToPage, submitComment };
}
