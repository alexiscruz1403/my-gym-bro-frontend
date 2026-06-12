'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PublicSessionHistory } from '@/components/profile/PublicSessionHistory';
import { AchievementsSection } from '@/components/achievements/AchievementsSection';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useAuth } from '@/hooks/useAuth';

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { profile, isLoading, error } = usePublicProfile(id);
  const { user: viewer } = useAuth();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
          <div className="flex gap-6">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <EmptyState
          title={t('profile.notFound')}
          description={t('profile.notFoundDescription')}
        />
      </PageContainer>
    );
  }

  const isPrivateAndBlocked = profile.isPrivate && !profile.isFollowing;

  return (
    <PageContainer>
      <ProfileHeader user={profile} userId={id} />
      {!isPrivateAndBlocked && (
        <div className="space-y-4">
          <PublicSessionHistory userId={id} />
          <AchievementsSection
            achievements={profile.achievements}
            language={viewer?.language ?? 'es'}
          />
        </div>
      )}
    </PageContainer>
  );
}
