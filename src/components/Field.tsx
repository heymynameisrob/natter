import { Fieldset as BaseFieldset } from "@base-ui-components/react/fieldset";
import { Field as BaseField } from "@base-ui-components/react/field";
import { cn } from "tailwind-variants";
import { labelStyles } from "@/components/Label";
import { inputStyles } from "@/components/Input";

export function Field({ className, ...props }: React.ComponentProps<typeof BaseField.Root>) {
  return <BaseField.Root className={cn("grid gap-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<typeof BaseField.Label>) {
  return <BaseField.Label className={cn(labelStyles, className)} {...props} />;
}

export function FieldControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Control>) {
  return <BaseField.Control className={cn(inputStyles, className)} {...props} />;
}

export function FieldError({ className, ...props }: React.ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      className={cn("text-sm font-medium text-red-700 dark:text-red-400", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      className={cn("text-sm font-medium text-gray-10", className)}
      {...props}
    />
  );
}

export function Fieldset({ className, ...props }: React.ComponentProps<typeof BaseFieldset.Root>) {
  return (
    <BaseFieldset.Root
      className={cn("flex w-full max-w-64 flex-col gap-4", className)}
      {...props}
    />
  );
}

export function FieldsetLegend({
  className,
  ...props
}: React.ComponentProps<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      className={cn("border-b pb-3 text-sm font-medium text-gray-12", className)}
      {...props}
    />
  );
}
