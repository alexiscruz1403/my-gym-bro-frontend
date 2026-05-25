'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AiWizardStepper } from './AiWizardStepper';
import { AiStep1Profile } from './AiStep1Profile';
import { AiStep2Goal } from './AiStep2Goal';
import { AiStep3Schedule } from './AiStep3Schedule';
import { AiStep4Equipment } from './AiStep4Equipment';
import { AiStep5Limitations } from './AiStep5Limitations';
import { AiStep6Exercises } from './AiStep6Exercises';
import { AiStep6Generating } from './AiStep6Generating';
import { useGeneratePlan } from '@/hooks/useGeneratePlan';
import useAuthStore from '@/store/auth.store';
import type {
  Step1ProfileValues,
  Step2GoalValues,
  Step3ScheduleValues,
  Step4EquipmentValues,
  Step5LimitationsValues,
  Step6ExercisesValues,
} from '@/lib/validations/ai.schemas';
import type { GeneratePlanRequest, GeneratePlanResponse, PhysicalData } from '@/types/domain.types';

function buildStep1Defaults(pd: PhysicalData | null | undefined): Partial<Step1ProfileValues> {
  if (!pd) return {};
  const defaults: Partial<Step1ProfileValues> = {};

  if (pd.gender === 'male' || pd.gender === 'female') {
    defaults.sex = pd.gender;
  }

  if (pd.heightValue != null) {
    let cm: number;
    if (pd.heightUnit === 'ft') {
      const feet = Math.floor(pd.heightValue);
      const inches = Math.round((pd.heightValue - feet) * 10);
      cm = Math.round(feet * 30.48 + inches * 2.54);
    } else {
      cm = Math.round(pd.heightValue);
    }
    if (cm >= 140 && cm <= 220) defaults.heightCm = cm;
  }

  if (pd.weightValue != null) {
    const kg = pd.weightUnit === 'lbs'
      ? Math.round((pd.weightValue / 2.20462) * 10) / 10
      : pd.weightValue;
    if (kg >= 30 && kg <= 300) defaults.currentWeightKg = kg;
  }

  if (pd.bodyFatPercent != null && pd.bodyFatPercent >= 3 && pd.bodyFatPercent <= 50) {
    defaults.estimatedBodyFatPercent = pd.bodyFatPercent;
  }

  return defaults;
}

type WizardData = Partial<
  Step1ProfileValues &
    Step2GoalValues &
    Step3ScheduleValues &
    Step4EquipmentValues &
    Step5LimitationsValues &
    Step6ExercisesValues
>;

export function AiPlanWizard() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>(() => buildStep1Defaults(user?.physicalData));
  const [result, setResult] = useState<GeneratePlanResponse | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const { mutate, isPending } = useGeneratePlan((res) => {
    setResult(res);
    toast.success('Plan generado con éxito');
  });

  const handleStep1 = (values: Step1ProfileValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(2);
  };

  const handleStep2 = (values: Step2GoalValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(3);
  };

  const handleStep3 = (values: Step3ScheduleValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(4);
  };

  const handleStep4 = (values: Step4EquipmentValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(5);
  };

  const handleStep5 = (values: Step5LimitationsValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(6);
  };

  const handleStep6 = (values: Step6ExercisesValues) => {
    const merged = { ...formData, ...values };
    setFormData(merged);
    setStep(7);
    setGenError(null);
    setResult(null);

    const dto: GeneratePlanRequest = {
      physicalProfile: {
        age: merged.age!,
        sex: merged.sex!,
        heightCm: merged.heightCm!,
        currentWeightKg: merged.currentWeightKg!,
        targetWeightKg: merged.targetWeightKg,
        estimatedBodyFatPercent: merged.estimatedBodyFatPercent,
      },
      goal: merged.goal!,
      experience: merged.experience!,
      daysPerWeek: merged.daysPerWeek!,
      minutesPerSession: merged.minutesPerSession!,
      equipment: merged.equipment!,
      physicalLimitations: merged.physicalLimitations,
      preferences: merged.preferences,
      excludedExerciseIds: merged.excludedExerciseIds,
      includedExerciseIds: merged.includedExerciseIds,
    };

    mutate(dto, {
      onError: (err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 422) {
          setGenError('Ya tienes 3 planes generados por IA. Elimina uno para continuar.');
        } else if (status === 503) {
          setGenError('El servicio de IA no está disponible en este momento. Intenta más tarde.');
        } else {
          setGenError('No se pudo generar el plan. Por favor, intenta de nuevo.');
        }
      },
    });
  };

  const handleRetry = () => {
    setStep(6);
    setGenError(null);
  };

  return (
    <div className="mx-auto max-w-lg space-y-8 px-1">
      <AiWizardStepper currentStep={step} />

      {step === 1 && (
        <AiStep1Profile
          defaultValues={formData}
          onNext={handleStep1}
        />
      )}
      {step === 2 && (
        <AiStep2Goal
          defaultValues={formData}
          onNext={handleStep2}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <AiStep3Schedule
          defaultValues={formData}
          onNext={handleStep3}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <AiStep4Equipment
          defaultValues={formData}
          onNext={handleStep4}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <AiStep5Limitations
          defaultValues={formData}
          onNext={handleStep5}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <AiStep6Exercises
          defaultValues={formData}
          onNext={handleStep6}
          onBack={() => setStep(5)}
        />
      )}
      {step === 7 && (
        <AiStep6Generating
          isLoading={isPending}
          result={result}
          error={genError}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
