'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { PhysicalData, UserResponse } from '@/types/domain.types';

const toNullableNumber = (v: unknown): number | null =>
  v === '' || v == null || (typeof v === 'number' && isNaN(v)) ? null : Number(v);

function buildSchema(t: (key: string) => string) {
  return z.object({
    weightValue: z.number().min(20, t('profile.physicalData.weightRange')).max(300, t('profile.physicalData.weightRange')).nullable(),
    weightUnit: z.enum(['kg', 'lbs']),
    heightValue: z.number().min(1, t('profile.physicalData.heightRange')).max(300, t('profile.physicalData.heightRange')).nullable(),
    heightUnit: z.enum(['cm', 'ft']),
    bodyFatPercent: z.number().min(1, t('profile.physicalData.bodyFatRange')).max(70, t('profile.physicalData.bodyFatRange')).nullable(),
  });
}

type PhysicalDataFormValues = {
  weightValue: number | null;
  weightUnit: 'kg' | 'lbs';
  heightValue: number | null;
  heightUnit: 'cm' | 'ft';
  bodyFatPercent: number | null;
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
    },
  });

  useEffect(() => {
    reset({
      weightValue: user.physicalData?.weightValue ?? null,
      weightUnit: user.physicalData?.weightUnit ?? 'kg',
      heightValue: user.physicalData?.heightValue ?? null,
      heightUnit: user.physicalData?.heightUnit ?? 'cm',
      bodyFatPercent: user.physicalData?.bodyFatPercent ?? null,
    });
  }, [user.physicalData, reset]);

  const weightUnit = watch('weightUnit');
  const heightUnit = watch('heightUnit');

  const onSubmit = async (values: PhysicalDataFormValues) => {
    const payload: PhysicalData = {
      weightValue: values.weightValue,
      weightUnit: values.weightUnit,
      heightValue: values.heightValue,
      heightUnit: values.heightUnit,
      bodyFatPercent: values.bodyFatPercent,
    };
    await onSave(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('profile.physicalData.title')}</CardTitle>
        <p className="text-muted-foreground text-xs">{t('profile.physicalData.description')}</p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Weight */}
          <div className="space-y-1.5">
            <Label>{t('profile.physicalData.weightLabel')}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="20"
                max="300"
                step="0.1"
                className="flex-1"
                {...register('weightValue', { setValueAs: toNullableNumber })}
              />
              <div className="flex overflow-hidden rounded-md border text-sm">
                {(['kg', 'lbs'] as const).map((unit, i) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setValue('weightUnit', unit, { shouldDirty: true })}
                    className={cn(
                      'cursor-pointer px-3 py-2 transition-colors',
                      i > 0 && 'border-l',
                      weightUnit === unit
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            {errors.weightValue && (
              <p className="text-destructive text-xs">{errors.weightValue.message as string}</p>
            )}
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <Label>{t('profile.physicalData.heightLabel')}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="300"
                step="0.1"
                className="flex-1"
                {...register('heightValue', { setValueAs: toNullableNumber })}
              />
              <div className="flex overflow-hidden rounded-md border text-sm">
                {(['cm', 'ft'] as const).map((unit, i) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setValue('heightUnit', unit, { shouldDirty: true })}
                    className={cn(
                      'cursor-pointer px-3 py-2 transition-colors',
                      i > 0 && 'border-l',
                      heightUnit === unit
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            {heightUnit === 'ft' && (
              <p className="text-muted-foreground text-xs">{t('profile.physicalData.heightHintFt')}</p>
            )}
            {errors.heightValue && (
              <p className="text-destructive text-xs">{errors.heightValue.message as string}</p>
            )}
          </div>

          {/* Body fat percentage */}
          <div className="space-y-1.5">
            <Label>{t('profile.physicalData.bodyFatLabel')}</Label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="70"
                step="0.1"
                className="pr-8"
                {...register('bodyFatPercent', { setValueAs: toNullableNumber })}
              />
              <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {t('profile.physicalData.bodyFatUnit')}
              </span>
            </div>
            {errors.bodyFatPercent && (
              <p className="text-destructive text-xs">{errors.bodyFatPercent.message as string}</p>
            )}
          </div>

          <Button
            type="submit"
            className={cn('w-full', !isDirty || isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer')}
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t('profile.physicalData.saving') : t('profile.physicalData.save')}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
