'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth.schemas';

const INPUT_CLASS =
  'h-11 w-full rounded-lg border border-input bg-background px-3 text-[15px] text-foreground placeholder:text-[oklch(67%_0.010_248)] outline-none transition-all duration-120 focus:border-primary focus:ring-[3px] focus:ring-primary/14 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed';

const GOOGLE_BTN_CLASS =
  'h-11 !bg-[oklch(99.5%_0.001_248)] !border-[oklch(85%_0.012_248)] !text-[oklch(18%_0.015_248)] hover:!bg-[oklch(97%_0.006_248)] hover:!border-[oklch(80%_0.012_248)]';

export function RegisterForm() {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues): Promise<void> => {
    await registerUser(data);
  };

  return (
    <>
      <div
        data-auth-card
        className="w-full rounded-[20px] flex flex-col gap-5 pt-7 px-6 pb-6"
        style={{
          background: 'oklch(99.5% 0.001 248)',
          boxShadow:
            '0 2px 4px oklch(0% 0 0 / 0.08), 0 8px 20px oklch(0% 0 0 / 0.18), 0 28px 64px oklch(0% 0 0 / 0.30)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col gap-[5px]">
          <h1 className="font-display text-[27px] font-bold tracking-[0.02em] leading-[1.05] text-foreground">
            {t('auth.register.title')}
          </h1>
          <p className="text-sm leading-[1.45] text-muted-foreground">
            {t('auth.register.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
          {/* Email */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="r-email" className="text-[13px] font-medium text-foreground">
              {t('auth.emailLabel')}
            </label>
            <input
              id="r-email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'r-email-err' : undefined}
              className={INPUT_CLASS}
              {...register('email')}
            />
            {errors.email && (
              <span
                id="r-email-err"
                className="text-[12px] flex items-center gap-1 text-destructive"
                role="alert"
              >
                ⚠ {errors.email.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="r-user" className="text-[13px] font-medium text-foreground">
              {t('auth.usernameLabel')}
            </label>
            <input
              id="r-user"
              type="text"
              placeholder={t('auth.usernamePlaceholder')}
              autoComplete="username"
              disabled={isSubmitting}
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'r-user-err' : 'r-user-hint'}
              className={INPUT_CLASS}
              {...register('username')}
            />
            {errors.username ? (
              <span
                id="r-user-err"
                className="text-[12px] flex items-center gap-1 text-destructive"
                role="alert"
              >
                ⚠ {errors.username.message}
              </span>
            ) : (
              <span
                id="r-user-hint"
                className="text-[12px] text-[oklch(67%_0.010_248)]"
              >
                Solo letras, números, guión y guión bajo
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="r-pass" className="text-[13px] font-medium text-foreground">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="r-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordMinLength')}
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'r-pass-err' : undefined}
                className={`${INPUT_CLASS} pr-11`}
                {...register('password', {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center cursor-pointer transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-[oklch(62%_0.20_35)] focus-visible:outline-offset-[-2px] rounded-r-lg"
                style={{ color: 'oklch(67% 0.010 248)' }}
                aria-label={showPassword ? t('auth.passwordHide') : t('auth.passwordShow')}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>
            {errors.password && (
              <span
                id="r-pass-err"
                className="text-[12px] flex items-center gap-1 text-destructive"
                role="alert"
              >
                ⚠ {errors.password.message}
              </span>
            )}
            <PasswordStrength value={passwordValue} />
          </div>

          {/* Submit */}
          <div className="mt-0.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-[15px] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-120 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                t('auth.register.submit')
              )}
            </button>
          </div>
        </form>

        {/* Terms */}
        <p className="text-[11px] text-center leading-[1.5] text-[oklch(67%_0.010_248)]">
          {t('auth.register.termsPrefix')}{' '}
          <Link href="/terms" className="text-primary hover:underline">
            {t('auth.register.termsLink')}
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-[oklch(67%_0.010_248)]">
            {t('common.or')}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google */}
        <GoogleAuthButton className={GOOGLE_BTN_CLASS} />
      </div>

      {/* Footer */}
      <p className="text-[13px] text-center text-[oklch(58%_0.012_248)]">
        {t('auth.hasAccount')}{' '}
        <Link
          href="/login"
          className="font-semibold text-primary transition-opacity duration-120 hover:opacity-75"
        >
          {t('auth.loginLink')}
        </Link>
      </p>
    </>
  );
}
