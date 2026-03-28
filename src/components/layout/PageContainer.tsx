import { cn } from '@/lib/utils';
import type { PageContainerProps } from '@/types/ui.types';

export function PageContainer({
  children,
  className,
}: Omit<PageContainerProps, 'title' | 'action'>) {
  return (
    <div
      className={cn(
        // Mobile: padding-bottom for fixed BottomNav; desktop: normal padding
        'w-full mx-auto px-4 pt-4 lg:px-6',
        'max-w-[480px] md:max-w-xl lg:max-w-2xl',
        'pb-[calc(64px+1.5rem)] lg:pb-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
