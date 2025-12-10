import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { getBaseURL } from "@/lib/utils";
import { isDev } from "@/lib/flags";
import { redirect } from "@tanstack/react-router";

const LoginSchema = z.object({
  email: z.email().min(1),
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  return auth.api.getSession({
    headers,
  });
});

export const loginWithMagicLink = createServerFn({ method: "POST" })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    try {
      auth.api.signInMagicLink({
        body: {
          name: data.email,
          email: data.email,
          callbackURL: `${getBaseURL()}/app`,
        },
        headers,
      });
    } catch (e) {
      isDev && console.log("🔴 Error", e as Error);
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const headers = getRequestHeaders();
  try {
    await auth.api.signOut({ headers });
  } catch (e) {
    isDev && console.log("🔴 Error", e as Error);
  }
  throw redirect({ to: "/login" });
});
