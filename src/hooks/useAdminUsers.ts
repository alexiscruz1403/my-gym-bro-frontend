'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { AdminUserItem, PaginatedMeta, UserRole, MembershipTier, SubscriptionPlan } from '@/types/domain.types';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [membershipTier, setMembershipTier] = useState<MembershipTier | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback(
    (targetPage: number, overrides?: { username?: string; role?: UserRole | ''; membershipTier?: MembershipTier | '' }) => {
      const u = overrides?.username ?? username;
      const r = overrides?.role ?? role;
      const t = overrides?.membershipTier ?? membershipTier;
      setIsLoading(true);
      adminService
        .listUsers({
          page: targetPage,
          limit: 20,
          username: u || undefined,
          role: (r as UserRole) || undefined,
          membershipTier: (t as MembershipTier) || undefined,
        })
        .then(({ data, meta: m }) => {
          setUsers(data);
          setMeta(m);
          setPage(targetPage);
        })
        .catch(() => toast.error('Failed to load users.'))
        .finally(() => setIsLoading(false));
    },
    [username, role, membershipTier],
  );

  const handleUsernameSearch = (q: string) => {
    setUsername(q);
    fetchPage(1, { username: q });
  };

  const handleRoleFilter = (r: UserRole | '') => {
    setRole(r);
    fetchPage(1, { role: r });
  };

  const handleTierFilter = (t: MembershipTier | '') => {
    setMembershipTier(t);
    fetchPage(1, { membershipTier: t });
  };

  const setStatus = async (id: string, isActive: boolean) => {
    const updated = await adminService.setUserStatus(id, isActive);
    setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
  };

  const setRole_ = async (id: string, r: UserRole) => {
    const updated = await adminService.setUserRole(id, r);
    setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
  };

  const giftMembership = async (id: string, plan: SubscriptionPlan) => {
    await adminService.giftMembership(id, { plan });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, membershipTier: 'premium' } : u)));
    toast.success('Membership gifted successfully.');
  };

  const revokeMembership = async (id: string, reason: string) => {
    await adminService.revokeMembership(id, { reason });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, membershipTier: 'free' } : u)));
    toast.success('Membership revoked.');
  };

  return {
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
    setRole: setRole_,
    giftMembership,
    revokeMembership,
  };
}
