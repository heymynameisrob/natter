import { Avatar as BaseAvatar } from "@base-ui-components/react/avatar";
import { cn, tv, type VariantProps } from "tailwind-variants";

type AvatarProps = {
  src: string;
  fallback: string;
  className?: string;
} & VariantProps<typeof avatarStyles>;

const avatarStyles = tv({
  base: "inline-flex items-center justify-center overflow-hidden bg-gray-5 align-middle text-base font-medium text-white select-none",
  variants: {
    variant: {
      circle: "rounded-full",
      rounded: "rounded-lg",
    },
    size: {
      xs: "size-4",
      sm: "size-5",
      md: "size-8",
      lg: "size-10",
      xl: "size-16",
    },
  },
});

export function Avatar({ size, variant, src, fallback, className }: AvatarProps) {
  return (
    <BaseAvatar.Root
      className={cn(avatarStyles({ size: size ?? "sm", variant: variant ?? "circle" }), className)}
    >
      <BaseAvatar.Image src={src} loading="lazy" alt={fallback} />
      <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
