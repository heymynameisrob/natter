import { Button } from "@/components/Button";
import { PartyListener } from "@/components/PartyListener";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: me } = useGetCurrentUser();
  const { mutate: logout } = useLogout();
  return (
    <div>
      <h1>Hey {me?.user.name}</h1>
      <p>Welcome to your dashboard.</p>
      {me && <PartyListener userId={me.user.id} token={me.session.token} />}
      <Button onClick={() => logout()} variant="destructive">
        Logout
      </Button>
    </div>
  );
}
