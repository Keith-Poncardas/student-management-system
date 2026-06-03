import prisma from '../../lib/prisma';
import { throwBadInput, throwNotFound } from '../../utils/errors';
import { getPaginationParams, buildPaginatedResponse } from '../../utils/pagination';
import { PaginationInput } from '../../types';
import {
  CreateCourseInput,
  UpdateCourseInput,
  createCourseSchema,
  updateCourseSchema,
} from './course.validation';

export class CourseService {
  async findAll(search?: string, pagination?: PaginationInput) {
    const { page, limit, skip } = getPaginationParams(pagination);

    const where = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' as const } },
            { title: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: true,
          enrollments: { include: { student: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return buildPaginatedResponse(courses, total, page, limit);
  }

  async findById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        enrollments: {
          include: {
            student: true,
            grade: true,
          },
        },
      },
    });

    if (!course) {
      throwNotFound('Course');
    }

    return course;
  }

  async create(input: CreateCourseInput) {
    const validated = createCourseSchema.parse(input);

    const existingCode = await prisma.course.findUnique({
      where: { code: validated.code },
    });
    if (existingCode) {
      throwBadInput('Course code already in use');
    }

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: validated.teacherId },
    });
    if (!teacher) {
      throwNotFound('Teacher');
    }

    return prisma.course.create({
      data: validated,
      include: { teacher: true, enrollments: true },
    });
  }

  async update(id: string, input: UpdateCourseInput) {
    const validated = updateCourseSchema.parse(input);

    await this.findById(id);

    if (validated.code) {
      const existingCode = await prisma.course.findFirst({
        where: { code: validated.code, NOT: { id } },
      });
      if (existingCode) {
        throwBadInput('Course code already in use');
      }
    }

    if (validated.teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: validated.teacherId },
      });
      if (!teacher) {
        throwNotFound('Teacher');
      }
    }

    return prisma.course.update({
      where: { id },
      data: validated,
      include: { teacher: true, enrollments: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.course.delete({ where: { id } });
  }
}

export const courseService = new CourseService();
