import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { magicLink as magicLinkPlugin } from "better-auth/plugins";

import { db, schema } from "@/lib/db";
import { isDev } from "@/lib/flags";
import { resend } from "@/lib/resend";
import { MagicLinkEmail } from "@/components/emails/magic-link";
import { getBaseURL } from "@/lib/utils";

const magicLink = magicLinkPlugin({
  sendMagicLink: async ({ email, url }) => {
    isDev && console.log("📥 🟢 Login w/ Magic Link", email);
    isDev && console.log("📥 Callback URL", url);
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Login to App",
      react: MagicLinkEmail({ url }),
    });
  },
});

export const authOptions: BetterAuthOptions = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  baseURL: getBaseURL(),
  /** Caches session in JWT-like cookie on users machine, so we dont hit DB all the time */
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 mins
    },
  },
};

export const auth = betterAuth({
  ...authOptions,
  /** Make sure tanstackStartCookies() is last in array */
  plugins: [magicLink, tanstackStartCookies()],
});
