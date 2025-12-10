import * as React from "react";
import { usePartySocket } from "@/hooks/usePartySocket";
import type { PartyMessage } from "../../party/index";
import { isDev } from "@/lib/flags";

type PartyListenerProps = {
  children: React.ReactNode;
  userId: string;
  token: string;
};

export function PartyListener({ children, userId, token }: PartyListenerProps) {
  const { status } = usePartySocket({
    userId,
    token,
    onMessage: (message: PartyMessage) => {
      /** This is where we'll add the queryClient.refetchQuery for messages  */
      /** This is where we'll add a trigger notification too that checks prefs and creates a push notif  */
      if (message.type === "message") {
        console.log("[Party]", message.payload.title);
      }
    },
  });

  isDev && console.log("[PartyKit Listener]", status);

  return <>{children}</>;
}
