'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { UserListItem } from '@/components/social/UserListItem';
import { usersService } from '@/services/users.service';
import type { PublicUserProfile } from '@/types/domain.types';

const DEBOUNCE_MS = 300;

interface UserSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFollowed?: () => void;
}

export function UserSearchSheet({ open, onOpenChange, onFollowed }: UserSearchSheetProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await usersService.searchUsers(trimmed);
        setResults(data);
        setHasSearched(true);
      } catch {
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="rounded-t-[20px] border-0 p-0 flex flex-col max-h-[80dvh]">
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />

        <div className="flex shrink-0 items-center justify-between border-b border-border px-4.5 pt-2 pb-3.5">
          <SheetTitle className="font-display text-[19px] font-bold tracking-[0.02em]">{t('social.search.title')}</SheetTitle>
          <SheetDescription className="sr-only">Buscar usuarios para seguir</SheetDescription>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 flex-1 overflow-y-auto px-4 pt-3 pb-6 [scrollbar-width:none]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('social.search.placeholder')}
              autoFocus
              className="h-10.5 w-full rounded-2xl border-[1.5px] border-border bg-muted/60 pl-10 pr-9 text-[14px] outline-none transition-all focus:border-primary focus:bg-background focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_14%,transparent)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-15.5 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && !hasSearched && (
            <EmptyState
              title={t('social.search.emptyTitle')}
              description={t('social.search.emptyDescription')}
              className="pt-6"
            />
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <EmptyState
              title={t('social.search.notFoundTitle')}
              description={t('social.search.notFoundDescription')}
              className="pt-6"
            />
          )}

          {!isLoading && results.length > 0 && (
            <div>
              {results.map((user) => (
                <UserListItem key={user._id} user={user} followersCount={user.followersCount} onFollowed={onFollowed} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
