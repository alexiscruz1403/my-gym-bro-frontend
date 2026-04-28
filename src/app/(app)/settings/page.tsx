'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useSubscription } from '@/hooks/useSubscription';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';

const NOTIFICATION_ITEMS = [
  {
    key: 'allowFollow' as const,
    label: 'Nuevo seguidor',
    description: 'Cuando alguien empieza a seguirte',
  },
  {
    key: 'allowPostLike' as const,
    label: 'Like en un post',
    description: 'Cuando alguien le da like a uno de tus posts',
  },
  {
    key: 'allowPostComment' as const,
    label: 'Comentario en un post',
    description: 'Cuando alguien comenta en uno de tus posts',
  },
  {
    key: 'allowNewPost' as const,
    label: 'Nuevo post de alguien que sigues',
    description: 'Cuando alguien a quien sigues publica un post',
  },
] as const;

export default function SettingsPage() {
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();
  const { user, setUser } = useAuthStore();
  const { subscription, isLoading: subLoading, updateAutoRenew, isToggling } = useSubscription();

  const showAutoRenew =
    user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

  async function handlePrivacyToggle(checked: boolean) {
    if (!user) return;
    setUser({ ...user, isPrivate: checked });
    try {
      const updated = await usersService.updateProfile({ isPrivate: checked });
      setUser(updated);
    } catch {
      setUser({ ...user, isPrivate: !checked });
    }
  }

  return (
    <PageContainer>
      <h1 className="font-display text-xl font-semibold mb-6">Ajustes</h1>

      <div className="space-y-4">
        {/* Notification preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-36 rounded" />
                      <Skeleton className="h-3 w-52 rounded" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                ))
              : NOTIFICATION_ITEMS.map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Switch
                      checked={preferences?.[key] ?? true}
                      onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
                      aria-label={label}
                      className={'cursor-pointer'}
                    />
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Privacidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 flex-1">
                <p className="text-sm font-medium">Perfil privado</p>
                <p className="text-xs text-muted-foreground">
                  Solo tus seguidores aprobados podrán ver tu perfil y posts
                </p>
              </div>
              <Switch
                checked={user?.isPrivate ?? false}
                onCheckedChange={handlePrivacyToggle}
                aria-label="Perfil privado"
                className={'cursor-pointer'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription auto-renew — only for active premium users */}
        {showAutoRenew && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Suscripción</CardTitle>
            </CardHeader>
            <CardContent>
              {subLoading ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-52 rounded" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <p className="text-sm font-medium">Renovación automática</p>
                    <p className="text-xs text-muted-foreground">
                      Tu suscripción se renovará automáticamente al vencer
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Próximo pago: {subscription?.nextBillingDate}</p>
                  </div>
                  <Switch
                    checked={subscription?.autoRenew ?? user?.autoRenew ?? false}
                    onCheckedChange={(checked) => updateAutoRenew(checked)}
                    disabled={isToggling}
                    aria-label="Renovación automática"
                    className="cursor-pointer"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
