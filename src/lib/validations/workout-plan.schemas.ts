import { z } from 'zod';

export const planNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Plan name is required')
    .max(100, 'Plan name cannot exceed 100 characters')
    .trim(),
});

export const exerciseSideSchema = z
  .object({
    minReps: z.number().int().min(1, 'Reps must be at least 1').optional(),
    maxReps: z.number().int().min(1, 'Reps must be at least 1').optional(),
    duration: z.number().int().min(1, 'Duration must be at least 1 second').optional(),
    weight: z.number().min(0, 'Weight cannot be negative').optional(),
  })
  .refine(
    (d) => !(d.minReps !== undefined && d.maxReps === undefined),
    { message: 'Max reps is required', path: ['maxReps'] },
  )
  .refine(
    (d) => !(d.minReps !== undefined && d.maxReps !== undefined && d.maxReps < d.minReps),
    { message: 'Max reps must be ≥ min reps', path: ['maxReps'] },
  );

export const exerciseConfigSchema = z
  .object({
    sets: z.number({ message: 'Sets is required' }).min(1, 'At least 1 set is required'),
    minReps: z.number().min(1, 'Reps must be at least 1').optional(),
    maxReps: z.number().min(1, 'Reps must be at least 1').optional(),
    duration: z.number().min(1, 'Duration must be at least 1 second').optional(),
    weight: z.number().min(0, 'Weight cannot be negative').optional(),
    rest: z.number({ message: 'Rest is required' }).min(0, 'Rest cannot be negative'),
    notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
    left: exerciseSideSchema.optional(),
    right: exerciseSideSchema.optional(),
  })
  .refine(
    (data) =>
      data.minReps !== undefined ||
      data.duration !== undefined ||
      data.left !== undefined ||
      data.right !== undefined,
    {
      message: 'Either reps or duration must be specified',
      path: ['minReps'],
    },
  )
  .refine(
    (data) => !(data.minReps !== undefined && data.duration !== undefined),
    {
      message: 'Specify either reps or duration, not both',
      path: ['minReps'],
    },
  )
  .refine(
    (data) => !(data.minReps !== undefined && data.maxReps === undefined),
    { message: 'Max reps is required', path: ['maxReps'] },
  )
  .refine(
    (data) => !(data.minReps !== undefined && data.maxReps !== undefined && data.maxReps < data.minReps),
    { message: 'Max reps must be ≥ min reps', path: ['maxReps'] },
  );

export type PlanNameFormValues = z.infer<typeof planNameSchema>;
export type ExerciseConfigFormValues = z.infer<typeof exerciseConfigSchema>;
export type ExerciseSideFormValues = z.infer<typeof exerciseSideSchema>;
