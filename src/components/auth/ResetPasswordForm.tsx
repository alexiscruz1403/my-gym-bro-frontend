'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { AxiosError } from 'axios';
import { authService } from '@/services/auth.service';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations/auth.schemas';
import type { ApiError } from '@/types/api.types';

const INPUT_CLASS =
  'h-11 w-full rounded-lg border border-[oklch(85%_0.012_248)] bg-[oklch(99%_0.002_248)] px-3 text-[15px] text-[oklch(18%_0.015_248)] placeholder:text-[oklch(67%_0.010_248)] outline-none transition-all duration-120 focus:border-[oklch(62%_0.20_35)] focus:ring-[3px] focus:ring-[oklch(62%_0.20_35/0.14)] aria-[invalid=true]:border-[oklch(57%_0.22_20)] aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-[oklch(57%_0.22_20/0.10)] disabled:opacity-50 disabled:cursor-not-allowed';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

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
      setDone(true);
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
    <div
      data-auth-card
      className="w-full rounded-[20px] flex flex-col gap-5 pt-7 px-6 pb-6"
      style={{
        background: 'oklch(99.5% 0.001 248)',
        boxShadow:
          '0 2px 4px oklch(0% 0 0 / 0.08), 0 8px 20px oklch(0% 0 0 / 0.18), 0 28px 64px oklch(0% 0 0 / 0.30)',
      }}
    >
      {!done ? (
        <>
          {/* Header */}
          <div className="flex flex-col gap-[5px]">
            <h1
              className="font-display text-[27px] font-bold tracking-[0.02em] leading-[1.05]"
              style={{ color: 'oklch(18% 0.015 248)' }}
            >
              {t('auth.resetPasswordFlow.title')}
            </h1>
            <p className="text-sm leading-[1.45]" style={{ color: 'oklch(48% 0.015 248)' }}>
              {t('auth.resetPasswordFlow.description')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
            {/* New password */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="rp-pwd"
                className="text-[13px] font-medium"
                style={{ color: 'oklch(18% 0.015 248)' }}
              >
                {t('auth.newPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  id="rp-pwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.newPasswordPlaceholder')}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'rp-pwd-err' : undefined}
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
                  id="rp-pwd-err"
                  className="text-[12px] flex items-center gap-1"
                  style={{ color: 'oklch(57% 0.22 20)' }}
                  role="alert"
                >
                  ⚠ {errors.password.message}
                </span>
              )}
              <PasswordStrength value={passwordValue} />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="rp-conf"
                className="text-[13px] font-medium"
                style={{ color: 'oklch(18% 0.015 248)' }}
              >
                {t('auth.confirmPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  id="rp-conf"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'rp-conf-err' : undefined}
                  className={`${INPUT_CLASS} pr-11`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center cursor-pointer transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-[oklch(62%_0.20_35)] focus-visible:outline-offset-[-2px] rounded-r-lg"
                  style={{ color: 'oklch(67% 0.010 248)' }}
                  aria-label={showConfirm ? t('auth.passwordHide') : t('auth.passwordShow')}
                >
                  {showConfirm ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span
                  id="rp-conf-err"
                  className="text-[12px] flex items-center gap-1"
                  style={{ color: 'oklch(57% 0.22 20)' }}
                  role="alert"
                >
                  ⚠ {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="mt-0.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full flex items-center justify-center gap-2 rounded-lg text-[15px] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-120 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'oklch(62% 0.20 35)', color: 'white' }}
              >
                {isSubmitting ? (
                  <Loader2 className="h-[18px] w-[18px] animate-spin" />
                ) : (
                  t('auth.resetPasswordFlow.submit')
                )}
              </button>
            </div>
          </form>

          {/* Back link */}
          <p className="text-center -mt-1">
            <Link
              href="/login"
              className="text-[13px] font-semibold transition-opacity duration-120 hover:opacity-75"
              style={{ color: 'oklch(62% 0.20 35)' }}
            >
              {t('auth.resetPasswordFlow.backToLogin')}
            </Link>
          </p>
        </>
      ) : (
        /* Success state */
        <div className="flex flex-col items-center gap-3.5 text-center py-2">
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
            style={{ background: 'oklch(95% 0.05 145)' }}
          >
            <Check className="h-7 w-7" strokeWidth={2.5} style={{ color: 'oklch(60% 0.175 145)' }} />
          </div>

          <h2
            className="font-display text-[23px] font-bold tracking-[0.02em]"
            style={{ color: 'oklch(18% 0.015 248)' }}
          >
            {t('auth.resetPasswordFlow.successTitle')}
          </h2>

          <p className="text-sm leading-[1.55] max-w-[280px]" style={{ color: 'oklch(48% 0.015 248)' }}>
            {t('auth.resetPasswordFlow.successBody')}
          </p>

          <Link
            href="/login"
            className="mt-1 h-11 w-full flex items-center justify-center rounded-lg text-[15px] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-120 active:translate-y-px"
            style={{ background: 'oklch(62% 0.20 35)', color: 'white' }}
          >
            {t('auth.resetPasswordFlow.goToLogin')}
          </Link>
        </div>
      )}
    </div>
  );
}
