import { apiClient } from '@/lib/axios';
import type { PaginatedAdminUserResponse, AdminUserItem, UserRole } from '@/types/domain.types';
import type { PaginationParams } from '@/types/api.types';

export const adminService = {
  listUsers: (params?: PaginationParams & { search?: string }): Promise<PaginatedAdminUserResponse> =>
    apiClient.get<PaginatedAdminUserResponse>('/admin/users', { params }).then((r) => r.data),

  setUserStatus: (id: string, isActive: boolean): Promise<AdminUserItem> =>
    apiClient.patch<AdminUserItem>(`/admin/users/${id}/status`, { isActive }).then((r) => r.data),

  setUserRole: (id: string, role: UserRole): Promise<AdminUserItem> =>
    apiClient.patch<AdminUserItem>(`/admin/users/${id}/role`, { role }).then((r) => r.data),
};
