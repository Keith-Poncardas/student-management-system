import prisma from "../../lib/prisma";
import { throwBadInput, throwNotFound } from "../../utils/errors";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../utils/pagination";
import { PaginationInput } from "../../types";
import {
  CreateStudentInput,
  UpdateStudentInput,
  createStudentSchema,
  updateStudentSchema,
} from "./student.validation";

export class StudentService {
  async findAll(search?: string, pagination?: PaginationInput) {
    const { page, limit, skip } = getPaginationParams(pagination);

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            {
              studentNumber: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {};

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { enrollments: { include: { course: true } } },
      }),
      prisma.student.count({ where }),
    ]);

    return buildPaginatedResponse(students, total, page, limit);
  }

  async findById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: { include: { teacher: true } },
            grade: true,
          },
        },
      },
    });

    if (!student) {
      throwNotFound("Student");
    }

    return student;
  }

  async create(input: CreateStudentInput) {
    const validated = createStudentSchema.parse(input);

    const existingEmail = await prisma.student.findUnique({
      where: { email: validated.email },
    });
    if (existingEmail) {
      throwBadInput("Email already in use");
    }

    const existingNumber = await prisma.student.findUnique({
      where: { studentNumber: validated.studentNumber },
    });
    if (existingNumber) {
      throwBadInput("Student number already in use");
    }

    return prisma.student.create({
      data: validated,
      include: { enrollments: true },
    });
  }

  async update(id: string, input: UpdateStudentInput) {
    const validated = updateStudentSchema.parse(input);

    await this.findById(id);

    if (validated.email) {
      const existingEmail = await prisma.student.findFirst({
        where: { email: validated.email, NOT: { id } },
      });
      if (existingEmail) {
        throwBadInput("Email already in use");
      }
    }

    if (validated.studentNumber) {
      const existingNumber = await prisma.student.findFirst({
        where: { studentNumber: validated.studentNumber, NOT: { id } },
      });
      if (existingNumber) {
        throwBadInput("Student number already in use");
      }
    }

    return prisma.student.update({
      where: { id },
      data: validated,
      include: { enrollments: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.student.delete({ where: { id } });
  }
}

export const studentService = new StudentService();
