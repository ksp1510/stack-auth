// apps/astro-js/src/auth.js
import { AuthService } from "@stack-auth/auth-spa";

const env = import.meta.env;

// Match the Svelte stack defaults:
// - redirect goes to /callback
// - post-logout returns to /
export const redirectUri =
  env.VITE_AUTH0_REDIRECT_URI ?? `${window.location.origin}/callback`;

export const logoutUri =
  env.VITE_AUTH0_LOGOUT_URI ?? `${window.location.origin}/`;

// Optional audience (used for API access); omit if blank
const audience = env.VITE_AUTH0_AUDIENCE ? env.VITE_AUTH0_AUDIENCE : undefined;

// Auth0 SPA wrapper used across stacks
export const auth = new AuthService({
  domain: env.VITE_AUTH0_DOMAIN,
  clientId: env.VITE_AUTH0_CLIENT_ID,
  redirectUri,
  audience,
});

// Ensure init() is called exactly once (same idea as other stacks)
let inited = false;
export async function initAuthOnce() {
  if (inited) return;
  await auth.init();
  inited = true;
}