// UNCOMMENT THOSE LINES FOR A HACK WHICH SOLVES THE ISSUE
// import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
// import { z } from "zod/v4";
// // HACK: we add this for zod-openapi, so that it finds the .openapi even when starting with `drizzle-kit generate`, etc
// extendZodWithOpenApi(z);

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "db",
    ssl: false
  },
  verbose: true,
  strict: true,
  casing: "snake_case",
});
