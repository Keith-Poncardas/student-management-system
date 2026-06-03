import { z } from 'zod';

export const createGradeSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
  grade: z.number().min(0, 'Grade must be at least 0').max(100, 'Grade must be at most 100'),
  remarks: z.string().optional(),
});

export const updateGradeSchema = z.object({
  grade: z.number().min(0).max(100).optional(),
  remarks: z.string().optional().nullable(),
});

export type CreateGradeInput = z.infer<typeof createGradeSchema>;
export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;
