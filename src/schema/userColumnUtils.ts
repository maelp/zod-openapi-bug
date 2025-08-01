import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "@workspace/db/schema/users";

// Define some column utils that are based on the user table
// WARNING: since this depends on usersTable, there might be circular dependencies

// Define audit columns that will be used in most tables
export const createdByColumns = {
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  created_by_user_id: uuid("created_by_user_id")
    .references(() => usersTable.id)
    .notNull(),
};
export const omitCreatedByColumns = {
  created_at: true,
  created_by_user_id: true,
} as const;

export const updatedByColumns = {
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  updated_by_user_id: uuid("updated_by_user_id")
    .references(() => usersTable.id)
    .notNull(),
};
export const omitUpdatedByColumns = {
  updated_at: true,
  updated_by_user_id: true,
} as const;

// Define columns for entities that can be deactivated
export const deactivatableColumns = {
  deactivated_at: timestamp("deactivated_at", { withTimezone: true }),
  deactivated_by_user_id: uuid("deactivated_by_user_id").references(
    () => usersTable.id,
  ),
};
export const omitDeactivatableColumns = {
  deactivated_at: true,
  deactivated_by_user_id: true,
} as const;

// Define columns for entities that can be discarded
export const discardableColumns = {
  discarded_at: timestamp("discarded_at", { withTimezone: true }),
  discarded_by_user_id: uuid("discarded_by_user_id").references(
    () => usersTable.id,
  ),
  discard_reason: text("discard_reason"),
};
export const omitDiscardableColumns = {
  discarded_at: true,
  discarded_by_user_id: true,
  discard_reason: true,
} as const;
