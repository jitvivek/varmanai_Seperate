export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL ?? 'http://localhost:3000';

/** Daily scans allowed for a signed-in free user (enforced server-side). */
export const DAILY_FREE_LIMIT = 50;

/**
 * Scans allowed before an anonymous (signed-out) user is prompted to sign in.
 * Kept low so usage is attributed to a real account quickly.
 */
export const ANON_FREE_LIMIT = 10;

/** Page that signs the user in and hands an API key to the extension. */
export const CONNECT_URL = `${WEBSITE_URL}/extension/connect`;

/** Billing/upgrade page (fallback if the API doesn't return one). */
export const BILLING_URL = `${WEBSITE_URL}/dashboard/billing`;
