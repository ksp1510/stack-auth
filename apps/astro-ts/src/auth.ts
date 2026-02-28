import { AuthService } from "@stack-auth/auth-spa";

const env = import.meta.env;

export const redirectUri =
  env.VITE_AUTH0_REDIRECT_URI ?? `${window.location.origin}/callback`;

export const logoutUri =
  env.VITE_AUTH0_LOGOUT_URI ?? `${window.location.origin}/`;

export const auth = new AuthService({
  domain: env.VITE_AUTH0_DOMAIN,
  clientId: env.VITE_AUTH0_CLIENT_ID,
  redirectUri,
  audience: env.VITE_AUTH0_AUDIENCE || undefined,
});

let inited = false;
export async function initAuthOnce(): Promise<void> {
  if (inited) return;
  await auth.init();
  inited = true;
}