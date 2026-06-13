'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SessionHistoryList } from '@/components/history/SessionHistoryList';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { useStats } from '@/hooks/useStats';
import { DeleteAccountDialog } from '@/components/profile/DeleteAccountDialog';
import { BodyMetricsSection } from '@/components/profile/BodyMetricsSection';
import { AchievementsSection } from '@/components/achievements/AchievementsSection';
import { TitlesSection } from '@/components/profile/TitlesSection';
import { useTitles, useSetActiveTitle } from '@/hooks/useTitles';
import { cn } from '@/lib/utils';

type EditProfileValues = { username: string };
type ProfileTab = 'profile' | 'history' | 'stats';

function SessionHistorySkeletons() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { user, isLoading, updateProfile, updatePhysicalData } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { titles } = useTitles();
  const { setActiveTitle, isSetting } = useSetActiveTitle();

  const { data, meta, loading: histLoading, error: histError, page, setPage, refetch } = useSessionHistory();
  const {
    period, date, setPeriod, setDate,
    volumeData, muscleData,
    loading: statsLoading, error: statsError,
    weightUnit, setWeightUnit, convertVolume,
  } = useStats();

  const editProfileSchema = useMemo(() =>
    z.object({
      username: z
        .string()
        .min(5, t('profile.validation.minChars'))
        .max(20, t('profile.validation.maxChars'))
        .regex(/^[a-zA-Z0-9\-._]+$/, t('profile.validation.invalidChars'))
        .refine(
          (val) => !/^(admin|support|root|api|system)/i.test(val),
          t('profile.validation.reservedUsername'),
        ),
    }),
    [t]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    values: { username: user?.username ?? '' },
  });

  const TABS: { value: ProfileTab; label: string }[] = [
    { value: 'profile', label: t('profile.tabs.profile') },
    { value: 'history', label: t('profile.tabs.history') },
    { value: 'stats', label: t('profile.tabs.stats') },
  ];

  const onSubmit = async (data: EditProfileValues): Promise<void> => {
    await updateProfile(data);
  };

  if (isLoading && !user) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (!user) return null;

  return (
    <PageContainer>
      <div className="space-y-4">
        <ProfileHeader user={user} />

        {/* Tab switcher */}
        <div className="flex h-11 rounded-xl bg-muted/60 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex-1 cursor-pointer rounded-lg text-[13px] font-semibold transition-all',
                activeTab === tab.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-4 pb-2.5 pt-3.5">
                <p className="font-display text-[16px] font-semibold tracking-[0.01em] text-foreground">
                  {t('profile.edit.title')}
                </p>
              </div>
              <div className="px-4 py-3.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="space-y-[5px]">
                    <label htmlFor="username" className="block text-[13px] font-medium text-foreground">
                      {t('profile.edit.usernameLabel')}
                    </label>
                    <input
                      id="username"
                      {...register('username')}
                      className="h-11 w-full rounded-2xl border-[1.5px] border-border bg-card px-3 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
                    />
                    {errors.username ? (
                      <p className="text-[12px] text-destructive">{errors.username.message}</p>
                    ) : (
                      <p className="text-[12px] text-muted-foreground/70">
                        {t('profile.edit.usernameHint', { count: 20 - (watch('username')?.length ?? 0) })}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-primary text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? t('profile.edit.saving') : t('profile.edit.save')}
                  </button>
                </form>
              </div>
            </div>

            <BodyMetricsSection user={user} onSave={updatePhysicalData} />

            <AchievementsSection achievements={user.achievements} language={user.language} />

            <TitlesSection
              titles={titles}
              language={user.language}
              onSetActive={setActiveTitle}
              isSetting={isSetting}
            />

            <button
              type="button"
              onClick={logout}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-border bg-transparent text-[14px] font-medium text-foreground transition-all hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              {t('profile.logout')}
            </button>

            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t('profile.deleteAccount')}
            </button>

            <DeleteAccountDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            />
          </div>
        )}

        {/* History tab */}
        {activeTab === 'history' && (
          <>
            {histLoading && <SessionHistorySkeletons />}

            {!histLoading && histError && (
              <EmptyState
                title={t('profile.history.error.title')}
                description={t('profile.history.error.description')}
                action={
                  <button
                    type="button"
                    onClick={refetch}
                    className="flex h-11 cursor-pointer items-center rounded-xl border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {t('profile.history.retry')}
                  </button>
                }
              />
            )}

            {!histLoading && !histError && data.length === 0 && (
              <EmptyState
                title={t('profile.history.empty.title')}
                description={t('profile.history.empty.description')}
                action={
                  <Link
                    href="/dashboard"
                    className="flex h-11 cursor-pointer items-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    {t('profile.history.goToDashboard')}
                  </Link>
                }
              />
            )}

            {!histLoading && !histError && data.length > 0 && meta && (
              <SessionHistoryList
                data={data}
                meta={meta}
                page={page}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <StatsPanel
            period={period}
            date={date}
            volumeData={volumeData}
            muscleData={muscleData}
            loading={statsLoading}
            error={statsError}
            onPeriodChange={setPeriod}
            onDateChange={setDate}
            onRetry={() => { setPeriod(period); }}
            weightUnit={weightUnit}
            onWeightUnitChange={setWeightUnit}
            convertVolume={convertVolume}
          />
        )}

          </motion.div>
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
