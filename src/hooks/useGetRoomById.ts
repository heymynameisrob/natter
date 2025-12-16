import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "@/server/room";

export function useGetRoomByIdQueryOptions(roomId: number) {
  return {
    queryKey: ["rooms", roomId] as const,
    queryFn: async () => await getRoomById({ data: { roomId } }),
    enabled: !!roomId,
  };
}

export function useGetRoomById(roomId: number) {
  return useQuery(useGetRoomByIdQueryOptions(roomId));
}
