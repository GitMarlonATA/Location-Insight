import { z } from 'zod';
import { describeLocationSchema, locationQueries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  location: {
    describe: {
      method: 'POST' as const,
      path: '/api/location/describe',
      input: describeLocationSchema,
      responses: {
        200: z.object({
          description: z.string(),
          address: z.string().optional(),
        }),
        500: errorSchemas.internal,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/location/history',
      responses: {
        200: z.array(z.custom<typeof locationQueries.$inferSelect>()),
      },
    }
  }
};
