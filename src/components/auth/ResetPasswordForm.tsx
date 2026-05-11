'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations/auth.schemas';
import type { ApiError } from '@/types/api.types';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues): Promise<void> => {
    try {
      await authService.resetPassword(token, data.password);
      toast.success(t('auth.resetPasswordFlow.success'));
      router.push('/login');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const status = error.response?.status;
      if (status === 401) {
        toast.error(t('auth.resetPasswordFlow.error.invalidToken'));
      } else {
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        toast.error(displayMessage ?? t('auth.error.generic'));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">{t('auth.resetPasswordFlow.title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <p className="text-sm text-muted-foreground">
            {t('auth.resetPasswordFlow.description')}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="password">{t('auth.newPasswordLabel')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.newPasswordPlaceholder')}
                autoComplete="new-password"
                disabled={isSubmitting}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? t('auth.passwordHide') : t('auth.passwordShow')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                disabled={isSubmitting}
                className="pr-10"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                aria-label={showConfirm ? t('auth.passwordHide') : t('auth.passwordShow')}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t('auth.resetPasswordFlow.submitting') : t('auth.resetPasswordFlow.submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              {t('auth.resetPasswordFlow.backToLogin')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
