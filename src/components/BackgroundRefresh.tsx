import * as React from "react";
import { useWindowFocus } from "@/hooks/useWindowFocus";
import { useQueryClient } from "@tanstack/react-query";
import { isProd } from "@/lib/flags";

export function BackgroundRefresh() {
  const isFocused = useWindowFocus();
  const queryClient = useQueryClient();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /*
    After the user blurs the desktop window, wait one hour and check
    if their app's client code is eligble for a refresh (e.g not in focus and time lapsed)
    TODO: Add check for latest build from useHasLastestBuild when its mort trust worthy
  */
  React.useEffect(() => {
    const shouldRefresh = !isFocused && isProd;
    const WAIT = 1000 * 60 * 60; // 1hr

    /** Invalidates all queries and refreshes so everything is refetched */
    const handleRefresh = () => {
      if (!shouldRefresh) return null;
      queryClient.invalidateQueries();
      window?.location.reload();
    };

    if (isFocused) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(handleRefresh, WAIT);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isFocused, queryClient]);

  return null;
}
