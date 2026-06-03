import prisma from '../../lib/prisma';

export class DashboardService {
  async getStats() {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalGrades,
      recentStudents,
      recentEnrollments,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.grade.count(),
      prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: 'desc' },
        include: {
          student: true,
          course: true,
        },
      }),
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalGrades,
      recentStudents,
      recentEnrollments,
    };
  }
}

export const dashboardService = new DashboardService();
