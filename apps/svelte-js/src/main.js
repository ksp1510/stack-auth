// apps/svelte-js/src/main.js
import "./style.css";
import App from "./App.svelte";
import { auth } from "./auth";
import { mount } from "svelte";
import { syncRoute } from "./router";

function env(key) {
  return import.meta.env[key] ?? "";
}

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI"
];

(async () => {
  const missing = required.filter((k) => !env(k));

  if (!missing.length) {
    await auth.init();

    const url = new URL(window.location.href);
    const err = url.searchParams.get("error");
    const desc = url.searchParams.get("error_description") ?? "";
    const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");

    // Cancel/error callback -> store notice and go login
    if (err) {
      sessionStorage.setItem(
        "stackauth_notice",
        err === "access_denied" ? "Login cancelled." : `${err}${desc ? ": " + desc : ""}`
      );
      window.history.replaceState({}, "", "/");
    }

    // Success callback -> handle and go home
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

    // If someone manually visits /callback with no params, bounce to login
    if (window.location.pathname === "/callback" && !err && !hasAuthParams) {
      window.history.replaceState({}, "", "/");
    }
  }

  const target = document.getElementById("app");
  if (!target) throw new Error("Missing #app mount element in index.html");

  mount(App, { target });

  // IMPORTANT: ensure the router store reflects whatever replaceState did above
  syncRoute();
})();
