import { Button } from "@/components/Button";
import { Container, InnerPage, SidebarLayout } from "@/components/Layout";
import { PartyListener } from "@/components/PartyListener";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { mutate: logout } = useLogout();
  return (
    <PartyListener userId={session.session.userId} token={session.session.token}>
      <SidebarLayout>
        <Sidebar>
          <p>Sidebar</p>
        </Sidebar>
        <InnerPage>
          <div className="grid place-items-center h-full">
            <div className="flex flex-col justify-center items-center gap-4">
              <h1>Hey {session?.user.name}</h1>
              <p>Inbox</p>
              <ThemeToggle />
              <Button onClick={() => logout()} variant="destructive">
                Logout
              </Button>
            </div>
          </div>
        </InnerPage>
      </SidebarLayout>
    </PartyListener>
  );
}
