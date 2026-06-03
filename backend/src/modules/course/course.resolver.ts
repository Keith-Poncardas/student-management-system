import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { courseService } from './course.service';

export interface CoursesArgs {
  search?: string;
  page?: number;
  limit?: number;
}

export const courseResolvers = {
  Query: {
    courses: async (_: unknown, args: CoursesArgs, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return courseService.findAll(args.search, { page: args.page, limit: args.limit });
    },
    course: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return courseService.findById(id);
    },
  },
  Mutation: {
    createCourse: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return courseService.create(input);
    },
    updateCourse: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return courseService.update(id, input);
    },
    deleteCourse: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return courseService.delete(id);
    },
  },
};
