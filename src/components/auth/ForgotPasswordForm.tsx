'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth.schemas';

const INPUT_CLASS =
  'h-11 w-full rounded-lg border border-[oklch(85%_0.012_248)] bg-[oklch(99%_0.002_248)] px-3 text-[15px] text-[oklch(18%_0.015_248)] placeholder:text-[oklch(67%_0.010_248)] outline-none transition-all duration-120 focus:border-[oklch(62%_0.20_35)] focus:ring-[3px] focus:ring-[oklch(62%_0.20_35/0.14)] aria-[invalid=true]:border-[oklch(57%_0.22_20)] aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-[oklch(57%_0.22_20/0.10)] disabled:opacity-50 disabled:cursor-not-allowed';

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

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
      setSubmittedEmail(data.email);
      setSent(true);
    } catch {
      toast.error(t('auth.error.generic'));
    }
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
        {!sent ? (
          <>
            {/* Back link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-[5px] text-[13px] font-medium transition-colors duration-120 self-start hover:text-[oklch(18%_0.015_248)]"
              style={{ color: 'oklch(48% 0.015 248)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('auth.forgotPasswordFlow.backLink')}
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-[5px]">
              <h1
                className="font-display text-[27px] font-bold tracking-[0.02em] leading-[1.05]"
                style={{ color: 'oklch(18% 0.015 248)' }}
              >
                {t('auth.forgotPasswordFlow.heading')}
              </h1>
              <p className="text-sm leading-[1.45]" style={{ color: 'oklch(48% 0.015 248)' }}>
                {t('auth.forgotPasswordFlow.subtitle')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-[5px]">
                <label
                  htmlFor="f-email"
                  className="text-[13px] font-medium"
                  style={{ color: 'oklch(18% 0.015 248)' }}
                >
                  {t('auth.emailLabel')}
                </label>
                <input
                  id="f-email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'f-email-err' : undefined}
                  className={INPUT_CLASS}
                  {...register('email')}
                />
                {errors.email && (
                  <span
                    id="f-email-err"
                    className="text-[12px] flex items-center gap-1"
                    style={{ color: 'oklch(57% 0.22 20)' }}
                    role="alert"
                  >
                    ⚠ {errors.email.message}
                  </span>
                )}
              </div>

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
                    t('auth.forgotPasswordFlow.submit')
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center gap-3.5 text-center py-2">
            <div
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
              style={{ background: 'oklch(95% 0.05 145)' }}
            >
              <Mail className="h-7 w-7" style={{ color: 'oklch(60% 0.175 145)' }} />
            </div>

            <h2
              className="font-display text-[23px] font-bold tracking-[0.02em]"
              style={{ color: 'oklch(18% 0.015 248)' }}
            >
              {t('auth.forgotPasswordFlow.success.title')}
            </h2>

            <p className="text-sm leading-[1.55] max-w-[280px]" style={{ color: 'oklch(48% 0.015 248)' }}>
              {t('auth.forgotPasswordFlow.success.description')}{' '}
              <span className="font-semibold" style={{ color: 'oklch(18% 0.015 248)' }}>
                {submittedEmail}
              </span>
              .
            </p>

            <Link
              href="/login"
              className="mt-1 h-11 w-full flex items-center justify-center rounded-lg text-[15px] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-120 active:translate-y-px border border-[oklch(85%_0.012_248)] hover:bg-[oklch(97%_0.006_248)]"
              style={{ background: 'oklch(99.5% 0.001 248)', color: 'oklch(18% 0.015 248)' }}
            >
              {t('auth.forgotPasswordFlow.success.backToLogin')}
            </Link>
          </div>
        )}
      </div>

      {!sent && (
        <p className="text-[13px] text-center" style={{ color: 'oklch(58% 0.012 248)' }}>
          {t('auth.forgotPasswordFlow.remembered')}{' '}
          <Link
            href="/login"
            className="font-semibold transition-opacity duration-120 hover:opacity-75"
            style={{ color: 'oklch(62% 0.20 35)' }}
          >
            {t('auth.loginLink')}
          </Link>
        </p>
      )}
    </>
  );
}
