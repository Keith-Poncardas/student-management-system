import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { enrollmentService } from './enrollment.service';

export interface EnrollmentsArgs {
  search?: string;
  page?: number;
  limit?: number;
}

export const enrollmentResolvers = {
  Query: {
    enrollments: async (_: unknown, args: EnrollmentsArgs, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return enrollmentService.findAll(args.search, { page: args.page, limit: args.limit });
    },
    enrollment: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return enrollmentService.findById(id);
    },
  },
  Mutation: {
    createEnrollment: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return enrollmentService.create(input);
    },
    deleteEnrollment: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return enrollmentService.delete(id);
    },
  },
};
