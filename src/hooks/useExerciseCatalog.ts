import { useQuery } from '@tanstack/react-query';
import { getExercise } from '@/services/exercises.service';

export function useExerciseCatalog(exerciseId: string) {
  return useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => getExercise(exerciseId),
    staleTime: 1000 * 60 * 60, // 1 h — catalog data rarely changes
  });
}
