'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth.schemas';

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error(t('auth.error.generic'));
    }
  };

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t('auth.forgotPasswordFlow.success.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('auth.forgotPasswordFlow.success.description')}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            <Link href="/login" className="text-primary hover:underline">
              {t('auth.forgotPasswordFlow.success.backToLogin')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">{t('auth.forgotPasswordFlow.title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <p className="text-sm text-muted-foreground">
            {t('auth.forgotPasswordFlow.description')}
          </p>
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t('auth.forgotPasswordFlow.submitting') : t('auth.forgotPasswordFlow.submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              {t('auth.forgotPasswordFlow.backToLogin')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
