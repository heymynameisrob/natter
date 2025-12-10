/// <reference types="vite/client" />
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Outlet, HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "@/components/Tooltip";

import { NotFound } from "@/components/NotFound";
import { DefaultCatchBoundary } from "@/components/DefaultError";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

import type { QueryClient } from "@tanstack/react-query";

import appCss from "@/global.css?url";
import { BackgroundRefresh } from "@/components/BackgroundRefresh";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
  }),
  errorComponent: props => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-primary antialiased">
        <ThemeProvider defaultTheme="system">
          <TooltipProvider delay={250} closeDelay={500}>
            {children}
          </TooltipProvider>
          <ToastWrapper />
        </ThemeProvider>
        <BackgroundRefresh />
        <DevTools />
        <Scripts />
      </body>
    </html>
  );
}

function DevTools() {
  return (
    <div className="hidden md:block">
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </div>
  );
}

function ToastWrapper() {
  const { theme } = useTheme();
  return <Toaster theme={theme as "light" | "dark" | "system"} mobileOffset="72px" />;
}
