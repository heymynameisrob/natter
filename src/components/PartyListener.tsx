import { usePartySocket } from "@/hooks/usePartySocket";
import type { PartyMessage } from "../../party/index";

type PartyListenerProps = {
  userId: string;
  token: string;
};

export function PartyListener({ userId, token }: PartyListenerProps) {
  const { status } = usePartySocket({
    userId,
    token,
    onMessage: (message: PartyMessage) => {
      if (message.type === "message") {
        console.log("[Party]", message.payload.title);
      }
    },
  });

  return <div className="text-xs text-muted-foreground">Party: {status}</div>;
}
