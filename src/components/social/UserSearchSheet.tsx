'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
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
      <SheetContent side="bottom" className="max-h-[80dvh] flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('social.search.title')}</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('social.search.placeholder')}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {isLoading && (
            <div className="space-y-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && !hasSearched && (
            <EmptyState
              title={t('social.search.emptyTitle')}
              description={t('social.search.emptyDescription')}
              className="pt-8"
            />
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <EmptyState
              title={t('social.search.notFoundTitle')}
              description={t('social.search.notFoundDescription')}
              className="pt-8"
            />
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-1 mt-2">
              {results.map((user) => (
                <UserListItem key={user._id} user={user} onFollowed={onFollowed} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
