import * as React from "react";
import { cn } from "tailwind-variants";

export const labelStyles =
  "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn(labelStyles, className)} {...props} />;
}
