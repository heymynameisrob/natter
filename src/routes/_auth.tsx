import { Outlet, createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/_auth")({
  server: {
    middleware: [authMiddleware],
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
