import { AuthService } from "@stack-auth/auth-spa";

const env = import.meta.env;

export const auth = new AuthService({
  domain: env.VITE_AUTH0_DOMAIN,
  clientId: env.VITE_AUTH0_CLIENT_ID,
  redirectUri: env.VITE_AUTH0_REDIRECT_URI,
  audience: env.VITE_AUTH0_AUDIENCE
});

export const logoutUri = env.VITE_AUTH0_LOGOUT_URI;

let inited = false;
export async function initAuthOnce() {
  if (inited) return;
  await auth.init();
  inited = true;
}
