import { isDev } from "@/lib/flags";

export function withClientOnly<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    if (typeof window === "undefined") {
      return;
    }
    return fn(...args);
  }) as T;
}

export const ONE_MINUTE = 60_000;
export const TEN_MINUTES = 600_000;
export const ONE_HUNDRED_MINUTES = 6_000_000;

export const PARTYKIT_URL = process.env.PARTYKIT_HOST ?? "http://localhost:1999";

export const MD_MAX_MEDIA_QUERY = "(max-width: 767px)";

export function getBaseURL(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (isDev) return "http://localhost:3000";

  if (process.env.CONTEXT === "production") {
    return process.env.URL!;
  }
  return process.env.DEPLOY_PRIME_URL!;
}
