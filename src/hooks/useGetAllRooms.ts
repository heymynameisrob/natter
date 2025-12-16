import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllRoomIds } from "@/server/room";

export function useGetAllRoomIdsQueryOptions(limit = 20) {
  return {
    queryKey: ["room-ids", limit] as const,
    queryFn: async ({ pageParam }: { pageParam?: number }) =>
      await getAllRoomIds({ data: { cursor: pageParam, limit } }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: Awaited<ReturnType<typeof getAllRoomIds>>) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  };
}

export function useGetAllRoomIds(limit = 20) {
  return useInfiniteQuery(useGetAllRoomIdsQueryOptions(limit));
}
