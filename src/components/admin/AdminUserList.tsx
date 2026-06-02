'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminUserRow } from './AdminUserRow';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export function AdminUserList() {
  const { t } = useTranslation();
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

  const selectCls = 'h-10 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] px-2.5 outline-none cursor-pointer focus:border-primary transition-colors';

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={username}
            onChange={(e) => handleUsernameSearch(e.target.value)}
            placeholder={t('admin.users.searchPlaceholder')}
            className="w-full h-10 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] pl-9 pr-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
          />
        </div>
        <select
          value={role}
          onChange={(e) => handleRoleFilter(e.target.value as typeof role)}
          className={selectCls}
        >
          <option value="">{t('admin.users.allRoles')}</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={membershipTier}
          onChange={(e) => handleTierFilter(e.target.value as typeof membershipTier)}
          className={selectCls}
        >
          <option value="">{t('admin.users.allMemberships')}</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-18 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
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
