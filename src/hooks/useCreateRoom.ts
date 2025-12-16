import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "@/server/room";

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; members: string[] }) => await createRoom({ data }),
    onSuccess: () => {
      // Invalidate any room list queries
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}
