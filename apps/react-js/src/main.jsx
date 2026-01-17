/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./auth";
import App from "./App";
import "./index.css";

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI"
];

function env(key) {
  return import.meta.env[key] ?? "";
}

function mask(v) {
  if (!v) return "(empty)";
  if (v.length <= 8) return "********";
  return `${v.slice(0, 4)}…${v.slice(-4)}`;
}

function ConfigError() {
  const missing = required.filter((k) => !env(k));
  return (
    <div className="card" style={{ width: "min(760px, 92vw)", borderColor: "rgba(239,68,68,.35)", background: "rgba(239,68,68,.08)" }}>
      <div className="title">stack-auth: React JS config error</div>
      <div className="sub">Missing required environment variables. Update <code>apps/react-js/.env</code> and restart.</div>

      <div className="panel">
        <div className="panelTitle">Missing</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {missing.map((m) => <li key={m}><code>{m}</code></li>)}
        </ul>
      </div>

      <div className="panel">
        <div className="panelTitle">Current values (masked)</div>
        <pre>{JSON.stringify({
          VITE_AUTH0_DOMAIN: env("VITE_AUTH0_DOMAIN") || "(empty)",
          VITE_AUTH0_CLIENT_ID: env("VITE_AUTH0_CLIENT_ID") ? mask(env("VITE_AUTH0_CLIENT_ID")) : "(empty)",
          VITE_AUTH0_REDIRECT_URI: env("VITE_AUTH0_REDIRECT_URI") || "(empty)",
          VITE_AUTH0_LOGOUT_URI: env("VITE_AUTH0_LOGOUT_URI") || "(empty)"
        }, null, 2)}</pre>
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        Ensure Auth0 allows:
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          <li>Callback: <code>http://localhost:5177/callback</code></li>
          <li>Web origin: <code>http://localhost:5177</code></li>
          <li>Logout: <code>http://localhost:5177/</code></li>
        </ul>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error instanceof Error
        ? `${this.state.error.name}: ${this.state.error.message}`
        : String(this.state.error);

      return (
        <div className="card" style={{ width: "min(760px, 92vw)", borderColor: "rgba(245,158,11,.35)", background: "rgba(245,158,11,.10)" }}>
          <div className="title">stack-auth: React JS init error</div>
          <div className="sub">App crashed during initialization (often Auth0 URL mismatch or blocked storage).</div>
          <div className="panel">
            <div className="panelTitle">Error</div>
            <pre>{msg}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById("root");
const missing = required.filter((k) => !env(k));

(async () => {
  if (missing.length) {
    ReactDOM.createRoot(rootEl).render(<ConfigError />);
    return;
  }

  await auth.init();

  const url = new URL(window.location.href);
  const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") ?? "";

  if (err) {
    sessionStorage.setItem("stackauth_notice", err === "access_denied" ? "Login cancelled." : `${err}${desc ? `: ${desc}` : ""}`);
    window.history.replaceState({}, "", "/");
  }

  if (hasAuthParams) {
    await auth.handleRedirectCallback();
    window.history.replaceState({}, "", "/home");
  }

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="app">
            <App />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
})();
