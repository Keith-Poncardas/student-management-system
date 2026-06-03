import { z } from 'zod';

export const createCourseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  teacherId: z.string().uuid('Invalid teacher ID'),
});

export const updateCourseSchema = z.object({
  code: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  teacherId: z.string().uuid().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
