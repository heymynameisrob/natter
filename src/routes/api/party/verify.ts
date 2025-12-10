import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { db, schema } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";

/**
 * Auth verification endpoint for PartyKit.
 * Validates session tokens and returns the userId if valid.
 * Protected by PARTY_AUTH_SECRET to ensure only PartyKit can call this.
 */
export const Route = createFileRoute("/api/party/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Verify the request comes from PartyKit using shared secret
        const authHeader = request.headers.get("Authorization");
        const expectedSecret = process.env.PARTY_AUTH_SECRET;

        if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
          const body = (await request.json()) as { token: string };

          if (!body.token) {
            return json({ error: "Missing token" }, { status: 400 });
          }

          // Find valid session
          const sessions = await db
            .select({ userId: schema.session.userId })
            .from(schema.session)
            .where(
              and(eq(schema.session.token, body.token), gt(schema.session.expiresAt, new Date()))
            )
            .limit(1);

          console.log(body, sessions);

          if (sessions.length === 0) {
            return json({ error: "Invalid or expired session" }, { status: 401 });
          }

          return json({ userId: sessions[0]!.userId });
        } catch {
          return json({ error: "Internal error" }, { status: 500 });
        }
      },
    },
  },
});
