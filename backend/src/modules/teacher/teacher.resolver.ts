import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { teacherService } from './teacher.service';

export interface TeachersArgs {
  search?: string;
  page?: number;
  limit?: number;
}

export const teacherResolvers = {
  Query: {
    teachers: async (_: unknown, args: TeachersArgs, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return teacherService.findAll(args.search, { page: args.page, limit: args.limit });
    },
    teacher: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return teacherService.findById(id);
    },
  },
  Mutation: {
    createTeacher: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return teacherService.create(input);
    },
    updateTeacher: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return teacherService.update(id, input);
    },
    deleteTeacher: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return teacherService.delete(id);
    },
  },
};
