'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNotification, hrefFor } from '@/lib/notification-format';
import type { AppNotification } from '@/types/domain.types';

interface NotificationRowProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationRow({ notification, onMarkRead }: NotificationRowProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { text, avatar, actorUsername } = formatNotification(notification);
  const dateLocale = i18n.language === 'en' ? enUS : es;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: dateLocale,
  });

  const handleClick = () => {
    if (!notification.isRead) onMarkRead(notification._id);
    router.push(hrefFor(notification));
  };

  const initials = (actorUsername ?? '?').slice(0, 2).toUpperCase();
  const isUnread = !notification.isRead;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-2.5 rounded-2xl border px-3.5 py-[11px] text-left transition-colors',
        isUnread
          ? 'border-primary/[0.18] bg-primary/10 hover:bg-primary/[0.14]'
          : 'border-border bg-card hover:bg-muted/40',
      )}
    >
      <Avatar size="default" className="shrink-0">
        {avatar ? (
          <AvatarImage src={avatar} alt={actorUsername ?? t('notifications.systemActor')} />
        ) : null}
        <AvatarFallback
          className={cn(isUnread && actorUsername ? 'bg-primary text-primary-foreground' : '')}
        >
          {actorUsername ? initials : <Bell className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] leading-[1.45] text-foreground">{text}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo}</p>
      </div>

      {isUnread && (
        <span
          aria-label={t('notifications.unread')}
          className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-primary"
        />
      )}
    </button>
  );
}
