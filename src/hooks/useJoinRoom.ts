import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinRoom } from "@/server/room";

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { publicId: string; inviteToken: string }) => await joinRoom({ data }),
    onSuccess: () => {
      // Invalidate room queries
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}
