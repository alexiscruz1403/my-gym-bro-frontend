'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUserItem, UserRole } from '@/types/domain.types';

interface AdminUserRowProps {
  user: AdminUserItem;
  onSetStatus: (id: string, isActive: boolean) => Promise<void>;
  onSetRole: (id: string, role: UserRole) => Promise<void>;
}

export function AdminUserRow({ user, onSetStatus, onSetRole }: AdminUserRowProps) {
  const [busy, setBusy] = useState(false);

  const handleStatusToggle = async () => {
    setBusy(true);
    try {
      console.log('Toggling status for user', user, 'to', !user.isActive);
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

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.username}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
          {user.role}
        </Badge>
        <Badge variant={user.isActive ? 'outline' : 'destructive'} className="text-xs">
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={handleRoleToggle}
          className="min-h-9 text-xs"
        >
          {user.role === 'admin' ? 'Demote' : 'Promote'}
        </Button>
        <Button
          size="sm"
          variant={user.isActive ? 'destructive' : 'outline'}
          disabled={busy}
          onClick={handleStatusToggle}
          className="min-h-9 text-xs"
        >
          {user.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
}
