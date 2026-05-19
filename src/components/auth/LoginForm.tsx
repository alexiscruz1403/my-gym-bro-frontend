'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schemas';

const INPUT_CLASS =
  'h-11 w-full rounded-lg border border-[oklch(85%_0.012_248)] bg-[oklch(99%_0.002_248)] px-3 text-[15px] text-[oklch(18%_0.015_248)] placeholder:text-[oklch(67%_0.010_248)] outline-none transition-all duration-120 focus:border-[oklch(62%_0.20_35)] focus:ring-[3px] focus:ring-[oklch(62%_0.20_35/0.14)] aria-[invalid=true]:border-[oklch(57%_0.22_20)] aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-[oklch(57%_0.22_20/0.10)] disabled:opacity-50 disabled:cursor-not-allowed';

const PRIMARY_BTN_CLASS =
  'h-11 w-full flex items-center justify-center gap-2 rounded-lg text-[15px] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-120 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed';

const GOOGLE_BTN_CLASS =
  'h-11 !bg-[oklch(99.5%_0.001_248)] !border-[oklch(85%_0.012_248)] !text-[oklch(18%_0.015_248)] hover:!bg-[oklch(97%_0.006_248)] hover:!border-[oklch(80%_0.012_248)]';

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
          <h1
            className="font-display text-[27px] font-bold tracking-[0.02em] leading-[1.05]"
            style={{ color: 'oklch(18% 0.015 248)' }}
          >
            {t('auth.login.heading')}
          </h1>
          <p className="text-sm leading-[1.45]" style={{ color: 'oklch(48% 0.015 248)' }}>
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
          {/* Email */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="l-email"
              className="text-[13px] font-medium"
              style={{ color: 'oklch(18% 0.015 248)' }}
            >
              {t('auth.emailLabel')}
            </label>
            <input
              id="l-email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'l-email-err' : undefined}
              className={INPUT_CLASS}
              {...register('email')}
            />
            {errors.email && (
              <span
                id="l-email-err"
                className="text-[12px] flex items-center gap-1"
                style={{ color: 'oklch(57% 0.22 20)' }}
                role="alert"
              >
                ⚠ {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center justify-between">
              <label
                htmlFor="l-pass"
                className="text-[13px] font-medium"
                style={{ color: 'oklch(18% 0.015 248)' }}
              >
                {t('auth.passwordLabel')}
              </label>
              <Link
                href="/forgot-password"
                className="text-[12px] transition-colors duration-120 hover:text-[oklch(62%_0.20_35)]"
                style={{ color: 'oklch(48% 0.015 248)' }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <input
                id="l-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'l-pass-err' : undefined}
                className={`${INPUT_CLASS} pr-11`}
                {...register('password')}
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
                id="l-pass-err"
                className="text-[12px] flex items-center gap-1"
                style={{ color: 'oklch(57% 0.22 20)' }}
                role="alert"
              >
                ⚠ {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="mt-0.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className={PRIMARY_BTN_CLASS}
              style={{ background: 'oklch(62% 0.20 35)', color: 'white' }}
            >
              {isSubmitting ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                t('auth.login.submit')
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'oklch(88% 0.010 248)' }} />
          <span className="text-[12px]" style={{ color: 'oklch(67% 0.010 248)' }}>
            {t('common.or')}
          </span>
          <div className="flex-1 h-px" style={{ background: 'oklch(88% 0.010 248)' }} />
        </div>

        {/* Google */}
        <GoogleAuthButton className={GOOGLE_BTN_CLASS} />
      </div>

      {/* Footer */}
      <p className="text-[13px] text-center" style={{ color: 'oklch(58% 0.012 248)' }}>
        {t('auth.noAccount')}{' '}
        <Link
          href="/register"
          className="font-semibold transition-opacity duration-120 hover:opacity-75"
          style={{ color: 'oklch(62% 0.20 35)' }}
        >
          {t('auth.registerLink')}
        </Link>
      </p>
    </>
  );
}
