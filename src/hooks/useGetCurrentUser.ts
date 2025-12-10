import { ONE_HUNDRED_MINUTES } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrentUserQueryOptions() {
  return {
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUser(),
    staleTime: ONE_HUNDRED_MINUTES,
  };
}

export function useGetCurrentUser() {
  return useQuery(useGetCurrentUserQueryOptions());
}
