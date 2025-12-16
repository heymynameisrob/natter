import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "@/server/messages";

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: number; content: any }) => await createMessage({ data }),
    onSuccess: (_, variables) => {
      // Invalidate messages query for the specific room
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.roomId, "messages"],
      });
    },
  });
}
