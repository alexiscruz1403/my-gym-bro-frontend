'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { WizardStepper } from './WizardStepper';
import { WizardStep1Name } from './WizardStep1Name';
import { WizardStep2Days } from './WizardStep2Days';
import { WizardStep3Exercises } from './WizardStep3Exercises';
import { WizardStep4Review } from './WizardStep4Review';
import usePlanBuilderStore from '@/store/plan-builder.store';
import { createPlan, updatePlan } from '@/services/workout-plans.service';
import { invalidatePlanCache } from '@/hooks/usePlan';
import { toast } from 'sonner';
import type { CreatePlanRequest } from '@/types/api.types';

export function CreatePlanWizard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    step,
    mode,
    editingPlanId,
    name,
    selectedDays,
    exercisesByDay,
    dayNamesByDay,
    setStep,
    setName,
    toggleDay,
    setDayName,
    addExerciseToDay,
    removeExerciseFromDay,
    updateExerciseConfig,
    reorderExercisesInDay,
    reset,
  } = usePlanBuilderStore();

  const handleStep1Next = (planName: string) => {
    setName(planName);
    setStep(2);
  };

  const handleStep2Next = () => setStep(3);
  const handleStep3Next = () => setStep(4);

  const buildPayload = (): CreatePlanRequest => ({
    name,
    days: selectedDays.map((day) => ({
      dayOfWeek: day,
      dayName: dayNamesByDay[day] || undefined,
      exercises: (exercisesByDay[day] ?? []).map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        weight: ex.weight,
        weightUnit: ex.weightUnit || undefined,
        rest: ex.rest,
        notes: ex.notes,
        supersetGroupId: ex.supersetGroupId,
        left: ex.left,
        right: ex.right,
      })),
    })),
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = buildPayload();
      const saved =
        mode === 'edit' && editingPlanId
          ? await updatePlan(editingPlanId, payload)
          : await createPlan(payload);

      invalidatePlanCache(saved.id);
      router.push(`/workout/${saved.id}`);
      reset();
      toast.success(
        mode === 'edit'
          ? t('plans.updatedToast', { name: saved.name })
          : t('plans.createdToast', { name: saved.name }),
      );
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 422) {
        toast.error(t('plans.error.maxPlans'));
      } else {
        toast.error(t('plans.error.saveFailed'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <WizardStepper currentStep={step} />

      {step === 1 && (
        <WizardStep1Name defaultValue={name} onNext={handleStep1Next} />
      )}
      {step === 2 && (
        <WizardStep2Days
          selected={selectedDays}
          onChange={(days) => {
            days.forEach((d) => {
              if (!selectedDays.includes(d)) toggleDay(d);
            });
            selectedDays.forEach((d) => {
              if (!days.includes(d)) toggleDay(d);
            });
          }}
          onNext={handleStep2Next}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <WizardStep3Exercises
          selectedDays={selectedDays}
          exercisesByDay={exercisesByDay}
          dayNamesByDay={dayNamesByDay}
          onSetDayName={setDayName}
          onAdd={addExerciseToDay}
          onUpdate={updateExerciseConfig}
          onRemove={removeExerciseFromDay}
          onReorder={reorderExercisesInDay}
          onNext={handleStep3Next}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <WizardStep4Review
          name={name}
          selectedDays={selectedDays}
          exercisesByDay={exercisesByDay}
          isSaving={isSaving}
          onSave={handleSave}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
