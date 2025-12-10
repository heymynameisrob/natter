import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { XMarkIcon as XIcon } from "@heroicons/react/16/solid";
import { cn, tv, type VariantProps } from "tailwind-variants";

const Dialog = BaseDialog.Root;

const DialogTrigger = BaseDialog.Trigger;

const DialogPortal = BaseDialog.Portal;

const DialogClose = BaseDialog.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = BaseDialog.Backdrop.displayName;

const dialogContentVariants = tv({
  base: cn(
    "fixed left-[50%] top-[50%] z-50 flex flex-col w-full translate-x-[-50%] translate-y-[-50%] gap-4 bg-background p-6 shadow-floating duration-200 rounded-lg max-h-[95dvh]",
    "transition-all duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:blur-sm data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:blur-sm"
  ),
  variants: {
    size: {
      sm: "max-w-[90vw] sm:max-w-sm",
      md: "max-w-[90vw] sm:max-w-lg", // Default size
      lg: "max-w-[95vw] sm:max-w-2xl",
      xl: "max-w-[95vw] sm:max-w-4xl",
      full: "max-w-[95vw] sm:max-w-6xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> &
    VariantProps<typeof dialogContentVariants> & {
      overlay?: boolean;
      close?: boolean;
    }
>(({ className, size, overlay = true, close = true, children, ...props }, ref) => (
  <DialogPortal>
    {overlay && <DialogOverlay />}
    <BaseDialog.Popup
      ref={ref}
      className={cn(dialogContentVariants({ size }), className)}
      {...props}
    >
      {children}
      {close && (
        <BaseDialog.Close
          data-testid="close-dialog"
          className="absolute right-3 top-3 size-6 hover:bg-gray-3 grid place-items-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </BaseDialog.Close>
      )}
    </BaseDialog.Popup>
  </DialogPortal>
));
DialogContent.displayName = BaseDialog.Popup.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Title>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = BaseDialog.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Description>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn(" text-sm text-secondary", className)}
    {...props}
  />
));
DialogDescription.displayName = BaseDialog.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
};
