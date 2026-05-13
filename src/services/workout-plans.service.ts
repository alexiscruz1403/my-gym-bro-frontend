import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { CreatePlanRequest, UpdatePlanRequest } from '@/types/api.types';
import type { AiFitnessGoal, MuscleGroup, PlanListItem, WorkoutPlan } from '@/types/domain.types';

export interface UpdatePlanGoalsRequest {
  mainGoal?: AiFitnessGoal | null;
  focusMuscles?: MuscleGroup[];
}

export async function getPlans(): Promise<PlanListItem[]> {
  const { data } = await apiClient.get<PlanListItem[]>(
    API_ROUTES.workoutPlans.list,
  );
  return data;
}

export async function getActivePlan(): Promise<WorkoutPlan | null> {
  try {
    const { data } = await apiClient.get<WorkoutPlan>(
      API_ROUTES.workoutPlans.active,
    );
    return data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}

export async function getPlan(id: string): Promise<WorkoutPlan> {
  const { data } = await apiClient.get<WorkoutPlan>(
    API_ROUTES.workoutPlans.detail(id),
  );
  return data;
}

export async function createPlan(dto: CreatePlanRequest): Promise<WorkoutPlan> {
  const { data } = await apiClient.post<WorkoutPlan>(
    API_ROUTES.workoutPlans.list,
    dto,
  );
  return data;
}

export async function updatePlan(
  id: string,
  dto: UpdatePlanRequest,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.patch<WorkoutPlan>(
    API_ROUTES.workoutPlans.detail(id),
    dto,
  );
  return data;
}

export async function deletePlan(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.workoutPlans.detail(id));
}

export async function activatePlan(id: string): Promise<WorkoutPlan> {
  const { data } = await apiClient.patch<WorkoutPlan>(
    API_ROUTES.workoutPlans.activate(id),
  );
  return data;
}

export async function updatePlanGoals(
  id: string,
  dto: UpdatePlanGoalsRequest,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.patch<WorkoutPlan>(
    API_ROUTES.workoutPlans.goals(id),
    dto,
  );
  return data;
}
