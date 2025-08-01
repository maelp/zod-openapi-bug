import { pgSchema, uuid } from "drizzle-orm/pg-core";

export const opsPgSchema = pgSchema("ops");

export const uuidIdColumn = uuid("id").primaryKey().defaultRandom();

export const SYSTEM_USER_ID = "system:root"; // user_id for the system, when doing automated processing and updating batteries (eg when checking for alerts and changing their desiredState automatically, etc)
