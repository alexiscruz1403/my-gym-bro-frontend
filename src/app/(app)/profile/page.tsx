'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogOut } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Solo letras, números, guión bajo y espacios')
    .refine((val) => val === val.trim(), 'No puede comenzar ni terminar con espacios')
    .refine((val) => val.trim().length > 0, 'El usuario no puede ser solo espacios'),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function ProfilePage() {
  const { logout } = useAuth();
  const { user, isLoading, updateProfile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    values: { username: user?.username ?? '' },
  });

  const onSubmit = async (data: EditProfileValues): Promise<void> => {
    await updateProfile(data);
  };

  if (isLoading && !user) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (!user) return null;

  return (
    <PageContainer>
      <div className="space-y-6">
        <ProfileHeader user={user} />

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editar perfil</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input id="username" {...register('username')} />
                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className={cn("w-full", isSubmitting || !isDirty ? 'cursor-not-allowed' : 'cursor-pointer')}
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar cambios
              </Button>
            </CardContent>
          </form>
        </Card>

        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </PageContainer>
  );
}
