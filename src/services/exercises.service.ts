import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import type { ExerciseListParams, ExerciseListResponse } from '@/types/api.types';
import type { Exercise } from '@/types/domain.types';

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

export async function getExercises(
  params: ExerciseListParams = {},
): Promise<ExerciseListResponse> {
  try {
    const { data } = await apiClient.get<ExerciseListResponse>(API_ROUTES.exercises.list, {
      params,
    });
    await db.exercises.bulkPut(data.data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.exercises.toArray();
      return { data: cached, total: cached.length, page: 1, limit: cached.length };
    }
    throw error;
  }
}

export async function getExercise(id: string, language?: string): Promise<Exercise> {
  try {
    const { data } = await apiClient.get<Exercise>(API_ROUTES.exercises.detail(id), {
      params: language ? { language } : undefined,
    });
    await db.exercises.put(data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.exercises.get(id);
      if (cached) return cached;
    }
    throw error;
  }
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
