import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { WorkoutSession } from '@/types/domain.types';
import type {
  StartSessionRequest,
  LogSetRequest,
  LogSetResponse,
  ModifyExerciseRequest,
  ReplaceExerciseRequest,
  FinishSessionRequest,
} from '@/types/api.types';

export async function startSession(dto: StartSessionRequest): Promise<WorkoutSession> {
  const { data } = await apiClient.post<WorkoutSession>(API_ROUTES.sessions.start, dto);
  return data;
}

export async function getActiveSession(): Promise<WorkoutSession | null> {
  try {
    const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.active);
    return data;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as { response: { status: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function logSet(sessionId: string, dto: LogSetRequest): Promise<LogSetResponse> {
  const { data } = await apiClient.post<LogSetResponse>(
    API_ROUTES.sessions.logSet(sessionId),
    dto,
  );
  return data;
}

export async function modifyExercise(
  sessionId: string,
  exerciseId: string,
  dto: ModifyExerciseRequest,
): Promise<void> {
  await apiClient.patch(API_ROUTES.sessions.modifyExercise(sessionId, exerciseId), dto);
}

export async function replaceExercise(
  sessionId: string,
  exerciseId: string,
  dto: ReplaceExerciseRequest,
): Promise<WorkoutSession> {
  await apiClient.patch(API_ROUTES.sessions.replaceExercise(sessionId, exerciseId), dto);
  // Re-fetch to get lastPerformance resolved for the new exercise
  const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.active);
  return data;
}

export async function cancelSession(): Promise<void> {
  await apiClient.delete(API_ROUTES.sessions.cancel);
}

export async function finishSession(
  sessionId: string,
  dto: FinishSessionRequest,
): Promise<WorkoutSession> {
  const { data } = await apiClient.patch<WorkoutSession>(
    API_ROUTES.sessions.finish(sessionId),
    dto,
  );
  return data;
}
