'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DaySelector } from './DaySelector';
import type { DayOfWeek } from '@/types/domain.types';

interface WizardStep2DaysProps {
  selected: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WizardStep2Days({ selected, onChange, onNext, onBack }: WizardStep2DaysProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">{t('plans.wizard.step2.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {t('plans.wizard.step2.description')}
        </p>
      </div>

      <DaySelector selected={selected} onChange={onChange} />

      {selected.length > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          {selected.length === 1
            ? t('plans.wizard.step2.selectedOne', { count: selected.length })
            : t('plans.wizard.step2.selectedOther', { count: selected.length })}
        </p>
      )}

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-11.5 flex-1 cursor-pointer rounded-2xl border-border text-[14px] font-medium"
        >
          {t('common.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={selected.length === 0}
          className="h-11.5 flex-1 cursor-pointer rounded-2xl text-[15px] font-semibold disabled:opacity-[.45]"
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
}
