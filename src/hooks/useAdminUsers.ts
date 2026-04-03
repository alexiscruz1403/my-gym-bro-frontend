'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { AdminUserItem, PaginatedMeta, UserRole } from '@/types/domain.types';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback((targetPage: number, q?: string) => {
    setIsLoading(true);
    adminService
      .listUsers({ page: targetPage, limit: 20, search: (q ?? search) || undefined })
      .then(({ data, meta: m }) => {
        setUsers(data);
        setMeta(m);
        setPage(targetPage);
      })
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setIsLoading(false));
  }, [search]);

  const handleSearch = (q: string) => {
    setSearch(q);
    fetchPage(1, q);
  };

  const setStatus = async (id: string, isActive: boolean) => {
    const updated = await adminService.setUserStatus(id, isActive);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const setRole = async (id: string, role: UserRole) => {
    const updated = await adminService.setUserRole(id, role);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  return { users, meta, page, isLoading, search, fetchPage, handleSearch, setStatus, setRole };
}
