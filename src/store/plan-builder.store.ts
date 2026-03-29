import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DayOfWeek, WorkoutPlan } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

type WizardStep = 1 | 2 | 3 | 4;
type WizardMode = 'create' | 'edit';

interface PlanBuilderState {
  step: WizardStep;
  mode: WizardMode;
  editingPlanId: string | null;
  name: string;
  selectedDays: DayOfWeek[];
  exercisesByDay: Partial<Record<DayOfWeek, ExerciseConfigDraft[]>>;
  isDirty: boolean;
}

interface PlanBuilderActions {
  setStep: (step: WizardStep) => void;
  setName: (name: string) => void;
  toggleDay: (day: DayOfWeek) => void;
  addExerciseToDay: (day: DayOfWeek, exercise: ExerciseConfigDraft) => void;
  removeExerciseFromDay: (day: DayOfWeek, index: number) => void;
  updateExerciseConfig: (
    day: DayOfWeek,
    index: number,
    config: Partial<ExerciseConfigDraft>,
  ) => void;
  loadPlan: (plan: WorkoutPlan) => void;
  reset: () => void;
}

const initialState: PlanBuilderState = {
  step: 1,
  mode: 'create',
  editingPlanId: null,
  name: '',
  selectedDays: [],
  exercisesByDay: {},
  isDirty: false,
};

const usePlanBuilderStore = create<PlanBuilderState & PlanBuilderActions>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setName: (name) => set({ name, isDirty: true }),

      toggleDay: (day) =>
        set((state) => {
          const isSelected = state.selectedDays.includes(day);
          const selectedDays = isSelected
            ? state.selectedDays.filter((d) => d !== day)
            : [...state.selectedDays, day];

          const exercisesByDay = { ...state.exercisesByDay };
          if (isSelected) {
            delete exercisesByDay[day];
          }

          return { selectedDays, exercisesByDay, isDirty: true };
        }),

      addExerciseToDay: (day, exercise) =>
        set((state) => ({
          exercisesByDay: {
            ...state.exercisesByDay,
            [day]: [...(state.exercisesByDay[day] ?? []), exercise],
          },
          isDirty: true,
        })),

      removeExerciseFromDay: (day, index) =>
        set((state) => {
          const exercises = state.exercisesByDay[day] ?? [];
          return {
            exercisesByDay: {
              ...state.exercisesByDay,
              [day]: exercises.filter((_, i) => i !== index),
            },
            isDirty: true,
          };
        }),

      updateExerciseConfig: (day, index, config) =>
        set((state) => {
          const exercises = [...(state.exercisesByDay[day] ?? [])];
          exercises[index] = { ...exercises[index], ...config };
          return {
            exercisesByDay: { ...state.exercisesByDay, [day]: exercises },
            isDirty: true,
          };
        }),

      loadPlan: (plan) => {
        const selectedDays = plan.days.map((d) => d.dayOfWeek);
        const exercisesByDay: Partial<Record<DayOfWeek, ExerciseConfigDraft[]>> = {};
        for (const day of plan.days) {
          exercisesByDay[day.dayOfWeek] = day.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: ex.sets,
            reps: ex.reps,
            duration: ex.duration,
            weight: ex.weight,
            rest: ex.rest,
            notes: ex.notes,
            supersetGroupId: ex.supersetGroupId,
          }));
        }
        set({
          step: 1,
          mode: 'edit',
          editingPlanId: plan.id,
          name: plan.name,
          selectedDays,
          exercisesByDay,
          isDirty: false,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'gym-planner-plan-builder',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default usePlanBuilderStore;
