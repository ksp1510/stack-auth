import "./style.css";
import { auth, logoutUri, initAuthOnce } from "./auth.js";


const root0 = document.querySelector("#app");
if (root0) root0.innerHTML = `<div style="padding:24px;color:#111">booting...</div>`;
console.log("[core-js] booting");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    c === "&" ? "&amp;" :
    c === "<" ? "&lt;" :
    c === ">" ? "&gt;" :
    c === '"' ? "&quot;" :
    c === "'" ? "&#039;" : c
  ));
}

function env(key) {
  return import.meta.env[key] ?? "";
}

function setNotice(msg) {
  sessionStorage.setItem("stackauth_notice", msg);
}
function consumeNotice() {
  const v = sessionStorage.getItem("stackauth_notice");
  if (v) sessionStorage.removeItem("stackauth_notice");
  return v;
}

function path() {
  const p = window.location.pathname;
  if (p === "/" || p === "/callback" || p === "/home") return p;
  return "/";
}

function baseCard(title, subtitle, rightHtml = `<a class="ghost" href="http://localhost:3000/">Landing</a>`, size = "sm") {
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
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = baseCard("Core (HTML + JS)", "Auth0 Universal Login · Google · No backend", `<a class="ghost" href="http://localhost:3000/">Landing</a>`, "sm");

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
    const n = document.createElement("div");
    n.className = "status";
    n.innerHTML = `<span>${escapeHtml(notice)}</span>`;
    content.insertBefore(n, content.querySelector(".hint"));
  }

  const target = { appState: { target: "/home" } };

  const btnLogin = content.querySelector("#btnLogin");
  const btnSignup = content.querySelector("#btnSignup");
  const btnGoogle = content.querySelector("#btnGoogle");

  if (!btnLogin || !btnSignup || !btnGoogle) return;

  btnLogin.addEventListener("click", () => auth.login(target));
  btnGoogle.addEventListener("click", () => auth.login(target));
  btnSignup.addEventListener("click", () => auth.signup(target));
}

async function renderCallback() {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = `
    <section class="card sm">
      <div class="title h1">Signing you in…</div>
      <div class="sub">Handling Auth0 callback</div>
      <div id="content"></div>
    </section>
  `;

  const content = document.getElementById("content");
  if (!content) return;

  // If Auth0 returns error params on /callback
  const url = new URL(window.location.href);
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") || "";

  if (err) {
    if (err === "access_denied") {
      setNotice("Login cancelled.");
      history.replaceState({}, "", "/");
      renderLogin();
      return;
    }

    content.innerHTML = `
      <div class="err">Error: ${escapeHtml(`${err}${desc ? ": " + desc : ""}`)}</div>
      <a class="a" href="/">Back to Login</a>
    `;
    return;
  }

  try {
    await auth.handleRedirectCallback();
    history.replaceState({}, "", "/home");
    await renderHome();
  } catch (e) {
    content.innerHTML = `
      <div class="err">Error: ${escapeHtml(e?.message || String(e))}</div>
      <a class="a" href="/">Back to Login</a>
    `;
  }
}

async function renderHome() {
  const root = document.querySelector("#app");
  if (!root) return;

  root.innerHTML = baseCard(
    "Home",
    "Core (HTML + JS) · Authenticated area",
    `<button id="btnLogout" class="btn" type="button">Logout</button>`,
    "md"
  );

  const content = document.getElementById("content");
  if (!content) return;

  const isAuth = await auth.isAuthenticated();
  if (!isAuth) {
    history.replaceState({}, "", "/");
    renderLogin();
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
        <div class="v">${escapeHtml(user?.name || user?.email || "—")}</div>
      </div>
    </div>

    <div class="json">
      <div class="k">Profile JSON</div>
      <pre>${escapeHtml(JSON.stringify(user || {}, null, 2))}</pre>
    </div>

    <a class="a" href="http://localhost:3000/">Back to landing</a>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", () => {
    auth.logout(logoutUri);
  });
}

async function render() {
  // env check
  const missing = ["VITE_AUTH0_DOMAIN","VITE_AUTH0_CLIENT_ID","VITE_AUTH0_REDIRECT_URI","VITE_AUTH0_LOGOUT_URI"]
    .filter((k) => !env(k));

  if (missing.length) {
    const root = document.querySelector("#app");
    if (!root) return;
    root.innerHTML = `
      <section class="card sm">
        <div class="title">stack-auth: Core JS config error</div>
        <div class="sub">Missing required env vars in apps/core-js/.env</div>
        <div class="err">Missing: ${escapeHtml(missing.join(", "))}</div>
        <a class="a" href="http://localhost:3000/">Back to landing</a>
      </section>
    `;
    return;
  }

  await initAuthOnce();

  // Handle cancel/error when Auth0 redirects back to "/" with error params
  const url = new URL(window.location.href);
  const err = url.searchParams.get("error");
  const desc = url.searchParams.get("error_description") || "";
  const hasAuthParams = url.searchParams.has("code") && url.searchParams.has("state");

  if (err) {
    if (err === "access_denied") setNotice("Login cancelled.");
    else setNotice(`${err}${desc ? ": " + desc : ""}`);

    history.replaceState({}, "", "/");
    renderLogin();
    return;
  }

  if (hasAuthParams) {
    try {
      await auth.handleRedirectCallback();
      history.replaceState({}, "", "/home");
      await renderHome();
      return;
    } catch (e) {
      setNotice("Login callback failed.");
      history.replaceState({}, "", "/");
      renderLogin();
      return;
    }
  }

  const r = path();
  if (r === "/") renderLogin();
  else if (r === "/callback") await renderCallback();
  else if (r === "/home") await renderHome();
}

window.addEventListener("popstate", () => { render(); });
render();
