import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/server/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getCurrentUser();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
