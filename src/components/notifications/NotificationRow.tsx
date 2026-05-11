'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
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

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
        notification.isRead ? '' : 'bg-primary/5 border-primary/30'
      }`}
    >
      <Avatar size="default" className="shrink-0">
        {avatar ? (
          <AvatarImage src={avatar} alt={actorUsername ?? t('notifications.systemActor')} />
        ) : null}
        <AvatarFallback>
          {actorUsername ? initials : <Bell className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-sm">{text}</p>
        <p className="text-muted-foreground text-xs">{timeAgo}</p>
      </div>

      {!notification.isRead && (
        <span
          aria-label={t('notifications.unread')}
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
        />
      )}
    </button>
  );
}
