import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveRoom } from "@/server/room";

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: number }) => await leaveRoom({ data }),
    onSuccess: (_, variables) => {
      // Invalidate room queries
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      // Also invalidate messages for this room
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.roomId, "messages"],
      });
    },
  });
}
