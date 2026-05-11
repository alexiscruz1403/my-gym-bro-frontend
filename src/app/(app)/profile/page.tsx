'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  const { user, isLoading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        .min(3, t('profile.validation.minChars'))
        .max(20, t('profile.validation.maxChars'))
        .regex(/^[a-zA-Z0-9_ ]+$/, t('profile.validation.invalidChars'))
        .refine((val) => val === val.trim(), t('profile.validation.trimError'))
        .refine((val) => val.trim().length > 0, t('profile.validation.emptySpaces')),
    }),
    [t]
  );

  const {
    register,
    handleSubmit,
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
        <div className="flex rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors min-h-11 cursor-pointer',
                activeTab === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('profile.edit.title')}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">{t('profile.edit.usernameLabel')}</Label>
                    <Input id="username" {...register('username')} />
                    {errors.username && (
                      <p className="text-xs text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className={cn('w-full', isSubmitting || !isDirty ? 'cursor-not-allowed' : 'cursor-pointer')}
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? t('profile.edit.saving') : t('profile.edit.save')}
                  </Button>
                </CardContent>
              </form>
            </Card>

            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive cursor-pointer"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('profile.logout')}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('profile.deleteAccount')}
            </Button>

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
                  <Button variant="outline" size="sm" className="min-h-11" onClick={refetch}>
                    {t('profile.history.retry')}
                  </Button>
                }
              />
            )}

            {!histLoading && !histError && data.length === 0 && (
              <EmptyState
                title={t('profile.history.empty.title')}
                description={t('profile.history.empty.description')}
                action={
                  <Button size="sm" className="min-h-11" render={<Link href="/dashboard" />}>
                    {t('profile.history.goToDashboard')}
                  </Button>
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
      </div>
    </PageContainer>
  );
}
