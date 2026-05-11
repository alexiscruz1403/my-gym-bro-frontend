'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AdminUserItem, UserRole, SubscriptionPlan } from '@/types/domain.types';

interface AdminUserRowProps {
  user: AdminUserItem;
  onSetStatus: (id: string, isActive: boolean) => Promise<void>;
  onSetRole: (id: string, role: UserRole) => Promise<void>;
  onGiftMembership: (id: string, plan: SubscriptionPlan) => Promise<void>;
  onRevokeMembership: (id: string, reason: string) => Promise<void>;
}

type InlineAction = null | 'gift' | 'revoke';

export function AdminUserRow({ user, onSetStatus, onSetRole, onGiftMembership, onRevokeMembership }: AdminUserRowProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState<InlineAction>(null);
  const [giftPlan, setGiftPlan] = useState<SubscriptionPlan>('monthly');
  const [revokeReason, setRevokeReason] = useState('');

  const handleStatusToggle = async () => {
    setBusy(true);
    try {
      await onSetStatus(user._id, !user.isActive);
    } finally {
      setBusy(false);
    }
  };

  const handleRoleToggle = async () => {
    const next: UserRole = user.role === 'admin' ? 'user' : 'admin';
    setBusy(true);
    try {
      await onSetRole(user._id, next);
    } finally {
      setBusy(false);
    }
  };

  const handleGiftConfirm = async () => {
    setBusy(true);
    try {
      await onGiftMembership(user._id, giftPlan);
      setAction(null);
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeReason.trim()) return;
    setBusy(true);
    try {
      await onRevokeMembership(user._id, revokeReason.trim());
      setAction(null);
      setRevokeReason('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card px-4 py-3 space-y- overflow-x-auto lg:overflow-x-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 lg:min-w-0">
          <p className="text-sm font-medium lg:truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground lg:truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
            {user.role}
          </Badge>
          <Badge variant={user.isActive ? 'outline' : 'destructive'} className="text-xs">
            {user.isActive ? t('admin.users.active') : t('admin.users.inactive')}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={handleRoleToggle}
            className="min-h-9 text-xs cursor-pointer"
          >
            {user.role === 'admin' ? t('admin.users.demote') : t('admin.users.promote')}
          </Button>
          <Button
            size="sm"
            variant={user.isActive ? 'destructive' : 'outline'}
            disabled={busy}
            onClick={handleStatusToggle}
            className="min-h-9 text-xs cursor-pointer"
          >
            {user.isActive ? t('admin.users.deactivate') : t('admin.users.activate')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => setAction(action === 'gift' ? null : 'gift')}
            className="min-h-9 text-xs cursor-pointer text-amber-600 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
          >
            {t('admin.users.giftPremium')}
          </Button>
          {user.membershipTier === 'premium' && (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setAction(action === 'revoke' ? null : 'revoke')}
              className="min-h-9 text-xs cursor-pointer text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              {t('admin.users.revoke')}
            </Button>
          )}
        </div>
      </div>

      {action === 'gift' && (
        <div className="flex items-center gap-2 pt-1 border-t">
          <p className="text-xs text-muted-foreground">{t('admin.users.plan')}</p>
          <select
            value={giftPlan}
            onChange={(e) => setGiftPlan(e.target.value as SubscriptionPlan)}
            className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
          >
            <option value="monthly">{t('admin.users.monthly')}</option>
            <option value="annual">{t('admin.users.annual')}</option>
          </select>
          <Button size="sm" disabled={busy} onClick={handleGiftConfirm} className="min-h-8 text-xs cursor-pointer">
            {t('admin.users.confirm')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAction(null)} className="min-h-8 text-xs cursor-pointer">
            {t('common.cancel')}
          </Button>
        </div>
      )}

      {action === 'revoke' && (
        <div className="flex items-center gap-2 pt-1 border-t">
          <Input
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            placeholder={t('admin.users.revokeReasonPlaceholder')}
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            variant="destructive"
            disabled={busy || !revokeReason.trim()}
            onClick={handleRevokeConfirm}
            className="min-h-8 text-xs cursor-pointer shrink-0"
          >
            {t('admin.users.confirm')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setAction(null); setRevokeReason(''); }} className="min-h-8 text-xs cursor-pointer shrink-0">
            {t('common.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
}
