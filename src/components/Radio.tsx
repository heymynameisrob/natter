import * as React from "react";
import { Radio as BaseRadio, Radio } from "@base-ui-components/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group";
import { cn } from "tailwind-variants";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof BaseRadioGroup>,
  React.ComponentPropsWithoutRef<typeof BaseRadioGroup>
>(({ className, ...props }, ref) => {
  return <BaseRadioGroup className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = BaseRadioGroup.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof BaseRadio.Root>,
  React.ComponentPropsWithoutRef<typeof BaseRadio.Root>
>(({ className, ...props }, ref) => {
  return (
    <Radio.Root
      ref={ref}
      id={props.value}
      className={cn(
        "aspect-square grid place-items-center size-5 rounded-full border text-primary ring-offset-background focus disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Radio.Indicator className="flex before:size-2 before:rounded-full before:bg-gray-12 data-[unchecked]:hidden" />
    </Radio.Root>
  );
});
RadioGroupItem.displayName = BaseRadio.Root.displayName;

export { RadioGroup, RadioGroupItem };
