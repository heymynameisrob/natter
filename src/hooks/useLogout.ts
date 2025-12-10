import { useMutation } from "@tanstack/react-query";

import { logout } from "@/server/auth";

export function useLogout() {
  return useMutation({
    mutationFn: () => logout(),
  });
}
