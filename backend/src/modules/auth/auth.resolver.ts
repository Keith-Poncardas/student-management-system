import { GraphQLContext } from '../../types';
import { throwUnauthorized } from '../../utils/errors';
import { authService } from './auth.service';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throwUnauthorized();
      }
      return context.user;
    },
  },
  Mutation: {
    signup: async (_: unknown, { input }: { input: { name: string; email: string; password: string } }) => {
      return authService.signup(input);
    },
    login: async (_: unknown, { input }: { input: { email: string; password: string } }) => {
      return authService.login(input);
    },
  },
};
