import "./style.css";
import { auth, logoutUri } from "./auth";

type ErrLike = unknown;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return c;
    }
  });
}

function env(key: string) {
  return (import.meta.env[key] as string | undefined) ?? "";
}

function mask(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

function renderConfigError(missing: string[]) {
  const domain = env("VITE_AUTH0_DOMAIN");
  const clientId = env("VITE_AUTH0_CLIENT_ID");
  const redirectUri = env("VITE_AUTH0_REDIRECT_URI");
  const lout = env("VITE_AUTH0_LOGOUT_URI");

  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.innerHTML = `
    <div class="card error">
      <h2>stack-auth: Core TS config error</h2>
      <p>Missing required environment variables. Create <code>.env</code> in <code>apps/core-ts</code> and restart dev server.</p>

      <div class="panel">
        <div class="panelTitle">Missing</div>
        <ul>${missing.map(m => `<li><code>${escapeHtml(m)}</code></li>`).join("")}</ul>
      </div>

      <div class="panel">
        <div class="panelTitle">Current values (masked)</div>
        <pre>${escapeHtml(JSON.stringify({
          VITE_AUTH0_DOMAIN: domain || "(empty)",
          VITE_AUTH0_CLIENT_ID: clientId ? mask(clientId) : "(empty)",
          VITE_AUTH0_REDIRECT_URI: redirectUri || "(empty)",
          VITE_AUTH0_LOGOUT_URI: lout || "(empty)"
        }, null, 2))}</pre>
      </div>

      <p class="small">
        Auth0 must allow callback <code>http://localhost:5173/callback</code> and origin <code>http://localhost:5173</code>.
      </p>
    </div>
  `;
}

function renderInitError(err: ErrLike) {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);

  root.innerHTML = `
    <div class="card warn">
      <h2>stack-auth: Core TS init error</h2>
      <p>Auth initialization failed (usually URL mismatch or blocked cookies/storage).</p>
      <div class="panel">
        <div class="panelTitle">Error</div>
        <pre>${escapeHtml(message)}</pre>
      </div>
      <p class="small">Check Auth0 Allowed Callback URLs / Web Origins / Logout URLs and restart after editing <code>.env</code>.</p>
    </div>
  `;
}

// --- tiny router (no deps) ---
type Route = "/" | "/callback" | "/home";

function path(): Route {
  const p = window.location.pathname as Route;
  if (p === "/callback" || p === "/home" || p === "/") return p;
  return "/";
}

function navigate(to: Route) {
  history.pushState({}, "", to);
  render();
}

window.addEventListener("popstate", render);

// --- views ---
function baseCard(title: string, subtitle: string, rightHtml = `<a class="btn" href="http://localhost:3000/">Landing</a>`, size: "sm" | "md" = "sm") {
  return `
    <section class="card ${size}">
      <header class="headRow">
        <div>
          <div class="title ${size === "md" ? "h1" : ""}">${escapeHtml(title)}</div>
          <div class="sub">${escapeHtml(subtitle)}</div>
        </div>
        ${rightHtml}
      </header>
      <div id="content"></div>
    </section>
  `;
}

function renderLogin() {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.innerHTML = baseCard("Angular (TS)", "Auth0 Universal Login · Google · No backend", `<a class="btn" href="http://localhost:3000/">Landing</a>`, "sm");

  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="actions">
      <button id="btnLogin" class="btn primary" type="button">Login</button>
      <button id="btnSignup" class="btn" type="button">Sign up</button>
    </div>

    <div class="divider"><span>or</span></div>

    <button id="btnGoogle" class="btn google" type="button">Continue with Google</button>

    <p class="hint">
      Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
    </p>
  `;

  const notice = consumeNotice();
  if (notice) {
    const div = document.createElement("div");
    div.className = "status";
    div.innerHTML = `<span>${escapeHtml(notice)}</span>`;
    content.appendChild(div);
  }


  const btnLogin = content.querySelector<HTMLButtonElement>("#btnLogin");
  const btnSignup = content.querySelector<HTMLButtonElement>("#btnSignup");
  const btnGoogle = content.querySelector<HTMLButtonElement>("#btnGoogle");

  if (!btnLogin || !btnSignup || !btnGoogle) {
    renderInitError(new Error("UI render failed: login buttons not found in DOM."));
    return;
  }

  const target = { appState: { target: "/home" } } as any;

  btnLogin.addEventListener("click", () => auth.login(target));
  btnGoogle.addEventListener("click", () => auth.login(target));
  btnSignup.addEventListener("click", () => auth.signup(target));
}


async function renderCallback() {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.innerHTML = `
    <section class="card sm">
      <div class="title h1">Signing you in…</div>
      <div class="sub">Handling Auth0 callback</div>
      <div id="content"></div>
    </section>
  `;

  const content = document.getElementById("content")!;
  content.innerHTML = `<div class="small">Please wait…</div>`;

  try {
    await auth.handleRedirectCallback();
    history.replaceState({}, "", "/home");
    await renderHome();
  } catch (err) {
    renderInitError(err);
  }
}

async function renderHome() {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.innerHTML = baseCard(
    "Home",
    "Core (HTML + TS) · Authenticated area",
    `<button id="btnLogout" class="btn" type="button">Logout</button>`,
    "md"
  );

  const content = document.getElementById("content")!;

  const isAuth = await auth.isAuthenticated();
  if (!isAuth) {
    history.replaceState({}, "", "/");
    await renderLogin();
    return;
  }

  const user = await auth.getUser();

  content.innerHTML = `
    <div class="grid">
      <div class="box">
        <div class="k">Authenticated</div>
        <div class="v">Yes</div>
      </div>
      <div class="box">
        <div class="k">User</div>
        <div class="v">${escapeHtml(String(user?.name || user?.email || "—"))}</div>
      </div>
    </div>

    <div class="json">
      <div class="k">Profile JSON</div>
      <pre>${escapeHtml(JSON.stringify(user ?? {}, null, 2))}</pre>
    </div>

    <a class="a" href="http://localhost:3000/">Back to landing</a>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", () => auth.logout(logoutUri));

}

async function render() {
  const missing = [
    "VITE_AUTH0_DOMAIN",
    "VITE_AUTH0_CLIENT_ID",
    "VITE_AUTH0_REDIRECT_URI",
    "VITE_AUTH0_LOGOUT_URI"
  ].filter((k) => !env(k));

  if (missing.length) {
    renderConfigError(missing);
    return;
  }

  try {
    // Must initialize once before any auth calls.
    // Safe to call repeatedly in dev reloads? We keep it simple: only init if needed.
    await auth.init();

    // If Auth0 sends us back to "/" with ?code&state, handle it here.
    const url = new URL(window.location.href);
    const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");
    const hasAuthError = url.searchParams.has("error");

    if (hasAuthError) {
      const err = url.searchParams.get("error") ?? "";
      const desc = url.searchParams.get("error_description") ?? "";

      // User canceled / closed login
      if (err === "access_denied") {
        setNotice("Login cancelled.");
        history.replaceState({}, "", "/");
        renderLogin();
        return;
      }

      renderInitError(new Error(`${err}: ${desc}`));
      return;
    }

    if (hasAuthParams) {
      try {
        await auth.handleRedirectCallback();
        history.replaceState({}, "", "/home");
      } catch (err) {
        renderInitError(err);
        return;
      }
    }
  } catch (err) {
    renderInitError(err);
    return;
  }

  const r = path();
  if (r === "/") renderLogin();
  else if (r === "/callback") await renderCallback();
  else if (r === "/home") await renderHome();
}

function setNotice(msg: string) {
  sessionStorage.setItem("stackauth_notice", msg);
}

function consumeNotice(): string | null {
  const v = sessionStorage.getItem("stackauth_notice");
  if (v) sessionStorage.removeItem("stackauth_notice");
  return v;
}


render();
