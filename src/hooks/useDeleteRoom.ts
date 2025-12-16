import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/server/room";

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: number }) => await deleteRoom({ data }),
    onSuccess: (_, variables) => {
      // Invalidate room queries
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      // Remove specific room and its messages from cache
      queryClient.removeQueries({
        queryKey: ["rooms", variables.roomId],
      });
    },
  });
}
