import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/drizzle/schema";

/** NOTE (@heymynameisrob): Using Turso (libsql) for serverless-compatible SQLite.
 * Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your environment.
 * For local dev, you can use file:sqlite.db as the URL with no auth token.
 */
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:sqlite.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle({ client, schema });
export { db, schema };
