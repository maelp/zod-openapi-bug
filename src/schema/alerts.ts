import type { z } from "@hono/zod-openapi";
import { relations } from "drizzle-orm";
import { index, jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { opsPgSchema, uuidIdColumn } from "./shared";
import { createRefinements } from "./utils";

// Alert severity enum
export const alertLevelEnum = opsPgSchema.enum("alert_level", [
	"minor", // minor anomaly, monitor
	"major", // must be set aside
	"critical", // must be set aside urgently
]);

export type AlertLevel = (typeof alertLevelEnum.enumValues)[number];

const ALERT_LEVEL_ORDERING = {
	minor: 1,
	major: 2,
	critical: 3,
} as const;

export const alertLevelOrdering = (level: AlertLevel) => {
	return ALERT_LEVEL_ORDERING[level];
};

export const alertLevelShouldTriggerMaintenanceTicket = (level: AlertLevel) => {
	return alertLevelOrdering(level) >= alertLevelOrdering("major");
};

// Maintenance ticket status enum
export const maintenanceTicketStatusEnum = opsPgSchema.enum(
	"maintenance_ticket_status",
	["open", "closed"],
);

export type MaintenanceTicketStatus =
	(typeof maintenanceTicketStatusEnum.enumValues)[number];

// Alert trigger events table (immutable history)
export const alertTriggerEventsTable = opsPgSchema.table(
	"battery_alert_trigger_events",
	{
		id: uuidIdColumn,
		trigger_type: text("trigger_type").notNull(), // 'over_temp', 'low_voltage', etc.
		event_timestamp: timestamp("event_timestamp", {
			withTimezone: true,
		}).notNull(),
	},
	(table) => [
		// Cursor pagination index
		index("idx_alert_trigger_events_cursor_pagination").on(
			table.event_timestamp.desc(),
			table.id.desc(),
		),
	],
);

// Zod schema refinements with OpenAPI descriptions for Alert Trigger Events
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
