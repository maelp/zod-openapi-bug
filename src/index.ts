import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { Client } from "pg";
import * as Pool from "pg-pool";
import type { Logger } from "pino";

// Import repository and service classes
import * as schema from "./schema";
export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * Database class that combines Drizzle functionality with additional services
 */
export class Database {
  // Core properties
  public readonly pool: Pool<Client>;
  public readonly db: ReturnType<typeof drizzle<typeof schema, Pool<Client>>>;

  constructor(
    options: {
      logger?: Logger;
      poolConfig?: Partial<ConstructorParameters<typeof Pool>[0]>;
    } = {},
  ) {
    // Create the database pool with default configuration
    const poolConfig = {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "password",
      database: "database",
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      ...options.poolConfig,
    };

    this.pool = new Pool(poolConfig);

    // Create the Drizzle instance
    this.db = drizzle(this.pool, {
      casing: "snake_case",
      schema,
    });
  }
}
