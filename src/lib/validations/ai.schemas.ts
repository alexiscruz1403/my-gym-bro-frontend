import { z } from 'zod';

export const step1ProfileSchema = z.object({
  age: z.number({ message: 'Age is required' }).int().min(14).max(100),
  sex: z.enum(['male', 'female'] as const, { message: 'Sex is required' }),
  heightCm: z
    .number({ message: 'Height is required' })
    .min(100, 'Min 100 cm')
    .max(250, 'Max 250 cm'),
  currentWeightKg: z
    .number({ message: 'Weight is required' })
    .min(30, 'Min 30 kg')
    .max(300, 'Max 300 kg'),
  targetWeightKg: z.number().min(30).max(300).optional(),
  estimatedBodyFatPercent: z.number().min(3).max(60).optional(),
});

export const step2GoalSchema = z.object({
  goal: z.enum(
    [
      'muscle_gain',
      'fat_loss',
      'body_recomposition',
      'strength',
      'endurance',
      'general_health',
      'mobility',
    ] as const,
    { message: 'Select a goal' },
  ),
  experience: z.enum(['beginner', 'intermediate', 'advanced'] as const, {
    message: 'Select your experience level',
  }),
});

export const step3ScheduleSchema = z.object({
  daysPerWeek: z
    .number({ message: 'Select days per week' })
    .int()
    .min(1)
    .max(6),
  minutesPerSession: z
    .number({ message: 'Select session duration' })
    .int()
    .min(20)
    .max(180),
});

export const step4EquipmentSchema = z.object({
  equipment: z
    .array(
      z.enum([
        'no_equipment',
        'dumbbells',
        'bands',
        'barbell_plates',
        'full_gym',
      ] as const),
    )
    .min(1, 'Select at least one equipment option'),
});

export const step5LimitationsSchema = z.object({
  physicalLimitations: z
    .array(
      z.enum([
        'knee_injury',
        'lower_back_pain',
        'shoulder_sensitivity',
        'previous_surgery',
      ] as const),
    )
    .optional(),
  preferences: z
    .array(
      z.enum([
        'heavy_lifting',
        'prefers_machines',
        'prefers_free_weights',
        'hates_cardio',
      ] as const),
    )
    .optional(),
});

export const step6ExercisesSchema = z.object({
  excludedExerciseIds: z.array(z.string()).max(3).optional(),
  includedExerciseIds: z.array(z.string()).max(3).optional(),
});

export const generatePlanSchema = step1ProfileSchema
  .and(step2GoalSchema)
  .and(step3ScheduleSchema)
  .and(step4EquipmentSchema)
  .and(step5LimitationsSchema)
  .and(step6ExercisesSchema);

export type Step1ProfileValues = z.infer<typeof step1ProfileSchema>;
export type Step2GoalValues = z.infer<typeof step2GoalSchema>;
export type Step3ScheduleValues = z.infer<typeof step3ScheduleSchema>;
export type Step4EquipmentValues = z.infer<typeof step4EquipmentSchema>;
export type Step5LimitationsValues = z.infer<typeof step5LimitationsSchema>;
export type Step6ExercisesValues = z.infer<typeof step6ExercisesSchema>;
export type GeneratePlanFormValues = z.infer<typeof generatePlanSchema>;

export const suggestChangeSchema = z.object({
  newSets: z.number().int().min(1).max(20).optional(),
  newReps: z.number().int().min(1).max(100).optional(),
  newWeight: z.number().min(0).max(1000).optional(),
  userReasoning: z.string().max(500).optional(),
});

export type SuggestChangeFormValues = z.infer<typeof suggestChangeSchema>;
