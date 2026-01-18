import "./style.css";
import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";
import { auth } from "./auth";

function env(key) {
  return import.meta.env[key] ?? "";
}

function mask(value) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI"
];

function renderConfigError(missing) {
  const el = document.getElementById("app");
  if (!el) return;

  el.innerHTML = `
    <div class="app">
      <section class="card wide">
        <div class="title">stack-auth: Vue JS config error</div>
        <div class="sub">Missing required environment variables. Update <code>apps/vue-js/.env</code> and restart dev server.</div>

        <div class="panel" style="margin-top:14px;">
          <div class="panelTitle">Missing</div>
          <pre>${missing.map((m) => m).join("\n")}</pre>
        </div>

        <div class="panel">
          <div class="panelTitle">Current values (masked)</div>
          <pre>${JSON.stringify({
            VITE_AUTH0_DOMAIN: env("VITE_AUTH0_DOMAIN") || "(empty)",
            VITE_AUTH0_CLIENT_ID: env("VITE_AUTH0_CLIENT_ID") ? mask(env("VITE_AUTH0_CLIENT_ID")) : "(empty)",
            VITE_AUTH0_REDIRECT_URI: env("VITE_AUTH0_REDIRECT_URI") || "(empty)",
            VITE_AUTH0_LOGOUT_URI: env("VITE_AUTH0_LOGOUT_URI") || "(empty)"
          }, null, 2)}</pre>
        </div>

        <div class="small" style="margin-top:12px;">
          Also confirm Auth0 dashboard allows:
          <ul style="margin:6px 0 0; padding-left:18px;">
            <li>Callback: <code>http://localhost:5180/callback</code></li>
            <li>Web origin: <code>http://localhost:5180</code></li>
            <li>Logout: <code>http://localhost:5180/</code></li>
          </ul>
        </div>
      </section>
    </div>
  `;
}

(async () => {
  const missing = required.filter((k) => !env(k));
  if (missing.length) {
    renderConfigError(missing);
    return;
  }

  await auth.init();

  // Cancel/error handling only (Callback.vue owns code/state success)
  const url = new URL(window.location.href);
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") ?? "";

  if (err) {
    sessionStorage.setItem(
      "stackauth_notice",
      err === "access_denied" ? "Login cancelled." : `${err}${desc ? ": " + desc : ""}`
    );
    window.history.replaceState({}, "", "/");
  }

  createApp(App).use(router).mount("#app");
})();
