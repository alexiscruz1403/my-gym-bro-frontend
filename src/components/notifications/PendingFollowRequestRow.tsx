'use client';

import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { FollowRequestItem } from '@/types/domain.types';

interface PendingFollowRequestRowProps {
  request: FollowRequestItem;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function PendingFollowRequestRow({
  request,
  onApprove,
  onReject,
}: PendingFollowRequestRowProps) {
  const { t, i18n } = useTranslation();
  const initials = request.username.slice(0, 2).toUpperCase();
  const dateLocale = i18n.language === 'en' ? enUS : es;
  const timeAgo = formatDistanceToNow(new Date(request.createdAt), {
    addSuffix: true,
    locale: dateLocale,
  });

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Avatar size="default" className="shrink-0">
        {request.avatar && (
          <AvatarImage src={request.avatar} alt={request.username} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-medium">{request.username}</span>{' '}
          {t('followRequest.wantsToFollow')}
        </p>
        <p className="text-muted-foreground text-xs">{timeAgo}</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          size="sm"
          variant="default"
          className="min-h-9 cursor-pointer"
          onClick={() => onApprove(request.senderId)}
        >
          {t('followRequest.approve')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="min-h-9 cursor-pointer"
          onClick={() => onReject(request.senderId)}
        >
          {t('followRequest.reject')}
        </Button>
      </div>
    </div>
  );
}
