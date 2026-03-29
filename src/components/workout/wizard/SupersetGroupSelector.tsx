'use client';

import { Link } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SupersetGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SupersetGroupSelector({ value, onChange }: SupersetGroupSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium flex items-center gap-1">
        <Link className="h-3 w-3" />
        Superset group (optional)
      </label>
      <Input
        value={value}
        onChange={(e) => {
          const raw = e.target.value.toUpperCase().slice(0, 3);
          onChange(raw);
        }}
        placeholder="e.g. A"
        className="uppercase"
        autoComplete="off"
      />
      <p className="text-muted-foreground text-xs">
        Exercises sharing the same label will be grouped as a superset.
      </p>
    </div>
  );
}
