import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GuideTab } from '@/components/exercises/tabs/GuideTab';
import { HistoryTab } from '@/components/exercises/tabs/HistoryTab';
import { StatsTab } from '@/components/exercises/tabs/StatsTab';
import { RankTab } from '@/components/exercises/tabs/RankTab';
import type { Exercise } from '@/types/domain.types';

interface ExerciseDetailProps {
  exercise: Exercise;
}

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  return (
    <Tabs defaultValue="guide">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="guide">Guía</TabsTrigger>
        <TabsTrigger value="history">Historial</TabsTrigger>
        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        <TabsTrigger value="rank">Rango</TabsTrigger>
      </TabsList>

      <TabsContent value="guide">
        <GuideTab exercise={exercise} />
      </TabsContent>

      <TabsContent value="history">
        <HistoryTab exerciseId={exercise.id} />
      </TabsContent>

      <TabsContent value="stats">
        <StatsTab exerciseId={exercise.id} />
      </TabsContent>

      <TabsContent value="rank">
        <RankTab exerciseId={exercise.id} />
      </TabsContent>
    </Tabs>
  );
}
