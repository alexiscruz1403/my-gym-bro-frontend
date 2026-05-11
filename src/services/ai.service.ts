import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  AiPlanProfile,
  ConfirmProgressionRequest,
  GeneratePlanRequest,
  GeneratePlanResponse,
  ProgressionAnalysisResponse,
  WorkoutPlan,
} from '@/types/domain.types';

export async function generatePlan(dto: GeneratePlanRequest): Promise<GeneratePlanResponse> {
  const { data } = await apiClient.post<GeneratePlanResponse>(
    API_ROUTES.ai.generatePlan,
    dto,
    { timeout: 40_000 },
  );
  return data;
}

export async function getAiProfiles(): Promise<AiPlanProfile[]> {
  const { data } = await apiClient.get<AiPlanProfile[]>(API_ROUTES.ai.profiles);
  return data;
}

export async function analyzeProgression(): Promise<ProgressionAnalysisResponse> {
  const { data } = await apiClient.post<ProgressionAnalysisResponse>(
    API_ROUTES.ai.analyzeProgression,
  );
  return data;
}

export async function getCurrentWeekProgression(): Promise<ProgressionAnalysisResponse | null> {
  const { data } = await apiClient.get<ProgressionAnalysisResponse | null>(
    API_ROUTES.ai.currentWeekProgression,
  );
  return data;
}

export async function confirmProgression(
  dto: ConfirmProgressionRequest,
): Promise<ProgressionAnalysisResponse> {
  const { data } = await apiClient.post<ProgressionAnalysisResponse>(
    API_ROUTES.ai.confirmProgression,
    dto,
  );
  return data;
}

export async function copyAiPlan(planId: string): Promise<WorkoutPlan> {
  const { data } = await apiClient.post<WorkoutPlan>(API_ROUTES.ai.copyAsPlan(planId));
  return data;
}
