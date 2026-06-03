import { User } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface GraphQLContext {
  user: User | null;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
