import { authResolvers } from '../modules/auth/auth.resolver';
import { studentResolvers } from '../modules/student/student.resolver';
import { teacherResolvers } from '../modules/teacher/teacher.resolver';
import { courseResolvers } from '../modules/course/course.resolver';
import { enrollmentResolvers } from '../modules/enrollment/enrollment.resolver';
import { gradeResolvers } from '../modules/grade/grade.resolver';
import { dashboardResolvers } from '../modules/dashboard/dashboard.resolver';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...studentResolvers.Query,
    ...teacherResolvers.Query,
    ...courseResolvers.Query,
    ...enrollmentResolvers.Query,
    ...gradeResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...studentResolvers.Mutation,
    ...teacherResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...enrollmentResolvers.Mutation,
    ...gradeResolvers.Mutation,
  },
};
