'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { AdminUserItem, UserRole, SubscriptionPlan } from '@/types/domain.types';

interface AdminUserRowProps {
  user: AdminUserItem;
  onSetStatus: (id: string, isActive: boolean) => Promise<void>;
  onSetRole: (id: string, role: UserRole) => Promise<void>;
  onGiftMembership: (id: string, plan: SubscriptionPlan) => Promise<void>;
  onRevokeMembership: (id: string, reason: string) => Promise<void>;
}

type InlineAction = null | 'gift' | 'revoke';

function StatusBadge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full text-[10px] font-semibold px-2 py-0.5', className)}>
      {children}
    </span>
  );
}

function ActBtn({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'h-8 px-3 rounded-xl text-[12px] font-medium cursor-pointer border-[1.5px] border-border bg-transparent text-foreground transition-colors hover:bg-muted/60 disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminUserRow({ user, onSetStatus, onSetRole, onGiftMembership, onRevokeMembership }: AdminUserRowProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState<InlineAction>(null);
  const [giftPlan, setGiftPlan] = useState<SubscriptionPlan>('monthly');
  const [revokeReason, setRevokeReason] = useState('');

  const handleStatusToggle = async () => {
    setBusy(true);
    try { await onSetStatus(user._id, !user.isActive); } finally { setBusy(false); }
  };

  const handleRoleToggle = async () => {
    const next: UserRole = user.role === 'admin' ? 'user' : 'admin';
    setBusy(true);
    try { await onSetRole(user._id, next); } finally { setBusy(false); }
  };

  const handleGiftConfirm = async () => {
    setBusy(true);
    try { await onGiftMembership(user._id, giftPlan); setAction(null); } finally { setBusy(false); }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeReason.trim()) return;
    setBusy(true);
    try {
      await onRevokeMembership(user._id, revokeReason.trim());
      setAction(null);
      setRevokeReason('');
    } finally { setBusy(false); }
  };

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm">
      {/* Top: user info + badges */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-foreground">{user.username}</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <StatusBadge className={user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/25' : 'bg-muted/60 text-muted-foreground border border-border'}>
            {user.role}
          </StatusBadge>
          <StatusBadge className={user.isActive ? 'bg-green-500/10 text-green-600 border border-green-500/25 dark:text-green-400' : 'bg-destructive/10 text-destructive border border-destructive/25'}>
            {user.isActive ? t('admin.users.active') : t('admin.users.inactive')}
          </StatusBadge>
          {user.membershipTier === 'premium' && (
            <StatusBadge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
              ✦ Premium
            </StatusBadge>
          )}
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-border">
        <ActBtn disabled={busy} onClick={handleRoleToggle}>
          {user.role === 'admin' ? t('admin.users.demote') : t('admin.users.promote')}
        </ActBtn>
        <ActBtn
          disabled={busy}
          onClick={handleStatusToggle}
          className={user.isActive
            ? 'text-destructive border-destructive/30 hover:bg-destructive/10'
            : 'text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10'}
        >
          {user.isActive ? t('admin.users.deactivate') : t('admin.users.activate')}
        </ActBtn>
        <ActBtn
          disabled={busy}
          onClick={() => setAction(action === 'gift' ? null : 'gift')}
          className="text-amber-600 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/15"
        >
          {t('admin.users.giftPremium')}
        </ActBtn>
        {user.membershipTier === 'premium' && (
          <ActBtn
            disabled={busy}
            onClick={() => setAction(action === 'revoke' ? null : 'revoke')}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            {t('admin.users.revoke')}
          </ActBtn>
        )}
      </div>

      {/* Gift inline form */}
      {action === 'gift' && (
        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border flex-wrap">
          <span className="text-[12px] text-muted-foreground">{t('admin.users.plan')}:</span>
          <select
            value={giftPlan}
            onChange={(e) => setGiftPlan(e.target.value as SubscriptionPlan)}
            className="h-8.5 rounded-xl border-[1.5px] border-border bg-card text-foreground text-[12px] px-2.5 outline-none cursor-pointer"
          >
            <option value="monthly">{t('admin.users.monthly')}</option>
            <option value="annual">{t('admin.users.annual')}</option>
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={handleGiftConfirm}
            className="h-8.5 px-3 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold cursor-pointer border-none transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t('admin.users.confirm')}
          </button>
          <button
            type="button"
            onClick={() => setAction(null)}
            className="h-8.5 px-3 rounded-xl bg-transparent text-muted-foreground text-[12px] font-medium cursor-pointer border-[1.5px] border-border transition-colors hover:bg-muted/60"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}

      {/* Revoke inline form */}
      {action === 'revoke' && (
        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border flex-wrap">
          <input
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            placeholder={t('admin.users.revokeReasonPlaceholder')}
            className="h-8.5 flex-1 min-w-30 rounded-xl border-[1.5px] border-border bg-card text-foreground text-[12px] px-2.5 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            disabled={busy || !revokeReason.trim()}
            onClick={handleRevokeConfirm}
            className="h-8.5 px-3 rounded-xl bg-destructive text-white text-[12px] font-semibold cursor-pointer border-none transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0"
          >
            {t('admin.users.confirm')}
          </button>
          <button
            type="button"
            onClick={() => { setAction(null); setRevokeReason(''); }}
            className="h-8.5 px-3 rounded-xl bg-transparent text-muted-foreground text-[12px] font-medium cursor-pointer border-[1.5px] border-border transition-colors hover:bg-muted/60 shrink-0"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}
    </div>
  );
}
