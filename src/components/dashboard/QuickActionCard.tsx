import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function QuickActionCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <Plus className="text-muted-foreground h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">No active plan</p>
          <p className="text-muted-foreground text-sm">
            Create a workout plan to get started.
          </p>
        </div>
        <Button size="sm" render={<Link href="/workout/new" />}>
          Create your first plan
        </Button>
      </CardContent>
    </Card>
  );
}
