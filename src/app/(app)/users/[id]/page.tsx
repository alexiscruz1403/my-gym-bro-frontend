'use client';

import { use } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePublicProfile } from '@/hooks/usePublicProfile';

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = use(params);
  const { profile, isLoading, error } = usePublicProfile(id);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <EmptyState title="User not found" description="This profile does not exist or could not be loaded." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProfileHeader user={profile} userId={id} />
    </PageContainer>
  );
}
