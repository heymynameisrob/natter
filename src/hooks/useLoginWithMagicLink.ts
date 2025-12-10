import { useMutation } from "@tanstack/react-query";

import { loginWithMagicLink } from "@/server/auth";

export function useLoginWithMagicLink() {
  return useMutation({
    mutationFn: (input: { email: string }) => loginWithMagicLink({ data: input }),
  });
}
