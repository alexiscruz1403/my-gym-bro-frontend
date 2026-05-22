'use client';

import Link from 'next/link';
import { ChevronRight, CreditCard, FileText, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useSubscription } from '@/hooks/useSubscription';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';
import { queryClient } from '@/lib/query-client';
import type { Language } from '@/types/domain.types';

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-[15px] font-semibold tracking-[0.02em] text-foreground">
          {title}
        </p>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function SettingToggleRow({
  label,
  description,
  extra,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description?: string;
  extra?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12px] leading-[1.4] text-muted-foreground">{description}</p>
        )}
        {extra && <p className="mt-0.5 text-[11px] text-muted-foreground">{extra}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
        className="cursor-pointer"
      />
    </div>
  );
}

function SettingLinkRow({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/60"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
        )}
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Link>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();
  const { user, setUser } = useAuthStore();
  const { subscription, isLoading: subLoading, updateAutoRenew, isToggling } = useSubscription();

  const isPremium = user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      setUser({ ...user, language: previous });
    }
  }

  return (
    <PageContainer>
      <div className="space-y-3">
        {/* Notifications */}
        <SettingsGroup title={t('settings.notifications.title')}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-52 rounded" />
                  </div>
                  <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
                </div>
              ))
            : NOTIFICATION_ITEMS.map(({ key, label, description }) => (
                <SettingToggleRow
                  key={key}
                  label={label}
                  description={description}
                  checked={preferences?.[key] ?? true}
                  onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
                />
              ))}
        </SettingsGroup>

        {/* Privacy */}
        <SettingsGroup title={t('settings.privacy.title')}>
          <SettingToggleRow
            label={t('settings.privacy.privateProfile.label')}
            description={t('settings.privacy.privateProfile.description')}
            checked={user?.isPrivate ?? false}
            onCheckedChange={handlePrivacyToggle}
          />
        </SettingsGroup>

        {/* Language */}
        <SettingsGroup title={t('settings.language.title')}>
          <div className="flex gap-2 px-4 py-3">
            {(['es', 'en'] as Language[]).map((lang) => {
              const active = (user?.language ?? 'es') === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    'h-[38px] flex-1 cursor-pointer rounded-xl border-[1.5px] text-[13.5px] font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary font-semibold text-primary-foreground'
                      : 'border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  {t(`settings.language.${lang}`)}
                </button>
              );
            })}
          </div>
        </SettingsGroup>

        {/* Subscription */}
        {isPremium ? (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-card shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/7 to-transparent" />
            <div className="border-b border-amber-500/20 px-4 py-3">
              <p className="font-display text-[15px] font-semibold tracking-[0.02em] text-amber-600 dark:text-amber-400">
                {t('settings.subscription.title')}
                <span className="ml-2 rounded-full border border-amber-500/25 bg-amber-500/15 px-[7px] py-px text-[10px] font-bold tracking-[0.04em] text-amber-600 dark:text-amber-400">
                  {t('settings.subscription.activeStatus')}
                </span>
              </p>
            </div>
            {subLoading ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-52 rounded" />
                </div>
                <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
              </div>
            ) : (
              <>
                {(subscription?.plan || subscription?.nextBillingDate) && (
                  <>
                    <div className="px-4 py-3 space-y-2">
                      {subscription?.plan && (
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-muted-foreground">Plan</span>
                          <span className="font-semibold capitalize text-foreground">
                            {t(`subscription.${subscription.plan}`)}
                          </span>
                        </div>
                      )}
                      {subscription?.nextBillingDate && (
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-muted-foreground">
                            {t('settings.subscription.nextBillingLabel')}
                          </span>
                          <span className="font-semibold text-foreground">
                            {subscription.nextBillingDate}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mx-4 h-px bg-amber-500/15" />
                  </>
                )}
                <SettingToggleRow
                  label={t('settings.subscription.autoRenew.label')}
                  description={t('settings.subscription.autoRenew.description')}
                  extra={
                    subscription?.nextBillingDate
                      ? t('settings.subscription.nextBillingDate', {
                          date: subscription.nextBillingDate,
                        })
                      : undefined
                  }
                  checked={subscription?.autoRenew ?? false}
                  onCheckedChange={updateAutoRenew}
                  disabled={isToggling}
                />
              </>
            )}
          </div>
        ) : (
          <SettingsGroup title={t('settings.subscription.title')}>
            <SettingLinkRow
              href="/subscription"
              icon={<CreditCard className="h-4 w-4" />}
              label={t('settings.subscription.goPremium')}
              description={t('settings.subscription.goPremiumDesc')}
            />
          </SettingsGroup>
        )}

        {/* Legal */}
        <SettingsGroup title={t('settings.legal.title')}>
          <SettingLinkRow
            href="/terms"
            icon={<FileText className="h-4 w-4" />}
            label={t('settings.legal.terms.label')}
            description={t('settings.legal.terms.description')}
          />
        </SettingsGroup>

        {/* Support */}
        <SettingsGroup title={t('settings.support.title')}>
          <SettingLinkRow
            href="/faq"
            icon={<HelpCircle className="h-4 w-4" />}
            label={t('settings.support.faq.label')}
            description={t('settings.support.faq.description')}
          />
        </SettingsGroup>
      </div>
    </PageContainer>
  );
}
