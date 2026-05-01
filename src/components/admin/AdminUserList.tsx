'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminUserRow } from './AdminUserRow';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export function AdminUserList() {
  const {
    users,
    meta,
    page,
    isLoading,
    username,
    role,
    membershipTier,
    fetchPage,
    handleUsernameSearch,
    handleRoleFilter,
    handleTierFilter,
    setStatus,
    setRole,
    giftMembership,
    revokeMembership,
  } = useAdminUsers();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          value={username}
          onChange={(e) => handleUsernameSearch(e.target.value)}
          placeholder="Search by username…"
          className="max-w-xs"
        />
        <select
          value={role}
          onChange={(e) => handleRoleFilter(e.target.value as typeof role)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={membershipTier}
          onChange={(e) => handleTierFilter(e.target.value as typeof membershipTier)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All memberships</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-2">
          {users.map((user) => (
            <AdminUserRow
              key={user._id}
              user={user}
              onSetStatus={setStatus}
              onSetRole={setRole}
              onGiftMembership={giftMembership}
              onRevokeMembership={revokeMembership}
            />
          ))}
        </div>
      )}

      {meta && (
        <Pagination page={page} total={meta.total} limit={meta.limit} onPageChange={fetchPage} />
      )}
    </div>
  );
}
