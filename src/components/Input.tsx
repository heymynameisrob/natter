import { Input as BaseInput } from "@base-ui-components/react/input";
import { cn } from "tailwind-variants";

import type React from "react";

type InputProps = { className?: string } & React.ComponentProps<typeof BaseInput>;

export const inputStyles = "h-11 w-full rounded-xl border pl-3.5 text-base text-gray-12 focus";

export function Input({ className, ...rest }: InputProps) {
  return <BaseInput {...rest} className={cn(inputStyles, className)} />;
}
