import type {
  AppNotification,
  NotificationDataFollow,
  NotificationDataFollowRequest,
  NotificationDataFollowAccepted,
  NotificationDataPostLike,
  NotificationDataPostComment,
  NotificationDataNewPost,
  NotificationDataPlanShared,
  NotificationDataSystem,
  NotificationDataAchievementUnlocked,
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
    case 'follow_request': {
      const d = n.data as NotificationDataFollowRequest;
      return {
        text: `${d.actorUsername} quiere seguirte`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'follow_accepted': {
      const d = n.data as NotificationDataFollowAccepted;
      return {
        text: `${d.actorUsername} aceptó tu solicitud de seguimiento`,
        avatar: d.actorAvatar,
        actorUsername: d.actorUsername,
      };
    }
    case 'plan_shared': {
      const d = n.data as NotificationDataPlanShared;
      const text =
        d.shareScope === 'individual'
          ? `${d.actorUsername} compartió un plan contigo`
          : `${d.actorUsername} compartió un plan con todos sus seguidores`;
      return { text, avatar: d.actorAvatar, actorUsername: d.actorUsername };
    }
    case 'system': {
      const d = n.data as NotificationDataSystem;
      return {
        text: `${d.title} — ${d.body}`,
        avatar: null,
        actorUsername: null,
      };
    }
    case 'achievement_unlocked': {
      const d = n.data as NotificationDataAchievementUnlocked;
      return {
        text: `¡Lograste "${d.nameEs}" (${d.tierLabelEs})!`,
        avatar: d.badgeUrl,
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
    case 'follow_request':
      return '/notifications';
    case 'follow_accepted':
      return '/profile';
    case 'plan_shared':
      return `/feed?post=${encodeURIComponent((n.data as NotificationDataPlanShared).postId)}`;
    case 'system':
    case 'achievement_unlocked':
      return '/notifications';
  }
}
