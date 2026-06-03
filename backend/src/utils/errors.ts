import { GraphQLError } from 'graphql';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function throwGraphQLError(message: string, code: string = 'INTERNAL_SERVER_ERROR'): never {
  throw new GraphQLError(message, {
    extensions: { code },
  });
}

export function throwNotFound(entity: string): never {
  throwGraphQLError(`${entity} not found`, 'NOT_FOUND');
}

export function throwUnauthorized(message: string = 'Not authenticated'): never {
  throwGraphQLError(message, 'UNAUTHENTICATED');
}

export function throwForbidden(message: string = 'Not authorized'): never {
  throwGraphQLError(message, 'FORBIDDEN');
}

export function throwBadInput(message: string): never {
  throwGraphQLError(message, 'BAD_USER_INPUT');
}
