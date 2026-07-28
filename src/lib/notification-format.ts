import i18n from 'i18next';
import type {
  AppNotification,
  NotificationData,
  NotificationDataFollow,
  NotificationDataPostLike,
  NotificationDataPlanShared,
  NotificationDataSystem,
  NotificationDataAchievementUnlocked,
  NotificationDataStreakAtRisk,
} from '@/types/domain.types';

export interface FormattedNotification {
  text: string;
  avatar: string | null;
  actorUsername: string | null;
}

/**
 * El backend puede omitir `data` por completo (ej. `streak_reset`) o enviarla con
 * una forma distinta a la esperada, así que cada acceso pasa por un guard en vez
 * de un cast directo: una notificación mal formada no debe tumbar toda la lista.
 */
function asRecord(data: NotificationData | undefined): Record<string, unknown> {
  return (data ?? {}) as Record<string, unknown>;
}

function hasTitleBody(data: NotificationData | undefined): data is NotificationDataSystem {
  const d = asRecord(data);
  return typeof d.title === 'string' && typeof d.body === 'string';
}

/** Datos del actor con fallback, para los tipos que muestran usuario + avatar. */
function actorOf(data: NotificationData | undefined): NotificationDataFollow {
  const d = asRecord(data);
  return {
    actorUsername:
      typeof d.actorUsername === 'string'
        ? d.actorUsername
        : i18n.t('notifications.unknownActor'),
    actorAvatar: typeof d.actorAvatar === 'string' ? d.actorAvatar : null,
  };
}

/** Elige la variante del idioma activo, con el otro idioma como respaldo. */
function localized(es: unknown, en: unknown): string | null {
  const preferred = i18n.language === 'en' ? en : es;
  const fallback = i18n.language === 'en' ? es : en;
  if (typeof preferred === 'string' && preferred) return preferred;
  return typeof fallback === 'string' && fallback ? fallback : null;
}

function actorResult(d: NotificationDataFollow, text: string): FormattedNotification {
  return { text, avatar: d.actorAvatar, actorUsername: d.actorUsername };
}

/** Usa el `title`/`body` del backend si vino; si no, el texto local del tipo. */
function systemText(n: AppNotification, fallbackKey: string): string {
  if (hasTitleBody(n.data)) return `${n.data.title} — ${n.data.body}`;
  return i18n.t(fallbackKey);
}

function streakAtRiskText(data: NotificationData | undefined): string {
  const d = asRecord(data) as Partial<NotificationDataStreakAtRisk>;
  if (typeof d.sessionsNeeded !== 'number' || typeof d.daysLeft !== 'number') {
    return i18n.t('notifications.text.streakAtRiskGeneric');
  }
  return i18n.t('notifications.text.streakAtRisk', {
    count: d.sessionsNeeded,
    days: i18n.t('notifications.text.days', { count: d.daysLeft }),
  });
}

export function formatNotification(n: AppNotification): FormattedNotification {
  switch (n.type) {
    case 'follow': {
      const d = actorOf(n.data);
      return actorResult(d, i18n.t('notifications.text.follow', { actor: d.actorUsername }));
    }
    case 'post_like': {
      const d = actorOf(n.data);
      return actorResult(d, i18n.t('notifications.text.postLike', { actor: d.actorUsername }));
    }
    case 'post_comment': {
      const d = actorOf(n.data);
      const { commentText } = asRecord(n.data);
      const raw = typeof commentText === 'string' ? commentText : '';
      const preview = raw.length > 80 ? `${raw.slice(0, 80)}…` : raw;
      return actorResult(
        d,
        preview
          ? i18n.t('notifications.text.postComment', { actor: d.actorUsername, preview })
          : i18n.t('notifications.text.postCommentNoText', { actor: d.actorUsername }),
      );
    }
    case 'new_post': {
      const d = actorOf(n.data);
      return actorResult(d, i18n.t('notifications.text.newPost', { actor: d.actorUsername }));
    }
    case 'follow_request': {
      const d = actorOf(n.data);
      return actorResult(
        d,
        i18n.t('notifications.text.followRequest', { actor: d.actorUsername }),
      );
    }
    case 'follow_accepted': {
      const d = actorOf(n.data);
      return actorResult(
        d,
        i18n.t('notifications.text.followAccepted', { actor: d.actorUsername }),
      );
    }
    case 'plan_shared': {
      const d = actorOf(n.data);
      const { shareScope } = asRecord(n.data) as Partial<NotificationDataPlanShared>;
      const key =
        shareScope === 'individual'
          ? 'notifications.text.planSharedIndividual'
          : 'notifications.text.planSharedFollowers';
      return actorResult(d, i18n.t(key, { actor: d.actorUsername }));
    }
    case 'system': {
      return {
        text: systemText(n, 'notifications.text.system'),
        avatar: null,
        actorUsername: null,
      };
    }
    case 'achievement_unlocked': {
      const d = asRecord(n.data) as Partial<NotificationDataAchievementUnlocked>;
      // El backend manda el logro en ambos idiomas; se elige según el idioma activo.
      const name = localized(d.nameEs, d.nameEn);
      const tier = localized(d.tierLabelEs, d.tierLabelEn);
      const text =
        name && tier
          ? i18n.t('notifications.text.achievement', { name, tier })
          : i18n.t('notifications.text.achievementUnlocked');
      return {
        text,
        avatar: typeof d.badgeUrl === 'string' ? d.badgeUrl : null,
        actorUsername: null,
      };
    }
    case 'progression_analysis':
      return {
        text: systemText(n, 'notifications.text.progressionAnalysis'),
        avatar: null,
        actorUsername: null,
      };
    case 'streak_reset':
      return {
        text: systemText(n, 'notifications.text.streakReset'),
        avatar: null,
        actorUsername: null,
      };
    case 'streak_at_risk':
      return {
        text: hasTitleBody(n.data)
          ? `${n.data.title} — ${n.data.body}`
          : streakAtRiskText(n.data),
        avatar: null,
        actorUsername: null,
      };
    case 'membership_renewed':
      return {
        text: systemText(n, 'notifications.text.membershipRenewed'),
        avatar: null,
        actorUsername: null,
      };
    case 'membership_renewal_failed':
      return {
        text: systemText(n, 'notifications.text.membershipRenewalFailed'),
        avatar: null,
        actorUsername: null,
      };
  }
}

/** El post asociado puede faltar si la notificación llegó sin payload. */
function postHref(data: NotificationData | undefined, suffix = ''): string {
  const { postId } = asRecord(data) as Partial<NotificationDataPostLike>;
  if (!postId) return '/feed';
  return `/feed?post=${encodeURIComponent(postId)}${suffix}`;
}

export function hrefFor(n: AppNotification): string {
  switch (n.type) {
    case 'follow':
      return n.actorId
        ? `/profile?followers=${encodeURIComponent(n.actorId)}`
        : '/profile';
    case 'post_like':
    case 'new_post':
      return postHref(n.data);
    case 'post_comment':
      return postHref(n.data, '&comments=1');
    case 'follow_request':
      return '/notifications';
    case 'follow_accepted':
      return '/profile';
    case 'plan_shared':
      return postHref(n.data);
    case 'system':
    case 'achievement_unlocked':
    case 'progression_analysis':
    case 'streak_reset':
    case 'streak_at_risk':
    case 'membership_renewed':
    case 'membership_renewal_failed':
      return '/notifications';
  }
}
