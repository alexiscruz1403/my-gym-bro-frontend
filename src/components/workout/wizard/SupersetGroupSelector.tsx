'use client';

import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SupersetGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SupersetGroupSelector({ value, onChange }: SupersetGroupSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium flex items-center gap-1">
        <Link className="h-3 w-3" />
        {t('plans.wizard.exerciseConfig.supersetLabel')}
      </label>
      <Input
        value={value}
        onChange={(e) => {
          const raw = e.target.value.toUpperCase().slice(0, 3);
          onChange(raw);
        }}
        placeholder={t('plans.wizard.exerciseConfig.supersetPlaceholder')}
        className="uppercase"
        autoComplete="off"
      />
      <p className="text-muted-foreground text-xs">
        {t('plans.wizard.exerciseConfig.supersetDescription')}
      </p>
    </div>
  );
}
