import { useEffect, useRef, useCallback, useState } from "react";
import PartySocket from "partysocket";
import type { PartyMessage } from "../../party/index";
import { PARTYKIT_URL } from "@/lib/utils";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

type UsePartySocketOptions = {
  /** User ID - used as the room name */
  userId: string;
  /** Session token for authentication */
  token: string;
  /** PartyKit host (defaults to localhost:1999 in dev) */
  host?: string;
  /** Called when a message is received */
  onMessage?: (message: PartyMessage) => void;
  /** Called when connection status changes */
  onStatusChange?: (status: ConnectionStatus) => void;
};

export function usePartySocket({
  userId,
  token,
  host = "localhost:1999",
  onMessage,
  onStatusChange,
}: UsePartySocketOptions) {
  const socketRef = useRef<PartySocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const updateStatus = useCallback(
    (newStatus: ConnectionStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  useEffect(() => {
    if (!userId || !token) return;

    setStatus("connecting");
    onStatusChange?.("connecting");

    const socket = new PartySocket({
      host: PARTYKIT_URL,
      room: userId,
      /** Unique ID allows for seperate connections on mutliple tabs for a single user */
      id: `${userId}-${Math.random()}`,
      query: { token },
    });

    socket.addEventListener("open", () => {
      updateStatus("connected");
    });

    socket.addEventListener("message", event => {
      try {
        const message = JSON.parse(event.data) as PartyMessage;
        onMessage?.(message);
      } catch {
        console.error("[PartySocket] Failed to parse message:", event.data);
      }
    });

    socket.addEventListener("close", event => {
      if (event.code >= 4000) {
        // Custom close codes indicate auth errors
        console.error("[PartySocket] Auth error:", event.reason);
        updateStatus("error");
      } else {
        updateStatus("disconnected");
      }
    });

    socket.addEventListener("error", () => {
      updateStatus("error");
    });

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, host]);

  const send = useCallback((message: PartyMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { send, status };
}
