'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  onBack?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, backHref, onBack, action, className }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = backHref ? () => router.push(backHref) : onBack;

  return (
    <div
      className={cn(
        'sticky top-14 z-30 flex h-14 items-center gap-2 border-b border-border px-4 backdrop-blur-md',
        className,
      )}
      style={{ background: 'var(--sheet-bg)' }}
    >
      {handleBack && (
        <button
          type="button"
          onClick={handleBack}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <span className="font-display min-w-0 flex-1 truncate text-[17px] font-bold tracking-[0.02em]">
        {title}
      </span>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
