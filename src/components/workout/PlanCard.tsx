import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronRight, Sparkles } from 'lucide-react';
import type { PlanListItem } from '@/types/domain.types';

interface PlanCardProps {
  plan: PlanListItem;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link href={`/workout/${plan.id}`}>
      <Card className="cursor-pointer transition-colors hover:bg-accent">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{plan.name}</p>
              {plan.isActive && (
                <Badge className="shrink-0 bg-green-500 text-white hover:bg-green-600">
                  Active
                </Badge>
              )}
              {plan.isAiGenerated && (
                <Badge variant="outline" className="shrink-0 border-primary/40 text-primary gap-1">
                  <Sparkles className="h-3 w-3" />
                  IA
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{plan.daysCount} {plan.daysCount === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}
