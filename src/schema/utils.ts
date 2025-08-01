import type { z } from "@hono/zod-openapi";

// Utility function to create refinements with better type inference
export function createRefinements<T extends Record<string, unknown>>(
  _table: T,
  refinements: Partial<{ [K in keyof T]: (schema: T[K]) => T[K] }>,
): Partial<{ [K in keyof T]: (schema: z.ZodTypeAny) => z.ZodTypeAny }> {
  return refinements as Partial<{
    [K in keyof T]: (schema: z.ZodTypeAny) => z.ZodTypeAny;
  }>;
}
