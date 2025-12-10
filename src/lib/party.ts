import type { PartyMessage } from "../../party/index";

const PARTYKIT_HOST = process.env.PARTYKIT_HOST ?? "localhost:1999";
const PARTY_AUTH_SECRET = process.env.PARTY_AUTH_SECRET;

/**
 * Send an event to a user's PartyKit room from the server.
 * Use this in server functions to push real-time updates to clients.
 *
 * @example
 * ```ts
 * // In a server function after creating a resource
 * await sendPartyKitEvent(userId, {
 *   type: "sync",
 *   payload: { resource: "posts", action: "created", id: newPost.id }
 * });
 * ```
 */
export async function sendPartyKitEvent(userId: string, message: PartyMessage): Promise<boolean> {
  if (!PARTY_AUTH_SECRET) {
    console.error("[Party] PARTY_AUTH_SECRET not configured");
    return false;
  }

  const url = `${PARTYKIT_HOST}/parties/main/${userId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PARTY_AUTH_SECRET}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("[Party] Failed to send message:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Party] Error sending message:", url, error);
    return false;
  }
}
