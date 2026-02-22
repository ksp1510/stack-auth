import "./style.css";
import { render } from "solid-js/web";
import App from "./App";
import { auth } from "./auth";
import { navigate } from "./router";

function env(key: string): string {
  return (import.meta.env[key] as string | undefined) ?? "";
}

function mask(value: string): string {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI"
] as const;

function renderConfigError(missing: readonly string[]): void {
  const el = document.getElementById("app")!;
  el.innerHTML = `
    <div class="app">
      <section class="card wide" style="border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08);">
        <div class="title">stack-auth: SolidJS (TS) config error</div>
        <div class="sub">Missing required environment variables. Update <code>apps/solid-ts/.env</code> and restart dev server.</div>
        <div class="panel" style="margin-top:14px;">
          <div class="panelTitle">Missing</div>
          <ul style="margin:8px 0 0;padding-left:18px;">
            ${missing.map((m) => `<li><code>${m}</code></li>`).join("")}
          </ul>
        </div>
        <div class="panel">
          <div class="panelTitle">Current values (masked)</div>
          <pre>${JSON.stringify(
            {
              VITE_AUTH0_DOMAIN: env("VITE_AUTH0_DOMAIN") || "(empty)",
              VITE_AUTH0_CLIENT_ID: env("VITE_AUTH0_CLIENT_ID") ? mask(env("VITE_AUTH0_CLIENT_ID")) : "(empty)",
              VITE_AUTH0_REDIRECT_URI: env("VITE_AUTH0_REDIRECT_URI") || "(empty)",
              VITE_AUTH0_LOGOUT_URI: env("VITE_AUTH0_LOGOUT_URI") || "(empty)"
            },
            null,
            2
          )}</pre>
        </div>
        <div class="small" style="margin-top:12px;">
          Also confirm Auth0 dashboard allows:
          <ul style="margin:6px 0 0;padding-left:18px;">
            <li>Callback: <code>http://localhost:5185/callback</code></li>
            <li>Web origin: <code>http://localhost:5185</code></li>
            <li>Logout: <code>http://localhost:5185/</code></li>
          </ul>
        </div>
      </section>
    </div>
  `;
}

function renderInitError(msg: string): void {
  const el = document.getElementById("app")!;
  el.innerHTML = `
    <div class="app">
      <section class="card" style="border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.08);">
        <div class="title">stack-auth: SolidJS (TS) init error</div>
        <div class="sub">Auth initialization failed (usually URL mismatch or blocked cookies/storage).</div>
        <div class="panel" style="margin-top:14px;">
          <div class="panelTitle">Error</div>
          <pre>${msg}</pre>
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

  try {
    await auth.init();
  } catch (e) {
    renderInitError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    return;
  }

  const url = new URL(window.location.href);
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") ?? "";
  const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");

  if (err) {
    sessionStorage.setItem(
      "stackauth_notice",
      err === "access_denied" ? "Login cancelled." : `${err}${desc ? ": " + desc : ""}`
    );
    window.history.replaceState({}, "", "/");
    navigate("/");
  }

  if (hasAuthParams) {
    try {
      await auth.handleRedirectCallback();
      window.history.replaceState({}, "", "/home");
      navigate("/home");
    } catch (e) {
      sessionStorage.setItem(
        "stackauth_notice",
        e instanceof Error ? `${e.name}: ${e.message}` : String(e)
      );
      window.history.replaceState({}, "", "/");
      navigate("/");
    }
  }

  if (window.location.pathname === "/callback" && !err && !hasAuthParams) {
    window.history.replaceState({}, "", "/");
    navigate("/");
  }

  render(() => <App />, document.getElementById("app")!);
})();
