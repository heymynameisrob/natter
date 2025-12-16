import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { isDev } from "@/lib/flags";
import { sendPartyKitEvent } from "@/lib/party";
import { auth } from "@/lib/auth";

/**
 * Test endpoint for PartyKit - only available in development.
 * Sends a test notification to the current user's PartyKit room.
 */
export const Route = createFileRoute("/api/party/test")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isDev) {
          return json({ error: "Not available in production" }, { status: 404 });
        }

        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.id) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const success = await sendPartyKitEvent(session.user.id, {
          type: "message",
          payload: {
            id: 1,
            roomId: 1,
            plainText: "Test message",
            mentions: [],
            senderId: session.user.id,
          },
        });

        if (!success) {
          return json({ error: "Failed to send message" }, { status: 500 });
        }

        return json({ success: true, userId: session.user.id });
      },
    },
  },
});
