import { z } from 'zod';

export const planNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Plan name is required')
    .max(100, 'Plan name cannot exceed 100 characters')
    .trim(),
});

export const exerciseConfigSchema = z
  .object({
    sets: z.coerce
      .number()
      .min(1, 'At least 1 set is required'),
    reps: z.coerce
      .number()
      .min(1, 'Reps must be at least 1')
      .optional(),
    duration: z.coerce
      .number()
      .min(1, 'Duration must be at least 1 second')
      .optional(),
    weight: z.coerce
      .number()
      .min(0, 'Weight cannot be negative')
      .optional(),
    rest: z.coerce
      .number()
      .min(0, 'Rest cannot be negative'),
    notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
  })
  .refine((data) => data.reps !== undefined || data.duration !== undefined, {
    message: 'Either reps or duration must be specified',
    path: ['reps'],
  })
  .refine(
    (data) => !(data.reps !== undefined && data.duration !== undefined),
    {
      message: 'Specify either reps or duration, not both',
      path: ['reps'],
    },
  );

export type PlanNameFormValues = z.infer<typeof planNameSchema>;
export type ExerciseConfigFormValues = z.infer<typeof exerciseConfigSchema>;
