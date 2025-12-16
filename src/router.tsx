import { createRouter } from "@tanstack/react-router";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { DefaultCatchBoundary } from "@/components/DefaultError";
import { NotFound } from "@/components/NotFound";

import { routeTree } from "./routeTree.gen";
import { isDev } from "@/lib/flags";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        /** Catches errors in wrapped error boundary. Ideally wrap each data-fetching component or route */
        throwOnError: true,
        /** Reduce agressive retries */
        retry: 1,
        /** Data should always be fresh */
        staleTime: 0,
      },
      mutations: {
        /** Log errors to console. Add error tracking like Sentry/PostHog here */
        onError: (error, variables, result, context) => {
          isDev && console.log("🔴 Mutation Failed", { error, variables, result, context });
        },
        /** Invalidate queries on success by default, when passing query key . Can overide on a per-query basis */
        onSuccess: (_data, _variables, _context, mutation) => {
          const queryKey = mutation.meta?.invalidateQuery as string[];
          if (queryKey) {
            queryClient.invalidateQueries({ queryKey });
          }
        },
      },
    },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
