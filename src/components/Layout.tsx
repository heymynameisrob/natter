import { tv, type VariantProps } from "tailwind-variants";

export const containerStyles = tv({
  base: "mx-auto w-full px-5",
  variants: {
    size: {
      xs: "max-w-lg",
      sm: "max-w-2xl",
      prose: "max-w-prose",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      full: "max-w-none",
    },
  },
});

type ContainerProps = React.PropsWithChildren<VariantProps<typeof containerStyles>>;

export function Container({ children, size }: ContainerProps) {
  return <div className={containerStyles({ size: size ?? "md" })}>{children}</div>;
}

export function CenterLayout({ children }: { children: React.ReactNode }) {
  return <main className="w-full h-screen grid place-items-center">{children}</main>;
}
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-[248px_1fr] h-screen overflow-hidden">
      {children}
    </main>
  );
}
export function InnerPage({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full overflow-y-scroll">{children}</div>;
}

export function AppPageLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
