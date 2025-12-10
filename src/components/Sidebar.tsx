import * as React from "react";
import { useMediaQuery } from "usehooks-ts";

import { MD_MAX_MEDIA_QUERY } from "@/lib/utils";
import { Button } from "@/components/Button";
import { MenuIcon } from "lucide-react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery(MD_MAX_MEDIA_QUERY);

  if (isMobile) {
    return (
      <nav className="bg-gray-1 flex items-center h-14 px-2">
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-4" />
        </Button>
      </nav>
    );
  }

  return (
    <nav role="navigation" className="bg-gray-1 flex flex-col">
      {children}
    </nav>
  );
}
