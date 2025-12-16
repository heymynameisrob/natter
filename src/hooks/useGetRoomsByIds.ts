import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoomsByIds } from "@/server/room";

export function useGetRoomsByIdsQueryOptions(roomIds: number[]) {
  return {
    queryKey: ["rooms", "batch", roomIds] as const,
    queryFn: async () => await getRoomsByIds({ data: { roomIds } }),
    enabled: roomIds.length > 0,
  };
}

export function useGetRoomsByIds(roomIds: number[]) {
  const queryClient = useQueryClient();

  const query = useQuery(useGetRoomsByIdsQueryOptions(roomIds));

  // Automatically populate individual room cache entries when data is available
  if (query.data) {
    query.data.forEach(room => {
      queryClient.setQueryData(["rooms", room.id], room);
    });
  }

  return query;
}
