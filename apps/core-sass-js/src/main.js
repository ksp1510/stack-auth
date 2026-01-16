import "./style.scss";
import { auth, logoutUri } from "./auth";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c] ?? c));
}

function env(key) {
  return (import.meta.env[key] ?? "");
}

const required = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_LOGOUT_URI"
];

function baseCard(title, subtitle) {
  return `
    <section class="card">
      <header class="head">
        <div>
          <div class="title">${escapeHtml(title)}</div>
          <div class="sub">${escapeHtml(subtitle)}</div>
        </div>
        <a class="ghost" href="http://localhost:3000/">Landing</a>
      </header>
      <div id="content"></div>
    </section>
  `;
}

function renderConfigError(missing) {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = `
    <section class="card wide err">
      <div class="h1">stack-auth: Core Sass JS config error</div>
      <div class="sub">Missing required environment variables. Add <code>.env</code> in <code>apps/core-sass-js</code> and restart.</div>
      <div class="panel">
        <div class="k" style="font-weight:800;opacity:1">Missing</div>
        <ul style="margin:8px 0 0;padding-left:18px;">
          ${missing.map(m => `<li><code>${escapeHtml(m)}</code></li>`).join("")}
        </ul>
      </div>
      <div class="small" style="margin-top:10px">
        Also confirm Auth0 allows:
        <ul style="margin:6px 0 0;padding-left:18px;">
          <li>Callback: <code>http://localhost:5176/callback</code></li>
          <li>Web origin: <code>http://localhost:5176</code></li>
          <li>Logout: <code>http://localhost:5176/</code></li>
        </ul>
      </div>
    </section>
  `;
}

function renderInitError(message) {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = `
    <section class="card wide warn">
      <div class="h1">stack-auth: Core Sass JS init error</div>
      <div class="sub">Auth initialization failed (often URL mismatch or blocked cookies/storage).</div>
      <div class="panel">
        <div class="k" style="font-weight:800;opacity:1">Error</div>
        <pre>${escapeHtml(message)}</pre>
      </div>
      <div class="small" style="margin-top:10px">
        Check Allowed Callback / Web Origins / Logout URLs in Auth0 and restart after editing <code>.env</code>.
      </div>
    </section>
  `;
}

function notice() {
  const n = sessionStorage.getItem("stackauth_notice");
  if (!n) return "";
  sessionStorage.removeItem("stackauth_notice");
  return `<div class="status"><span>${escapeHtml(n)}</span></div>`;
}

// --- tiny router ---
function path() {
  const p = window.location.pathname;
  return (p === "/" || p === "/callback" || p === "/home") ? p : "/";
}
function navigate(to) {
  history.pushState({}, "", to);
  render();
}
window.addEventListener("popstate", render);

// --- views ---
function renderLogin() {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = baseCard("Core (HTML + Sass + JS)", "Auth0 Universal Login · Google · No backend");

  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="actions">
      <button id="btnLogin" class="btn primary" type="button">Login</button>
      <button id="btnSignup" class="btn" type="button">Sign up</button>
    </div>

    <div class="divider"><span>or</span></div>

    <button id="btnGoogle" class="btn google" type="button">Continue with Google</button>

    ${notice()}

    <p class="small" style="margin-top:12px;">
      Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
    </p>
  `;

  document.getElementById("btnLogin").addEventListener("click", () => auth.login({ appState: { target: "/home" } }));
  document.getElementById("btnSignup").addEventListener("click", () => auth.signup({ appState: { target: "/home" } }));
  document.getElementById("btnGoogle").addEventListener("click", () => auth.login({ appState: { target: "/home" } }));
}

async function renderCallback() {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = baseCard("Signing you in…", "Handling Auth0 callback");
  const content = document.getElementById("content");
  content.innerHTML = `<div class="small">Please wait…</div>`;

  try {
    await auth.handleRedirectCallback();
    navigate("/home");
  } catch (e) {
    renderInitError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
  }
}

async function renderHome() {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = baseCard("Home", "Core Sass JS · Authenticated", `<button id="btnLogout" class="btn" type="button">Logout</button>`, "md");
  const content = document.getElementById("content");

  const isAuthed = await auth.isAuthenticated();
  if (!isAuthed) {
    navigate("/");
    return;
  }

  const user = await auth.getUser();

  content.innerHTML = `
    <div class="grid2">
      <div class="box">
        <div class="k">Authenticated</div>
        <div class="v">Yes</div>
      </div>
      <div class="box">
        <div class="k">User</div>
        <div class="v">${escapeHtml(user?.name || user?.email || "—")}</div>
      </div>
    </div>

    <div class="panel">
      <div class="k" style="font-weight:800;opacity:1">Profile JSON</div>
      <pre>${escapeHtml(JSON.stringify(user ?? {}, null, 2))}</pre>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
      <a class="link" href="http://localhost:3000/">Back to landing</a>
    </div>
  `;

  document.getElementById("btnLogout").addEventListener("click", () => auth.logout(logoutUri));
}

function renderLoading() {
  const root = document.querySelector("#app");
  if (!root) return;
  root.innerHTML = `
    <section class="card">
      <div class="h1">Core (HTML + Sass + JS)</div>
      <div class="sub">Initializing auth…</div>
      <p class="small">If this stays forever, check DevTools Console.</p>
    </section>
  `;
}

async function render() {
  const missing = required.filter((k) => !env(k));
  if (missing.length) {
    renderConfigError(missing);
    return;
  }

  renderLoading();

  const url = new URL(window.location.href);
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") ?? "";
  const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");

  // 1️⃣ Handle cancel / error FIRST
  if (err) {
    sessionStorage.setItem(
      "stackauth_notice",
      err === "access_denied"
        ? "Login cancelled."
        : `${err}${desc ? ": " + desc : ""}`
    );
    history.replaceState({}, "", "/");
  }

  try {
    // 2️⃣ Init AFTER cleanup
    await auth.init();

    // 3️⃣ Handle redirect callback AFTER init
    if (hasAuthParams) {
      await auth.handleRedirectCallback();
      history.replaceState({}, "", "/home");
    }

  } catch (e) {
    renderInitError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    return;
  }

  // 4️⃣ Normal routing
  const r = path();
  if (r === "/") renderLogin();
  else if (r === "/callback") await renderCallback();
  else if (r === "/home") await renderHome();
}


render();
