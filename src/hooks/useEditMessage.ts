import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMessage } from "@/server/messages";

export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: number; content: any }) => await editMessage({ data }),
    onSuccess: data => {
      // Invalidate messages queries to refetch with updated message
      if (data?.roomId) {
        queryClient.invalidateQueries({
          queryKey: ["rooms", data.roomId, "messages"],
        });
      }
    },
  });
}
