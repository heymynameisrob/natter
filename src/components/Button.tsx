import * as React from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cn, tv, type VariantProps } from "tailwind-variants";

export const buttonStyles = tv({
  base: "inline-flex gap-2 items-center whitespace-nowrap justify-center rounded-full text-sm leading-4 font-medium focus disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    variant: {
      primary: "bg-gray-12 text-background shadow-container hover:bg-gray-11",
      secondary:
        "bg-gray-1 text-gray-12 shadow-container hover:bg-gray-3 dark:bg-gray-2 dark:hover:bg-gray-3",
      accent: "bg-accent text-white shadow-container hover:bg-dark-accent",
      ghost: "bg-transparent text-gray-12 hover:bg-gray-3",
      destructive: "bg-red-500 text-white shadow-container hover:bg-red-600",
    },
    size: {
      sm: "h-6 px-1.5",
      md: "h-8 px-3",
      lg: "h-11 px-8 text-[15px]",
      icon: "size-8 px-1 py-1",
    },
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> & React.ComponentProps<typeof BaseButton>;

export function Button({ className, size, variant, children, ...rest }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        buttonStyles({ size: size ?? "md", variant: variant ?? "secondary" }),
        className
      )}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}
