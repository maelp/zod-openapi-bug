CREATE SCHEMA "ops";
--> statement-breakpoint
CREATE TYPE "ops"."alert_level" AS ENUM('minor', 'major', 'critical');--> statement-breakpoint
CREATE TYPE "ops"."maintenance_ticket_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "ops"."battery_alert_trigger_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_type" text NOT NULL,
	"event_timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_alert_trigger_events_cursor_pagination" ON "ops"."battery_alert_trigger_events" USING btree ("event_timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);