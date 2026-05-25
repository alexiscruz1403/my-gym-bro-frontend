'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { hasCompletePhysicalData } from '@/lib/ranks';
import type { Gender, PhysicalData, UserResponse } from '@/types/domain.types';

const toNullableNumber = (v: unknown): number | null =>
  v === '' || v == null || (typeof v === 'number' && isNaN(v)) ? null : Number(v);

const GENDER_OPTIONS: Gender[] = ['male', 'female', 'prefer_not_to_say'];

function buildSchema(t: (key: string) => string) {
  return z.object({
    weightValue: z.number().min(20, t('profile.physicalData.weightRange')).max(300, t('profile.physicalData.weightRange')).nullable(),
    weightUnit: z.enum(['kg', 'lbs']),
    heightValue: z.number().min(1, t('profile.physicalData.heightRange')).max(300, t('profile.physicalData.heightRange')).nullable(),
    heightUnit: z.enum(['cm', 'ft']),
    bodyFatPercent: z.number().min(1, t('profile.physicalData.bodyFatRange')).max(70, t('profile.physicalData.bodyFatRange')).nullable(),
    gender: z.enum(['male', 'female', 'prefer_not_to_say']).nullable(),
  });
}

type PhysicalDataFormValues = {
  weightValue: number | null;
  weightUnit: 'kg' | 'lbs';
  heightValue: number | null;
  heightUnit: 'cm' | 'ft';
  bodyFatPercent: number | null;
  gender: Gender | null;
};

interface BodyMetricsSectionProps {
  user: UserResponse;
  onSave: (data: PhysicalData) => Promise<boolean>;
}

export function BodyMetricsSection({ user, onSave }: BodyMetricsSectionProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PhysicalDataFormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      weightValue: user.physicalData?.weightValue ?? null,
      weightUnit: user.physicalData?.weightUnit ?? 'kg',
      heightValue: user.physicalData?.heightValue ?? null,
      heightUnit: user.physicalData?.heightUnit ?? 'cm',
      bodyFatPercent: user.physicalData?.bodyFatPercent ?? null,
      gender: user.physicalData?.gender ?? null,
    },
  });

  useEffect(() => {
    reset({
      weightValue: user.physicalData?.weightValue ?? null,
      weightUnit: user.physicalData?.weightUnit ?? 'kg',
      heightValue: user.physicalData?.heightValue ?? null,
      heightUnit: user.physicalData?.heightUnit ?? 'cm',
      bodyFatPercent: user.physicalData?.bodyFatPercent ?? null,
      gender: user.physicalData?.gender ?? null,
    });
  }, [user.physicalData, reset]);

  const weightUnit = watch('weightUnit');
  const heightUnit = watch('heightUnit');
  const gender = watch('gender');

  const onSubmit = async (values: PhysicalDataFormValues) => {
    const payload: PhysicalData = {
      weightValue: values.weightValue,
      weightUnit: values.weightUnit,
      heightValue: values.heightValue,
      heightUnit: values.heightUnit,
      bodyFatPercent: values.bodyFatPercent,
      gender: values.gender ?? undefined,
    };
    await onSave(payload);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 pb-2.5 pt-3.5">
        <p className="font-display text-[16px] font-semibold tracking-[0.01em] text-foreground">
          {t('profile.physicalData.title')}
        </p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{t('profile.physicalData.description')}</p>
      </div>

      <div className="px-4 py-3.5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Weight */}
          <div className="space-y-[5px]">
            <label className="block text-[13px] font-medium text-foreground">
              {t('profile.physicalData.weightLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="20"
                max="300"
                step="0.1"
                className="h-11 flex-1 rounded-2xl border-[1.5px] border-border bg-card px-3 text-center font-display text-[17px] font-semibold text-foreground outline-none transition-all focus:border-primary"
                {...register('weightValue', { setValueAs: toNullableNumber })}
              />
              <div className="flex overflow-hidden rounded-xl border-[1.5px] border-border">
                {(['kg', 'lbs'] as const).map((unit, i) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setValue('weightUnit', unit, { shouldDirty: true })}
                    className={cn(
                      'h-11 cursor-pointer px-3 text-[13px] font-semibold transition-colors',
                      i > 0 && 'border-l border-border',
                      weightUnit === unit ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            {errors.weightValue && (
              <p className="text-[12px] text-destructive">{errors.weightValue.message as string}</p>
            )}
          </div>

          {/* Height */}
          <div className="space-y-[5px]">
            <label className="block text-[13px] font-medium text-foreground">
              {t('profile.physicalData.heightLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="300"
                step="0.1"
                className="h-11 flex-1 rounded-2xl border-[1.5px] border-border bg-card px-3 text-center font-display text-[17px] font-semibold text-foreground outline-none transition-all focus:border-primary"
                {...register('heightValue', { setValueAs: toNullableNumber })}
              />
              <div className="flex overflow-hidden rounded-xl border-[1.5px] border-border">
                {(['cm', 'ft'] as const).map((unit, i) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setValue('heightUnit', unit, { shouldDirty: true })}
                    className={cn(
                      'h-11 cursor-pointer px-3 text-[13px] font-semibold transition-colors',
                      i > 0 && 'border-l border-border',
                      heightUnit === unit ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            {heightUnit === 'ft' && (
              <p className="text-[12px] text-muted-foreground">{t('profile.physicalData.heightHintFt')}</p>
            )}
            {errors.heightValue && (
              <p className="text-[12px] text-destructive">{errors.heightValue.message as string}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-[5px]">
            <label className="block text-[13px] font-medium text-foreground">
              {t('profile.physicalData.genderLabel')}
            </label>
            <div className="flex overflow-hidden rounded-xl border-[1.5px] border-border">
              {GENDER_OPTIONS.map((g, i) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setValue('gender', g, { shouldDirty: true })}
                  className={cn(
                    'flex-1 h-11 cursor-pointer px-2 text-[12px] font-semibold transition-colors',
                    i > 0 && 'border-l border-border',
                    gender === g ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  {t(`profile.physicalData.gender_${g}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Body fat percentage */}
          <div className="space-y-[5px]">
            <label className="block text-[13px] font-medium text-foreground">
              {t('profile.physicalData.bodyFatLabel')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="70"
                step="0.1"
                className="h-11 w-full rounded-2xl border-[1.5px] border-border bg-card px-3 pr-10 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
                {...register('bodyFatPercent', { setValueAs: toNullableNumber })}
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
                {t('profile.physicalData.bodyFatUnit')}
              </span>
            </div>
            {errors.bodyFatPercent && (
              <p className="text-[12px] text-destructive">{errors.bodyFatPercent.message as string}</p>
            )}
          </div>

          {!hasCompletePhysicalData(user) && (
            <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-[12px] leading-normal text-amber-600 dark:text-amber-400">
              {t('profile.physicalData.ranksHint')}
            </p>
          )}

          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-primary text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? t('profile.physicalData.saving') : t('profile.physicalData.save')}
          </button>
        </form>
      </div>
    </div>
  );
}
