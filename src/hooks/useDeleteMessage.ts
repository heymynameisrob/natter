import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "@/server/messages";

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: number }) => await deleteMessage({ data }),
    onSuccess: () => {
      // Invalidate all room message queries since we don't have roomId in the response
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === "rooms" && query.queryKey[2] === "messages",
      });
    },
  });
}
