import * as React from "react";
import z from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Form } from "@base-ui-components/react/form";

import { useLoginWithMagicLink } from "@/hooks/useLoginWithMagicLink";
import { CenterLayout, Container } from "@/components/Layout";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/Field";
import { Input } from "@/components/Input";
import { isDev } from "@/lib/flags";
import { Button } from "@/components/Button";
import { cn } from "tailwind-variants";
import { getCurrentUser } from "@/server/auth";

export const Route = createFileRoute("/login")({
  loader: async () => {
    const user = await getCurrentUser();
    if (user) {
      throw redirect({ to: "/app" });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <CenterLayout>
      <Container size="xs">
        <section className="flex flex-col gap-6">
          <h1 className="sr-only">Login</h1>
          <LoginForm />
        </section>
      </Container>
    </CenterLayout>
  );
}

const LoginFormSchema = z.object({
  email: z
    .email("Please enter a valid email")
    .refine(val => !val.endsWith("@example.com"), "Example domain not allowed"),
});

function LoginForm() {
  const [errors, setErrors] = React.useState({});
  const [formState, setFormState] = React.useState<"idle" | "submitting" | "success">("idle");
  const loginWithMagicLink = useLoginWithMagicLink();

  const handleSubmit = async (formValues: z.infer<typeof LoginFormSchema>) => {
    setFormState("submitting");
    const result = LoginFormSchema.safeParse(formValues);
    console.log(formValues);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const errors: Record<string, string | string[]> = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        if (value) errors[key] = value;
      }
      setErrors(errors);
      setFormState("idle");
      return;
    }

    try {
      await loginWithMagicLink.mutateAsync({ ...formValues });
      setErrors({});
    } catch (e) {
      isDev && console.error("🔴 Mutation failed", e as Error);
      toast.error("Something went wrong");
    } finally {
      setFormState("success");
    }
  };

  const buttonLabel = React.useMemo(() => {
    switch (formState) {
      case "submitting":
        return <Loader2 className="size-5 animate-spin" />;
      case "success":
        return <CheckIcon className="size-5 opacity-100 text-white" />;
      default:
        return "Login";
    }
  }, [formState]);

  React.useEffect(() => {
    if (formState !== "success") return;
    const timeout = setTimeout(() => {
      setFormState("idle");
    }, 5_000);
    return () => clearTimeout(timeout);
  });

  return (
    <Form onFormSubmit={handleSubmit} errors={errors} className="flex flex-col gap-6">
      <Field name="email">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" placeholder="you@email.com" required />
        <FieldDescription>If the link doesnt arrive within 2 minutes. Try again.</FieldDescription>
        <FieldError />
      </Field>
      <Button
        type="submit"
        size="lg"
        variant="accent"
        disabled={formState === "submitting"}
        className={cn(
          formState === "success"
            ? "bg-green-500 text-white dark:bg-green-500 pointer-events-none"
            : ""
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            initial={{ opacity: 0, y: -16, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, filter: "blur(2px)" }}
            key={formState}
            className="drop-shadow-xs"
          >
            {buttonLabel}
          </motion.span>
        </AnimatePresence>
      </Button>
    </Form>
  );
}
