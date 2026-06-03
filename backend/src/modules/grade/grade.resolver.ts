import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { gradeService } from './grade.service';

export interface GradesArgs {
  search?: string;
  courseId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}

export const gradeResolvers = {
  Query: {
    grades: async (_: unknown, args: GradesArgs, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return gradeService.findAll(args.search, args.courseId, args.studentId, {
        page: args.page,
        limit: args.limit,
      });
    },
    grade: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return gradeService.findById(id);
    },
  },
  Mutation: {
    createGrade: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return gradeService.create(input);
    },
    updateGrade: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return gradeService.update(id, input);
    },
    deleteGrade: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return gradeService.delete(id);
    },
  },
};
