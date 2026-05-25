'use client';

import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const { t } = useTranslation();
  const initials = request.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-[11px] last:border-0">
      <Avatar size="default" className="shrink-0">
        {request.avatar && <AvatarImage src={request.avatar} alt={request.username} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <span className="min-w-0 flex-1 text-[14px] font-semibold text-foreground">
        @{request.username}
      </span>

      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={() => onApprove(request.senderId)}
          className="h-[30px] cursor-pointer rounded-full bg-green-500 px-3 text-[12px] font-semibold text-white transition-all hover:brightness-110"
        >
          {t('followRequest.approve')}
        </button>
        <button
          type="button"
          onClick={() => onReject(request.senderId)}
          className="h-[30px] cursor-pointer rounded-full border-[1.5px] border-border bg-muted/60 px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          {t('followRequest.reject')}
        </button>
      </div>
    </div>
  );
}
