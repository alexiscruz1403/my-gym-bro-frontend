import type {
  AppNotification,
  NotificationDataFollow,
  NotificationDataPostLike,
  NotificationDataPostComment,
  NotificationDataNewPost,
  NotificationDataSystem,
} from '@/types/domain.types';

export interface FormattedNotification {
  text: string;
  avatar: string | null;
  actorUsername: string | null;
}

export function formatNotification(n: AppNotification): FormattedNotification {
  switch (n.type) {
    case 'follow': {
      const d = n.data as NotificationDataFollow;
      return {
        text: `${d.actorUsername} comenzó a seguirte`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'post_like': {
      const d = n.data as NotificationDataPostLike;
      return {
        text: `A ${d.actorUsername} le gustó tu post`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'post_comment': {
      const d = n.data as NotificationDataPostComment;
      const preview =
        d.commentText.length > 80 ? `${d.commentText.slice(0, 80)}…` : d.commentText;
      return {
        text: `${d.actorUsername} comentó: "${preview}"`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'new_post': {
      const d = n.data as NotificationDataNewPost;
      return {
        text: `${d.actorUsername} publicó un nuevo post`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'system': {
      const d = n.data as NotificationDataSystem;
      return {
        text: `${d.title} — ${d.body}`,
        avatar: null,
        actorUsername: null,
      };
    }
  }
}

export function hrefFor(n: AppNotification): string {
  switch (n.type) {
    case 'follow':
      return n.actorId
        ? `/profile?followers=${encodeURIComponent(n.actorId)}`
        : '/profile';
    case 'post_like':
    case 'new_post':
      return `/feed?post=${encodeURIComponent((n.data as NotificationDataPostLike).postId)}`;
    case 'post_comment':
      return `/feed?post=${encodeURIComponent(
        (n.data as NotificationDataPostComment).postId,
      )}&comments=1`;
    case 'system':
      return '/notifications';
  }
}
