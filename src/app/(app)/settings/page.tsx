'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useSubscription } from '@/hooks/useSubscription';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';
import type { Language } from '@/types/domain.types';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();
  const { user, setUser } = useAuthStore();
  const { subscription, isLoading: subLoading, updateAutoRenew, isToggling } = useSubscription();

  const showAutoRenew =
    user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

  const NOTIFICATION_ITEMS = [
    {
      key: 'allowFollow' as const,
      label: t('settings.notifications.newFollower.label'),
      description: t('settings.notifications.newFollower.description'),
    },
    {
      key: 'allowPostLike' as const,
      label: t('settings.notifications.postLike.label'),
      description: t('settings.notifications.postLike.description'),
    },
    {
      key: 'allowPostComment' as const,
      label: t('settings.notifications.postComment.label'),
      description: t('settings.notifications.postComment.description'),
    },
    {
      key: 'allowNewPost' as const,
      label: t('settings.notifications.newPost.label'),
      description: t('settings.notifications.newPost.description'),
    },
  ] as const;

  async function handlePrivacyToggle(checked: boolean) {
    if (!user) return;
    setUser({ ...user, isPrivate: checked });
    try {
      const updated = await usersService.updateProfile({ isPrivate: checked });
      setUser(updated);
    } catch {
      setUser({ ...user, isPrivate: !checked });
    }
  }

  async function handleLanguageChange(lang: Language) {
    if (!user || user.language === lang) return;
    const previous = user.language;
    setUser({ ...user, language: lang });
    try {
      const updated = await usersService.updateLanguage(lang);
      setUser(updated);
    } catch {
      setUser({ ...user, language: previous });
    }
  }

  return (
    <PageContainer>
      <h1 className="font-display text-xl font-semibold mb-6">{t('settings.title')}</h1>

      <div className="space-y-4">
        {/* Notification preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('settings.notifications.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-36 rounded" />
                      <Skeleton className="h-3 w-52 rounded" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                ))
              : NOTIFICATION_ITEMS.map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Switch
                      checked={preferences?.[key] ?? true}
                      onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
                      aria-label={label}
                      className={'cursor-pointer'}
                    />
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('settings.privacy.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 flex-1">
                <p className="text-sm font-medium">{t('settings.privacy.privateProfile.label')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.privacy.privateProfile.description')}
                </p>
              </div>
              <Switch
                checked={user?.isPrivate ?? false}
                onCheckedChange={handlePrivacyToggle}
                aria-label={t('settings.privacy.privateProfile.label')}
                className={'cursor-pointer'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('settings.language.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(['es', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`cursor-pointer flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    (user?.language ?? 'es') === lang
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-foreground'
                  }`}
                >
                  {t(`settings.language.${lang}`)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription auto-renew — only for active premium users */}
        {showAutoRenew && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('settings.subscription.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {subLoading ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-52 rounded" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <p className="text-sm font-medium">{t('settings.subscription.autoRenew.label')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.subscription.autoRenew.description')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('settings.subscription.nextBillingDate', { date: subscription?.nextBillingDate })}
                    </p>
                  </div>
                  <Switch
                    checked={subscription?.autoRenew ?? user?.autoRenew ?? false}
                    onCheckedChange={(checked) => updateAutoRenew(checked)}
                    disabled={isToggling}
                    aria-label={t('settings.subscription.autoRenew.label')}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Legal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('settings.legal.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/terms"
              className="flex items-center justify-between gap-3 hover:opacity-75 transition-opacity"
            >
              <div className="space-y-0.5 flex-1">
                <p className="text-sm font-medium">{t('settings.legal.terms.label')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.legal.terms.description')}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('settings.support.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/faq"
              className="flex items-center justify-between gap-3 hover:opacity-75 transition-opacity"
            >
              <div className="space-y-0.5 flex-1">
                <p className="text-sm font-medium">{t('settings.support.faq.label')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.support.faq.description')}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
