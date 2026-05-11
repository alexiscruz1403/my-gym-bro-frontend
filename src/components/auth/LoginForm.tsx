'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schemas';

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    await login(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">{t('auth.login.title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('auth.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="current-password"
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>

          <div className="flex w-full items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{t('common.or')}</span>
            <Separator className="flex-1" />
          </div>

          <GoogleAuthButton />

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline">
              {t('auth.registerLink')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
