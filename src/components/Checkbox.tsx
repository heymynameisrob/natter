import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui-components/react/checkbox-group";
import { CheckIcon } from "@heroicons/react/16/solid";
import { cn } from "tailwind-variants";

const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof BaseCheckboxGroup>,
  React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(({ className, ...props }, ref) => {
  return <BaseCheckboxGroup className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
CheckboxGroup.displayName = BaseCheckboxGroup.displayName;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof BaseCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>
>(({ className, ...props }, ref) => {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn(
        "flex size-5 items-center justify-center rounded-md data-[checked]:bg-accent border border-accent data-[unchecked]:border-border focus",
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
        <CheckIcon className="size-4" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
Checkbox.displayName = BaseCheckbox.Root.displayName;

export { Checkbox, CheckboxGroup };
