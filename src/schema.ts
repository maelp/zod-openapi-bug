import type { z } from "@hono/zod-openapi";
import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";

export const opsPgSchema = pgSchema("ops");

// Utility function to create refinements with better type inference
export function createRefinements<T extends Record<string, unknown>>(
  _table: T,
  refinements: Partial<{ [K in keyof T]: (schema: T[K]) => T[K] }>,
): Partial<{ [K in keyof T]: (schema: z.ZodTypeAny) => z.ZodTypeAny }> {
  return refinements as Partial<{
    [K in keyof T]: (schema: z.ZodTypeAny) => z.ZodTypeAny;
  }>;
}

// Alert trigger events table (immutable history)
export const alertTriggerEventsTable = opsPgSchema.table("alert_triggers", {
	id: uuid("id").primaryKey().defaultRandom(),
	trigger_type: text("trigger_type").notNull(), // 'over_temp', 'low_voltage', etc.
	event_timestamp: timestamp("event_timestamp", {
		withTimezone: true,
	}).notNull(),
});

// Zod schema refinements with OpenAPI descriptions for Alert Trigger Events
// TODO: not sure why this doesn't typecheck
const alertTriggerEventRefinements = createRefinements(
	createSelectSchema(alertTriggerEventsTable).shape,
	{
		id: (schema) =>
			schema.openapi({
				description: "Unique identifier for the alert trigger event",
			}),
		event_timestamp: (schema) =>
			schema.openapi({
				description:
					"Timestamp of the battery data that resulted in the alert detection",
			}),
		trigger_type: (schema) =>
			schema.openapi({
				description: "Type of trigger (e.g., over_temp, low_voltage)",
			}),
	},
);

// Create Zod schemas for Alert Trigger Events
export const selectAlertTriggerEventSchema = createSelectSchema(
	alertTriggerEventsTable,
	alertTriggerEventRefinements,
);

export const insertAlertTriggerEventSchema = createInsertSchema(
	alertTriggerEventsTable,
	alertTriggerEventRefinements,
).omit({
	id: true,
});

export const patchAlertTriggerEventSchema = createUpdateSchema(
	alertTriggerEventsTable,
	alertTriggerEventRefinements,
).omit({
	id: true,
});

// Export TypeScript types
export type AlertTriggerEvent = z.infer<typeof selectAlertTriggerEventSchema>;
export type NewAlertTriggerEvent = z.infer<
	typeof insertAlertTriggerEventSchema
>;
export type PatchAlertTriggerEvent = z.infer<
	typeof patchAlertTriggerEventSchema
>;
