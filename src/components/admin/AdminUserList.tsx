'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminUserRow } from './AdminUserRow';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export function AdminUserList() {
  const { users, meta, page, isLoading, search, fetchPage, handleSearch, setStatus, setRole } = useAdminUsers();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by username…"
        className="max-w-sm"
      />

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
              key={user.id}
              user={user}
              onSetStatus={setStatus}
              onSetRole={setRole}
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
