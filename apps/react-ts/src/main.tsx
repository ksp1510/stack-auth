import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./auth";
import App from "./App";
import "./index.css";

function env(key: string) {
  return (import.meta.env[key] as string | undefined) ?? "";
}

function mask(value: string) {
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

function ConfigError() {
  const missing = required.filter((k) => !env(k));

  return (
    <div style={{
      maxWidth: 760,
      margin: "48px auto",
      padding: 20,
      border: "1px solid rgba(239,68,68,.35)",
      background: "rgba(239,68,68,.08)",
      borderRadius: 16,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      color: "#111827"
    }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>stack-auth: React TS config error</h2>
      <p style={{ margin: "0 0 12px", opacity: .9 }}>
        Missing required environment variables. Update <code>apps/react-ts/.env</code> and restart the dev server.
      </p>

      <div style={{ margin: "12px 0", padding: 12, background: "rgba(255,255,255,.65)", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Missing</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {missing.map(m => <li key={m}><code>{m}</code></li>)}
        </ul>
      </div>

      <div style={{ margin: "12px 0", padding: 12, background: "rgba(255,255,255,.65)", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Current values (masked)</div>
        <pre style={{ margin: 0, fontSize: 12, overflow: "auto" }}>
          {JSON.stringify({
            VITE_AUTH0_DOMAIN: env("VITE_AUTH0_DOMAIN") || "(empty)",
            VITE_AUTH0_CLIENT_ID: env("VITE_AUTH0_CLIENT_ID") ? mask(env("VITE_AUTH0_CLIENT_ID")) : "(empty)",
            VITE_AUTH0_REDIRECT_URI: env("VITE_AUTH0_REDIRECT_URI") || "(empty)",
            VITE_AUTH0_LOGOUT_URI: env("VITE_AUTH0_LOGOUT_URI") || "(empty)"
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: 10, fontSize: 13 }}>
        Also confirm Auth0 dashboard allows:
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          <li>Callback: <code>http://localhost:5174/callback</code></li>
          <li>Web origin: <code>http://localhost:5174</code></li>
          <li>Logout: <code>http://localhost:5174/</code></li>
        </ul>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: unknown }
> {
  state: { error?: unknown } = {};

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const message = this.state.error instanceof Error
        ? `${this.state.error.name}: ${this.state.error.message}`
        : String(this.state.error);

      return (
        <div style={{
          maxWidth: 760,
          margin: "48px auto",
          padding: 20,
          border: "1px solid rgba(245,158,11,.35)",
          background: "rgba(245,158,11,.08)",
          borderRadius: 16,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          color: "#111827"
        }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>stack-auth: React TS init error</h2>
          <p style={{ margin: "0 0 12px", opacity: .9 }}>
            App crashed during initialization (often Auth0 URL mismatch or blocked storage).
          </p>
          <div style={{ padding: 12, background: "rgba(255,255,255,.65)", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <pre style={{ margin: 0, fontSize: 12, overflow: "auto" }}>{message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const missing = required.filter((k) => !env(k));
const rootEl = document.getElementById("root")!;

(async () => {
  if (missing.length) {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <ConfigError />
      </React.StrictMode>
    );
    return;
  }

  try {
    await auth.init();

    const url = new URL(window.location.href);
    const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");

    const err = url.searchParams.get("error");
    const desc = url.searchParams.get("error_description") ?? "";

    if (err) {
      if (err === "access_denied") {
        sessionStorage.setItem("stackauth_notice", "Login cancelled.");
        window.history.replaceState({}, "", "/");
      } else {
        // keep URL so ErrorBoundary / Callback can show details if needed
        // or strip it and store message:
        sessionStorage.setItem("stackauth_notice", `${err}: ${desc}`);
        window.history.replaceState({}, "", "/");
      }
    }

    if (hasAuthParams) {
      try {
        await auth.handleRedirectCallback();
        // Send user to /home and remove query params
        window.history.replaceState({}, "", "/home");
      } catch (e) {
        // Let the app render; ErrorBoundary will show it
        // eslint-disable-next-line no-console
        console.error("handleRedirectCallback failed", e);
      }
    }

  } catch (e) {
    // Reuse ErrorBoundary UI shape but render a direct init error
    const msg =
      e instanceof Error ? `${e.name}: ${e.message}` : String(e);

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <div style={{
          maxWidth: 760,
          margin: "48px auto",
          padding: 20,
          border: "1px solid rgba(245,158,11,.35)",
          background: "rgba(245,158,11,.08)",
          borderRadius: 16,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          color: "#111827"
        }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>stack-auth: React TS init error</h2>
          <p style={{ margin: "0 0 12px", opacity: .9 }}>Auth initialization failed.</p>
          <div style={{ padding: 12, background: "rgba(255,255,255,.65)", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <pre style={{ margin: 0, fontSize: 12, overflow: "auto" }}>{msg}</pre>
          </div>
        </div>
      </React.StrictMode>
    );
    return;
  }

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
})();

