import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import { enqueue } from '@/lib/offline-queue';
import { isTempId, TEMP_ID_PREFIX } from '@/lib/id-reconciler';
import type { CreatePlanRequest, UpdatePlanRequest } from '@/types/api.types';
import type { AiFitnessGoal, MuscleGroup, PlanListItem, WorkoutPlan } from '@/types/domain.types';

export interface UpdatePlanGoalsRequest {
  mainGoal?: AiFitnessGoal | null;
  focusMuscles?: MuscleGroup[];
}

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

export async function getPlans(): Promise<PlanListItem[]> {
  try {
    const { data } = await apiClient.get<PlanListItem[]>(API_ROUTES.workoutPlans.list);
    const asList: PlanListItem[] = data;

    // Remove from IndexedDB any plans that no longer exist on the server.
    // Preserve offline-pending plans — they were created locally and haven't synced yet.
    const serverIds = new Set(asList.map((p) => p.id));
    const dbPlans = await db.plans.toArray();
    const toDelete = dbPlans
      .filter(
        (p) =>
          !(p as WorkoutPlan & { _isOfflinePending?: boolean })._isOfflinePending &&
          !serverIds.has(p.id),
      )
      .map((p) => p.id);
    if (toDelete.length > 0) {
      await db.plans.bulkDelete(toDelete);
    }

    return asList;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.plans.toArray();
      return cached.map((p) => ({
        id: p.id,
        name: p.name,
        isActive: p.isActive,
        isAiGenerated: p.isAiGenerated,
        daysCount: p.days?.length ?? 0,
        configuredDays: p.days?.map((d) => d.dayOfWeek) ?? [],
        totalExercises: p.days?.reduce((sum, d) => sum + d.exercises.length, 0) ?? 0,
        _isOfflinePending: (p as WorkoutPlan & { _isOfflinePending?: boolean })._isOfflinePending,
      })) as PlanListItem[];
    }
    throw error;
  }
}

export async function getActivePlan(): Promise<WorkoutPlan | null> {
  try {
    const { data } = await apiClient.get<WorkoutPlan>(API_ROUTES.workoutPlans.active);
    await db.plans.put(data);
    return data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    if (isNetworkError(err)) {
      const cached = await db.plans.where('isActive').equals(1).first();
      return cached ?? null;
    }
    throw err;
  }
}

export async function getPlan(id: string): Promise<WorkoutPlan> {
  try {
    const { data } = await apiClient.get<WorkoutPlan>(API_ROUTES.workoutPlans.detail(id));
    await db.plans.put(data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.plans.get(id);
      if (cached) return cached;
    }
    throw error;
  }
}

export async function createPlan(dto: CreatePlanRequest): Promise<WorkoutPlan> {
  if (!navigator.onLine) {
    const tempId = `${TEMP_ID_PREFIX}plan_${uuid()}`;
    const now = new Date().toISOString();
    const plan: WorkoutPlan & { _isOfflinePending?: boolean } = {
      id: tempId,
      name: dto.name,
      isActive: false,
      isAiGenerated: false,
      autoUpdateWeight: false,
      days: dto.days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        dayName: d.dayName ?? null,
        exercises: d.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          exerciseName: '',
          sets: e.sets,
          minReps: e.minReps,
          maxReps: e.maxReps,
          duration: e.duration,
          weight: e.weight,
          weightUnit: e.weightUnit,
          rest: e.rest,
          notes: e.notes,
          supersetGroupId: e.supersetGroupId,
          bilateral: false,
          left: e.left ?? null,
          right: e.right ?? null,
        })),
      })),
      goals: null,
      createdAt: now,
      updatedAt: now,
      _isOfflinePending: true,
    };
    await db.plans.add(plan);
    await enqueue({
      type: 'CREATE_PLAN',
      method: 'POST',
      url: API_ROUTES.workoutPlans.list,
      payload: dto,
      tempId,
    });
    return plan;
  }
  const { data } = await apiClient.post<WorkoutPlan>(API_ROUTES.workoutPlans.list, dto);
  await db.plans.put(data);
  return data;
}

export async function updatePlan(id: string, dto: UpdatePlanRequest): Promise<WorkoutPlan> {
  if (!navigator.onLine) {
    const existing = await db.plans.get(id);
    if (!existing) throw new Error('Plan not found in offline cache');
    const now = new Date().toISOString();
    const updated: WorkoutPlan & { _isOfflinePending?: boolean } = {
      ...existing,
      name: dto.name,
      days: dto.days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        dayName: d.dayName ?? null,
        exercises: d.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          exerciseName: existing.days
            .flatMap((day) => day.exercises)
            .find((ex) => ex.exerciseId === e.exerciseId)?.exerciseName ?? '',
          sets: e.sets,
          minReps: e.minReps,
          maxReps: e.maxReps,
          duration: e.duration,
          weight: e.weight,
          weightUnit: e.weightUnit,
          rest: e.rest,
          notes: e.notes,
          supersetGroupId: e.supersetGroupId,
          bilateral: false,
          left: e.left ?? null,
          right: e.right ?? null,
        })),
      })),
      updatedAt: now,
      _isOfflinePending: true,
    };
    await db.plans.put(updated);
    await enqueue({
      type: 'UPDATE_PLAN',
      method: 'PATCH',
      url: API_ROUTES.workoutPlans.detail(id),
      payload: dto,
      // Only set tempId if id is itself a temp (we need to remap URL, not create a new resource)
    });
    return updated;
  }
  const { data } = await apiClient.patch<WorkoutPlan>(API_ROUTES.workoutPlans.detail(id), dto);
  await db.plans.put(data);
  return data;
}

export async function deletePlan(id: string): Promise<void> {
  if (!navigator.onLine) {
    await db.plans.delete(id);
    // If it was created offline (temp ID), no need to sync the delete
    if (!isTempId(id)) {
      await enqueue({
        type: 'DELETE_PLAN',
        method: 'DELETE',
        url: API_ROUTES.workoutPlans.detail(id),
      });
    }
    return;
  }
  await apiClient.delete(API_ROUTES.workoutPlans.detail(id));
  await db.plans.delete(id);
}

export async function activatePlan(id: string): Promise<WorkoutPlan> {
  if (!navigator.onLine) {
    // Deactivate all, activate the selected one
    await db.plans.toCollection().modify({ isActive: false });
    await db.plans.update(id, { isActive: true });
    const plan = await db.plans.get(id);
    if (!plan) throw new Error('Plan not found in offline cache');
    await enqueue({
      type: 'ACTIVATE_PLAN',
      method: 'PATCH',
      url: API_ROUTES.workoutPlans.activate(id),
    });
    return plan;
  }
  const { data } = await apiClient.patch<WorkoutPlan>(API_ROUTES.workoutPlans.activate(id));
  try {
    await db.plans.toCollection().modify({ isActive: false });
    await db.plans.update(id, { isActive: true });
  } catch {
    // IndexedDB update failed — React Query refetch will reconcile state
  }
  return data;
}

export async function updatePlanAutoUpdate(
  id: string,
  autoUpdateWeight: boolean,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.patch<WorkoutPlan>(
    API_ROUTES.workoutPlans.autoUpdate(id),
    { autoUpdateWeight },
  );
  await db.plans.put(data);
  return data;
}

export async function updatePlanGoals(
  id: string,
  dto: UpdatePlanGoalsRequest,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.patch<WorkoutPlan>(API_ROUTES.workoutPlans.goals(id), dto);
  await db.plans.put(data);
  return data;
}

export async function duplicatePlan(id: string): Promise<WorkoutPlan> {
  const { data } = await apiClient.post<WorkoutPlan>(API_ROUTES.workoutPlans.duplicate(id));
  return data;
}

export interface CopyPlanDayPayload {
  targetPlanId?: string;
  newPlanName?: string;
}

export async function copyPlanDay(
  id: string,
  dayOfWeek: string,
  payload: CopyPlanDayPayload,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.post<WorkoutPlan>(
    API_ROUTES.workoutPlans.copyDay(id, dayOfWeek),
    payload,
  );
  return data;
}
