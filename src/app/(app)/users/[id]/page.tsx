'use client';

import { use } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Skeleton } from '@/components/ui/skeleton';
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
