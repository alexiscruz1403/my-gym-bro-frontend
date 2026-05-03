'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserList } from '@/components/admin/AdminUserList';
import { AdminExerciseList } from '@/components/admin/AdminExerciseList';
import { AdminPaymentLogList } from '@/components/admin/AdminPaymentLogList';
import useAuthStore from '@/store/auth.store';

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold mb-6">Admin</h1>
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="exercises">
          <AdminExerciseList />
        </TabsContent>
        <TabsContent value="payments">
          <AdminPaymentLogList />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
