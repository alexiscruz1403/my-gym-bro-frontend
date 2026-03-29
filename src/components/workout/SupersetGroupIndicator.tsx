import { Link } from 'lucide-react';

interface SupersetGroupIndicatorProps {
  label?: string;
}

export function SupersetGroupIndicator({ label = 'Superset' }: SupersetGroupIndicatorProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-1 px-4 text-xs">
      <Link className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
