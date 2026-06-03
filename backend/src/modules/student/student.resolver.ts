import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { studentService } from './student.service';

export interface StudentsArgs {
  search?: string;
  page?: number;
  limit?: number;
}

export const studentResolvers = {
  Query: {
    students: async (_: unknown, args: StudentsArgs, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return studentService.findAll(args.search, { page: args.page, limit: args.limit });
    },
    student: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return studentService.findById(id);
    },
  },
  Mutation: {
    createStudent: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return studentService.create(input);
    },
    updateStudent: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return studentService.update(id, input);
    },
    deleteStudent: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return studentService.delete(id);
    },
  },
};
