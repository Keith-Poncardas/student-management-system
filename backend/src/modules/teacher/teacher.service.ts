import prisma from '../../lib/prisma';
import { throwBadInput, throwNotFound } from '../../utils/errors';
import { getPaginationParams, buildPaginatedResponse } from '../../utils/pagination';
import { PaginationInput } from '../../types';
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  createTeacherSchema,
  updateTeacherSchema,
} from './teacher.validation';

export class TeacherService {
  async findAll(search?: string, pagination?: PaginationInput) {
    const { page, limit, skip } = getPaginationParams(pagination);

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { employeeNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { courses: true },
      }),
      prisma.teacher.count({ where }),
    ]);

    return buildPaginatedResponse(teachers, total, page, limit);
  }

  async findById(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            enrollments: { include: { student: true } },
          },
        },
      },
    });

    if (!teacher) {
      throwNotFound('Teacher');
    }

    return teacher;
  }

  async create(input: CreateTeacherInput) {
    const validated = createTeacherSchema.parse(input);

    const existingEmail = await prisma.teacher.findUnique({
      where: { email: validated.email },
    });
    if (existingEmail) {
      throwBadInput('Email already in use');
    }

    const existingNumber = await prisma.teacher.findUnique({
      where: { employeeNumber: validated.employeeNumber },
    });
    if (existingNumber) {
      throwBadInput('Employee number already in use');
    }

    return prisma.teacher.create({
      data: validated,
      include: { courses: true },
    });
  }

  async update(id: string, input: UpdateTeacherInput) {
    const validated = updateTeacherSchema.parse(input);

    await this.findById(id);

    if (validated.email) {
      const existingEmail = await prisma.teacher.findFirst({
        where: { email: validated.email, NOT: { id } },
      });
      if (existingEmail) {
        throwBadInput('Email already in use');
      }
    }

    if (validated.employeeNumber) {
      const existingNumber = await prisma.teacher.findFirst({
        where: { employeeNumber: validated.employeeNumber, NOT: { id } },
      });
      if (existingNumber) {
        throwBadInput('Employee number already in use');
      }
    }

    return prisma.teacher.update({
      where: { id },
      data: validated,
      include: { courses: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.teacher.delete({ where: { id } });
  }
}

export const teacherService = new TeacherService();
