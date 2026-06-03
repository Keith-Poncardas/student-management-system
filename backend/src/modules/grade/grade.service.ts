import prisma from '../../lib/prisma';
import { throwBadInput, throwNotFound } from '../../utils/errors';
import { getPaginationParams, buildPaginatedResponse } from '../../utils/pagination';
import { PaginationInput } from '../../types';
import {
  CreateGradeInput,
  UpdateGradeInput,
  createGradeSchema,
  updateGradeSchema,
} from './grade.validation';

export class GradeService {
  async findAll(search?: string, courseId?: string, studentId?: string, pagination?: PaginationInput) {
    const { page, limit, skip } = getPaginationParams(pagination);

    const where: any = {};

    if (search) {
      where.OR = [
        { enrollment: { student: { firstName: { contains: search, mode: 'insensitive' } } } },
        { enrollment: { student: { lastName: { contains: search, mode: 'insensitive' } } } },
        { enrollment: { course: { title: { contains: search, mode: 'insensitive' } } } },
        { enrollment: { course: { code: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (courseId) {
      where.enrollment = { ...where.enrollment, courseId };
    }

    if (studentId) {
      where.enrollment = { ...where.enrollment, studentId };
    }

    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollment: {
            include: {
              student: true,
              course: true,
            },
          },
        },
      }),
      prisma.grade.count({ where }),
    ]);

    return buildPaginatedResponse(grades, total, page, limit);
  }

  async findById(id: string) {
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        enrollment: {
          include: {
            student: true,
            course: { include: { teacher: true } },
          },
        },
      },
    });

    if (!grade) {
      throwNotFound('Grade');
    }

    return grade;
  }

  async create(input: CreateGradeInput) {
    const validated = createGradeSchema.parse(input);

    // Verify enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: validated.enrollmentId },
      include: { grade: true },
    });

    if (!enrollment) {
      throwNotFound('Enrollment');
    }

    // Check if grade already exists for this enrollment
    if (enrollment.grade) {
      throwBadInput('Grade already exists for this enrollment');
    }

    return prisma.grade.create({
      data: validated,
      include: {
        enrollment: {
          include: {
            student: true,
            course: true,
          },
        },
      },
    });
  }

  async update(id: string, input: UpdateGradeInput) {
    const validated = updateGradeSchema.parse(input);

    await this.findById(id);

    return prisma.grade.update({
      where: { id },
      data: validated,
      include: {
        enrollment: {
          include: {
            student: true,
            course: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.grade.delete({ where: { id } });
  }
}

export const gradeService = new GradeService();
