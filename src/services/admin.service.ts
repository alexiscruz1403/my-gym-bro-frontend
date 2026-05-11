import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  PaginatedAdminUserResponse,
  AdminUserItem,
  UserRole,
  MembershipTier,
  GiftMembershipDto,
  RevokeMembershipDto,
  PaginatedPaymentLogResponse,
  SubscriptionPlan,
  SubscriptionStatus,
  AdminTermsSection,
  CreateAdminTermsSectionDto,
  UpdateAdminTermsSectionDto,
} from '@/types/domain.types';
import type { PaginationParams } from '@/types/api.types';

interface AdminUsersParams extends PaginationParams {
  username?: string;
  role?: UserRole;
  membershipTier?: MembershipTier;
}

interface AdminPaymentLogsParams extends PaginationParams {
  userId?: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
}

export const adminService = {
  listUsers: (params?: AdminUsersParams): Promise<PaginatedAdminUserResponse> =>
    apiClient.get<PaginatedAdminUserResponse>(API_ROUTES.admin.users, { params }).then((r) => r.data),

  setUserStatus: (id: string, isActive: boolean): Promise<AdminUserItem> =>
    apiClient.patch<AdminUserItem>(API_ROUTES.admin.setUserStatus(id), { isActive }).then((r) => r.data),

  setUserRole: (id: string, role: UserRole): Promise<AdminUserItem> =>
    apiClient.patch<AdminUserItem>(API_ROUTES.admin.setUserRole(id), { role }).then((r) => r.data),

  giftMembership: (id: string, dto: GiftMembershipDto): Promise<void> =>
    apiClient.post<void>(API_ROUTES.admin.giftMembership(id), dto).then((r) => r.data),

  revokeMembership: (id: string, dto: RevokeMembershipDto): Promise<void> =>
    apiClient.post<void>(API_ROUTES.admin.revokeMembership(id), dto).then((r) => r.data),

  listPaymentLogs: (params?: AdminPaymentLogsParams): Promise<PaginatedPaymentLogResponse> =>
    apiClient.get<PaginatedPaymentLogResponse>(API_ROUTES.admin.paymentLogs, { params }).then((r) => r.data),

  listAllTerms: (): Promise<AdminTermsSection[]> =>
    apiClient.get<AdminTermsSection[]>(API_ROUTES.terms.adminList).then((r) => r.data),


  createAdminTermsSection: (dto: CreateAdminTermsSectionDto): Promise<AdminTermsSection> =>
    apiClient.post<AdminTermsSection>(API_ROUTES.terms.create, dto).then((r) => r.data),

  updateAdminTermsSection: (id: string, dto: UpdateAdminTermsSectionDto): Promise<AdminTermsSection> =>
    apiClient.patch<AdminTermsSection>(API_ROUTES.terms.update(id), dto).then((r) => r.data),

  deleteAdminTermsSection: (id: string): Promise<void> =>
    apiClient.delete(API_ROUTES.terms.delete(id)).then(() => undefined),
};
