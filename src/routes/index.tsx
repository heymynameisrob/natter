import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });

        if (session) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/app" },
          });
        }

        return new Response(null, {
          status: 302,
          headers: { Location: "/login" },
        });
      },
    },
  },
});
