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

export async function getExercise(id: string, language?: string): Promise<Exercise> {
  const { data } = await apiClient.get<Exercise>(
    API_ROUTES.exercises.detail(id),
    { params: language ? { language } : undefined },
  );
  return data;
}

export async function createExercise(formData: FormData): Promise<Exercise> {
  const { data } = await apiClient.post<Exercise>(API_ROUTES.exercises.list, formData);
  return data;
}

export async function updateExercise(id: string, formData: FormData): Promise<Exercise> {
  const { data } = await apiClient.patch<Exercise>(API_ROUTES.exercises.detail(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteExercise(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.exercises.detail(id));
}
