export const ADMIN_COOKIE = "admin_session";

/**
 * The admin password. Set ADMIN_PASSWORD in your .env; falls back to "admin"
 * for first-run convenience (change it before putting the site online).
 */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}
