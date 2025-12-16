import { getBaseURL } from "@/lib/utils";
import type * as Party from "partykit/server";

/**
 * Authenticated relay server - each room is scoped to a user ID.
 * Only the authenticated user can connect to their own room.
 *
 * Usage:
 * - Room ID = user ID (each user gets their own private room)
 * - Pass session token as query param: ?token=SESSION_TOKEN
 * - Server validates token via your app's auth verification endpoint
 */

export type PartyMessage =
  | {
      type: "message";
      payload: {
        id: number;
        roomId: number;
        plainText: string;
        mentions: string[];
        senderId: string;
      };
    }
  | {
      type: "sync";
      payload: { resource: string; action: "created" | "updated" | "deleted"; id: string };
    }
  | { type: "custom"; payload: Record<string, unknown> };

type Env = {
  APP_URL: string; // Your app's URL for auth verification
  PARTY_AUTH_SECRET: string; // Shared secret for server->party communication
};

async function validateSession(token: string, env: Env): Promise<{ userId: string } | null> {
  try {
    /** Deploy with APP_URL from CI */
    const response = await fetch(`${env.APP_URL ?? "http://localhost:3000"}/api/party/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.PARTY_AUTH_SECRET}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { userId: string };
    return data;
  } catch (error) {
    console.error("[PartyKit] Auth verification failed:", error);
    return null;
  }
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      conn.close(4001, "Missing authentication token");
      return;
    }

    const env = this.room.env as Env;
    const session = await validateSession(token, env);

    if (!session) {
      conn.close(4002, "Invalid or expired session");
      return;
    }

    // Verify the user is connecting to their own room
    if (session.userId !== this.room.id) {
      conn.close(4003, "Unauthorized: room access denied");
      return;
    }

    conn.setState({ userId: session.userId });
    console.log(`[PartyKit] User ${session.userId} connected to their room`);
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      JSON.parse(message);
    } catch {
      sender.send(JSON.stringify({ type: "error", payload: { message: "Invalid JSON" } }));
      return;
    }

    // Relay to all connections in this room (syncs across tabs/devices)
    this.room.broadcast(message, [sender.id]);
  }

  // HTTP endpoint for server-to-client messages
  async onRequest(req: Party.Request) {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const env = this.room.env as Env;
    const authHeader = req.headers.get("Authorization");

    // Verify server secret for server->party communication
    if (authHeader !== `Bearer ${env.PARTY_AUTH_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const message = (await req.json()) as PartyMessage;
      this.room.broadcast(JSON.stringify(message));
      return new Response("OK", { status: 200 });
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }
  }

  onClose(conn: Party.Connection) {
    const state = conn.state as { userId?: string } | undefined;
    if (state?.userId) {
      console.log(`[PartyKit] User ${state.userId} disconnected`);
    }
  }
}

Server satisfies Party.Worker;
