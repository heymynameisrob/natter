import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cn } from "tailwind-variants";

type TooltipProps = React.PropsWithChildren<{
  content: string | React.ReactNode;
  open?: boolean;
  /** Optional as if content is a string, we use that instead */
  ariaLabel?: string;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "center" | "start" | "end" | undefined;
  className?: string;
}>;

export const TooltipProvider = BaseTooltip.Provider;

export function Tooltip({
  children,
  content,
  open,
  ariaLabel,
  onOpenChange,
  side = "top",
  align = "center",
  className,
  ...props
}: TooltipProps) {
  return (
    <BaseTooltip.Root open={open} onOpenChange={onOpenChange}>
      <BaseTooltip.Trigger
        aria-label={typeof content === "string" ? content : ariaLabel}
        tabIndex={-1}
      >
        {children}
        <span className="sr-only">{content}</span>
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align}>
          <BaseTooltip.Popup
            className={cn(
              "origin-(--transform-origin) z-max overflow-hidden",
              "flex items-center justify-center px-2 py-1 h-7 text-xs font-medium text-white bg-black rounded-lg shadow-xl",
              "outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
            {...props}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
