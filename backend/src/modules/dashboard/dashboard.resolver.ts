import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { dashboardService } from './dashboard.service';

export const dashboardResolvers = {
  Query: {
    dashboardStats: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throwUnauthorized();
      return dashboardService.getStats();
    },
  },
};
