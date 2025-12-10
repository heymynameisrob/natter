import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "file:sqlite.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
