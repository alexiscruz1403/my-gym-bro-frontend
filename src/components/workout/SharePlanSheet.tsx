'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { sharePlan } from '@/services/feed.service';
import { useAuth } from '@/hooks/useAuth';
import { useFollowList } from '@/hooks/useFollowList';
import type { WorkoutPlan } from '@/types/domain.types';

const MAX_CAPTION = 500;

interface SharePlanSheetProps {
  plan: WorkoutPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ShareType = 'complete' | 'partial';
type Audience = 'followers' | 'individual';

export function SharePlanSheet({ plan, open, onOpenChange }: SharePlanSheetProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [shareType, setShareType] = useState<ShareType>('complete');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [audience, setAudience] = useState<Audience>('followers');
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followerSearch, setFollowerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(followerSearch), 300);
    return () => clearTimeout(timer);
  }, [followerSearch]);

  const showFollowerPicker = audience === 'individual';
  const {
    users: followers,
    meta: followersMeta,
    page: followersPage,
    isLoading: loadingFollowers,
    fetchPage: fetchFollowersPage,
  } = useFollowList(user?.id ?? '', 'followers', { limit: 10, search: debouncedSearch });

  function reset() {
    setShareType('complete');
    setSelectedDay(null);
    setAudience('followers');
    setSelectedFollowerId(null);
    setCaption('');
    setIsSubmitting(false);
    setFollowerSearch('');
    setDebouncedSearch('');
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  const canSubmit =
    !isSubmitting &&
    (shareType === 'complete' || selectedDay !== null) &&
    (audience === 'followers' || selectedFollowerId !== null);

  async function handleShare() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await sharePlan({
        planId: plan.id,
        shareType,
        dayOfWeek: shareType === 'partial' ? (selectedDay ?? undefined) : undefined,
        audience,
        recipientId: audience === 'individual' ? (selectedFollowerId ?? undefined) : undefined,
        caption: caption.trim() || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success(t('plans.share.success'));
      handleClose(false);
    } catch {
      toast.error(t('plans.share.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="flex flex-col max-h-[92dvh] rounded-t-[20px]">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border shrink-0" />
        <SheetHeader className="shrink-0 px-5 pb-1 pt-3">
          <SheetTitle>{t('plans.share.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('plans.share.title')}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
          {/* Share type */}
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
              {t('plans.share.selectDay')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['complete', 'partial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setShareType(type);
                    if (type === 'complete') setSelectedDay(null);
                  }}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-[13px] font-medium text-left transition-colors',
                    shareType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:bg-muted/40',
                  )}
                >
                  {type === 'complete' ? t('plans.share.complete') : t('plans.share.partialDay')}
                </button>
              ))}
            </div>

            {shareType === 'partial' && (
              <div className="space-y-1.5 pt-1">
                {plan.days.map((day) => {
                  const label = day.dayName
                    ? `${t(`days.${day.dayOfWeek}`)} · ${day.dayName}`
                    : t(`days.${day.dayOfWeek}`);
                  const isSelected = selectedDay === day.dayOfWeek;
                  return (
                    <button
                      key={day.dayOfWeek}
                      type="button"
                      onClick={() => setSelectedDay(day.dayOfWeek)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <span className="font-medium">{label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
              {t('plans.share.selectFollower')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['followers', 'individual'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => {
                    setAudience(aud);
                    if (aud === 'followers') setSelectedFollowerId(null);
                  }}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-[13px] font-medium text-left transition-colors',
                    audience === aud
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:bg-muted/40',
                  )}
                >
                  {aud === 'followers'
                    ? t('plans.share.audienceFollowers')
                    : t('plans.share.audienceIndividual')}
                </button>
              ))}
            </div>

            {showFollowerPicker && (
              <div className="space-y-2 pt-1">
                <input
                  type="search"
                  value={followerSearch}
                  onChange={(e) => setFollowerSearch(e.target.value)}
                  placeholder={t('plans.share.searchFollowerPlaceholder')}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {loadingFollowers
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-1 py-1.5">
                          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-28 rounded" />
                        </div>
                      ))
                    : followers.map((follower) => {
                        const isSelected = selectedFollowerId === follower._id;
                        return (
                          <button
                            key={follower._id}
                            type="button"
                            onClick={() => setSelectedFollowerId(follower._id)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-xl border px-3 py-2 transition-colors',
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-card hover:bg-muted/40',
                            )}
                          >
                            <Avatar size="sm" className="shrink-0">
                              {follower.avatar && (
                                <AvatarImage src={follower.avatar} alt={follower.username} />
                              )}
                              <AvatarFallback>
                                {follower.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="flex-1 truncate text-[13px] font-medium text-left">
                              {follower.username}
                            </span>
                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-primary" />
                            )}
                          </button>
                        );
                      })}
                </div>

                {followersMeta && followersMeta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      type="button"
                      disabled={followersPage <= 1}
                      onClick={() => fetchFollowersPage(followersPage - 1)}
                      className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('session.prev')}
                    </button>
                    <span className="text-[12px] text-muted-foreground">
                      {followersPage} / {followersMeta.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={followersPage >= followersMeta.totalPages}
                      onClick={() => fetchFollowersPage(followersPage + 1)}
                      className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('session.next')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
              placeholder={t('plans.share.captionPlaceholder')}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-right text-[11px] text-muted-foreground">
              {caption.length}/{MAX_CAPTION}
            </p>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!canSubmit}
            onClick={handleShare}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('plans.share.sharing')}
              </>
            ) : (
              t('plans.share.button')
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
