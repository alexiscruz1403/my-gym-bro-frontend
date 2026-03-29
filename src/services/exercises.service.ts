import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { ExerciseListParams, ExerciseListResponse } from '@/types/api.types';
import type { Exercise } from '@/types/domain.types';

export async function getExercises(
  params: ExerciseListParams = {},
): Promise<ExerciseListResponse> {
  const { data } = await apiClient.get<ExerciseListResponse>(
    API_ROUTES.exercises.list,
    { params },
  );
  return data;
}

export async function getExercise(id: string): Promise<Exercise> {
  const { data } = await apiClient.get<Exercise>(
    API_ROUTES.exercises.detail(id),
  );
  return data;
}
