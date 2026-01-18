import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { auth } from "./auth";

function env(key: string) {
  return (import.meta.env[key] as string | undefined) ?? "";
}

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI",
] as const;

(async () => {
  const missing = required.filter((k) => !env(k));

  if (!missing.length) {
    await auth.init();

    const url = new URL(window.location.href);

    const err = url.searchParams.get("error");
    const desc = url.searchParams.get("error_description") ?? "";

    const hasAuthParams =
      url.searchParams.has("code") && url.searchParams.has("state");

    // Cancel / error → store notice, go Login
    if (err) {
      sessionStorage.setItem(
        "stackauth_notice",
        err === "access_denied"
          ? "Login cancelled."
          : `${err}${desc ? ": " + desc : ""}`
      );
      window.history.replaceState({}, "", "/");
    }

    // Success → handle callback, go Home
    if (hasAuthParams) {
      try {
        await auth.handleRedirectCallback();
        window.history.replaceState({}, "", "/home");
      } catch (e) {
        const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        sessionStorage.setItem("stackauth_notice", msg);
        window.history.replaceState({}, "", "/");
      }
    }

    // /callback with no params → go Login
    if (window.location.pathname === "/callback" && !err && !hasAuthParams) {
      window.history.replaceState({}, "", "/");
    }
  }

  // IMPORTANT: import router AFTER history is finalized
  const { router } = await import("./router");

  const app = createApp(App);
  app.use(router);
  await router.isReady();
  app.mount("#app");
})();
