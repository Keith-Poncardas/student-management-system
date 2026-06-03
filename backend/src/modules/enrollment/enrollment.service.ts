import prisma from '../../lib/prisma';
import { throwBadInput, throwNotFound } from '../../utils/errors';
import { getPaginationParams, buildPaginatedResponse } from '../../utils/pagination';
import { PaginationInput } from '../../types';
import { CreateEnrollmentInput, createEnrollmentSchema } from './enrollment.validation';

export class EnrollmentService {
  async findAll(search?: string, pagination?: PaginationInput) {
    const { page, limit, skip } = getPaginationParams(pagination);

    const where = search
      ? {
          OR: [
            { student: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { student: { lastName: { contains: search, mode: 'insensitive' as const } } },
            { course: { title: { contains: search, mode: 'insensitive' as const } } },
            { course: { code: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrolledAt: 'desc' },
        include: {
          student: true,
          course: { include: { teacher: true } },
          grade: true,
        },
      }),
      prisma.enrollment.count({ where }),
    ]);

    return buildPaginatedResponse(enrollments, total, page, limit);
  }

  async findById(id: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: { include: { teacher: true } },
        grade: true,
      },
    });

    if (!enrollment) {
      throwNotFound('Enrollment');
    }

    return enrollment;
  }

  async create(input: CreateEnrollmentInput) {
    const validated = createEnrollmentSchema.parse(input);

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: validated.studentId },
    });
    if (!student) {
      throwNotFound('Student');
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
    });
    if (!course) {
      throwNotFound('Course');
    }

    // Check for duplicate enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: validated.studentId,
          courseId: validated.courseId,
        },
      },
    });
    if (existingEnrollment) {
      throwBadInput('Student is already enrolled in this course');
    }

    return prisma.enrollment.create({
      data: validated,
      include: {
        student: true,
        course: { include: { teacher: true } },
        grade: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.enrollment.delete({ where: { id } });
  }
}

export const enrollmentService = new EnrollmentService();
