import { cn } from '@/lib/utils';

export type HistoryTab = 'history' | 'stats';

interface HistoryTabSwitcherProps {
  activeTab: HistoryTab;
  onChange: (tab: HistoryTab) => void;
}

const TABS: { value: HistoryTab; label: string }[] = [
  { value: 'history', label: 'Historial' },
  { value: 'stats', label: 'Estadísticas' },
];

export function HistoryTabSwitcher({ activeTab, onChange }: HistoryTabSwitcherProps) {
  return (
    <div className="flex rounded-lg bg-muted p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors min-h-11',
            activeTab === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
