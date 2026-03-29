'use client';

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
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">Select training days</h2>
        <p className="text-muted-foreground text-sm">
          Choose which days of the week you'll train.
        </p>
      </div>

      <DaySelector selected={selected} onChange={onChange} />

      {selected.length > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          {selected.length} {selected.length === 1 ? 'day' : 'days'} selected
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 cursor-pointer">
          Back
        </Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1 cursor-pointer">
          Continue
        </Button>
      </div>
    </div>
  );
}
