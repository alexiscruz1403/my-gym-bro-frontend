'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { planNameSchema, type PlanNameFormValues } from '@/lib/validations/workout-plan.schemas';

interface WizardStep1NameProps {
  defaultValue: string;
  onNext: (name: string) => void;
}

export function WizardStep1Name({ defaultValue, onNext }: WizardStep1NameProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanNameFormValues>({
    resolver: zodResolver(planNameSchema),
    defaultValues: { name: defaultValue },
  });

  const onSubmit = (values: PlanNameFormValues) => onNext(values.name);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">{t('plans.wizard.step1.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {t('plans.wizard.step1.description')}
        </p>
      </div>

      <div className="space-y-1.5">
        <Input
          {...register('name')}
          placeholder={t('plans.wizard.step1.placeholder')}
          autoFocus
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full cursor-pointer">
        {t('common.continue')}
      </Button>
    </form>
  );
}
