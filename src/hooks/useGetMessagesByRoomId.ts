import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesByRoomId } from "@/server/messages";

export function useGetMessagesByRoomIdQueryOptions(roomId: number, limit: number = 50) {
  return {
    queryKey: ["rooms", roomId, "messages", limit] as const,
    queryFn: async ({ pageParam }: { pageParam?: number }) =>
      await getMessagesByRoomId({ data: { roomId, cursor: pageParam, limit } }),
    getNextPageParam: (lastPage: any) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
    initialPageParam: undefined,
    enabled: !!roomId,
  };
}

export function useGetMessagesByRoomId(roomId: number, limit: number = 50) {
  return useInfiniteQuery(useGetMessagesByRoomIdQueryOptions(roomId, limit));
}
