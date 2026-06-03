import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  courseId: z.string().uuid('Invalid course ID'),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
