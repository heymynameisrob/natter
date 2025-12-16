import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "@/server/room";

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: number; name: string }) => await updateRoom({ data }),
    onSuccess: (_, variables) => {
      // Invalidate room queries
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["room", variables.roomId],
      });
    },
  });
}
