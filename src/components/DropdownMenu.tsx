import * as React from "react";
import { Menu as BaseMenu } from "@base-ui-components/react/menu";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { cn } from "tailwind-variants";

const DropdownMenu = BaseMenu.Root;

const DropdownMenuTrigger = BaseMenu.Trigger;

const DropdownMenuGroup = BaseMenu.Group;

const DropdownMenuPortal = BaseMenu.Portal;

const DropdownMenuSub = BaseMenu.SubmenuRoot;

const DropdownMenuRadioGroup = BaseMenu.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof BaseMenu.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <BaseMenu.SubmenuTrigger
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-primary outline-none transition-colors focus:bg-gray-3 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus:bg-gray-3",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </BaseMenu.SubmenuTrigger>
));
DropdownMenuSubTrigger.displayName = BaseMenu.SubmenuTrigger.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof BaseMenu.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> & {
    dark?: boolean;
    align?: "center" | "end" | "start";
    alignOffset?: number;
    side?: "left" | "right" | "bottom" | "top" | "inline-end" | "inline-start";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 4, dark, ...props }, ref) => (
  <BaseMenu.Portal>
    <BaseMenu.Positioner
      className="h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)"
      align={align}
      sideOffset={sideOffset}
    >
      <BaseMenu.Popup
        ref={ref}
        className={cn(
          dark && "dark",
          "h-(--popup-height,auto) w-(--popup-width,auto) origin-[var(--transform-origin)] z-50 min-w-[8rem] overflow-hidden p-1",
          "bg-gray-1 text-primary rounded-lg shadow-raised focus",
          "transition-[transform,scale,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className
        )}
        {...props}
      />
    </BaseMenu.Positioner>
  </BaseMenu.Portal>
));
DropdownMenuContent.displayName = BaseMenu.Popup.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof BaseMenu.Item>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-primary outline-none transition-colors focus:bg-gray-3 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus:bg-gray-3",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = BaseMenu.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof BaseMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  return (
    <BaseMenu.CheckboxItem
      ref={ref}
      className={cn(
        "group relative flex cursor-default select-none items-center rounded-md py-1.5 pr-8 pl-2 text-sm font-medium text-primary outline-none transition-colors focus:bg-gray-3 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-3",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center rounded-sm group-data-[checked]:bg-accent border border-accent group-data-[unchecked]:border-border">
        <BaseMenu.CheckboxItemIndicator className="flex text-gray-50 data-[unchecked]:hidden">
          <CheckIcon className="size-4" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = BaseMenu.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof BaseMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItem
    ref={ref}
    className={cn(
      "group relative flex cursor-default select-none font-medium items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none transition-colors text-primary focus:bg-gray-3 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-3",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 grid place-items-center size-4 rounded-full border text-primary">
      <BaseMenu.RadioItemIndicator className="flex before:size-2 before:rounded-full before:bg-gray-12 group-data-[unchecked]:hidden" />
    </span>
    {children}
  </BaseMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = BaseMenu.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span"> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof BaseMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-black/10 dark:bg-white/10", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = BaseMenu.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
