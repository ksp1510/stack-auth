import "@stack-auth/ui-tokens/src/tokens.css";
import { AuthService } from "@stack-auth/auth-spa";

const env = import.meta.env;

const auth = new AuthService({
  domain: env.VITE_AUTH0_DOMAIN,
  clientId: env.VITE_AUTH0_CLIENT_ID,
  redirectUri: env.VITE_AUTH0_REDIRECT_URI,
  audience: env.VITE_AUTH0_AUDIENCE
});

const app = document.querySelector<HTMLDivElement>("#app")!;

function link(href: string, label: string) {
  return `<a href="${href}" style="text-decoration:none" class="btn">${label}</a>`;
}

function renderShell(inner: string) {
  app.innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;">
        <div>
          <div style="font-weight:900;font-size:20px;">Core TS</div>
          <div class="small">Vanilla TS + Auth0 Universal Login</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${link("http://localhost:3000/", "Back to Landing")}
          ${link("/", "Login")}
          ${link("/home", "Home")}
        </div>
      </div>

      <div class="card" style="padding:16px;">${inner}</div>
    </div>
  `;
}

function renderLoginPage() {
  renderShell(`
    <h2 style="margin:0 0 10px 0;">Login / Sign Up</h2>
    <div class="small" style="margin-bottom:14px;">Email/username + password and Google are handled by Auth0 Universal Login.</div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn primary" id="btnLogin">Login</button>
      <button class="btn" id="btnSignup">Create account</button>
    </div>

    <div class="small" style="margin-top:14px;">
      Tip: You can control providers (Google) and database login (email/password) from Auth0, not here.
    </div>
  `);

  document.getElementById("btnLogin")!.addEventListener("click", () => auth.login({ appState: { target: "/home" } }));
  document.getElementById("btnSignup")!.addEventListener("click", () => auth.signup({ appState: { target: "/home" } }));
}

async function renderHomePage() {
  const isAuthed = await auth.isAuthenticated();
  if (!isAuthed) {
    renderShell(`
      <h2 style="margin:0 0 10px 0;">Not logged in</h2>
      <div class="small" style="margin-bottom:14px;">You need to login first.</div>
      <button class="btn primary" id="goLogin">Go to Login</button>
    `);
    document.getElementById("goLogin")!.addEventListener("click", () => (window.location.href = "/"));
    return;
  }

  const user = await auth.getUser();
  let token = "";
  try {
    token = await auth.getAccessToken();
  } catch {
    token = "(No access token - add an API audience later if you need one)";
  }

  renderShell(`
    <div style="display:flex;gap:14px;align-items:center;">
      <img src="${user?.picture ?? ""}" alt="" style="width:52px;height:52px;border-radius:999px;border:1px solid var(--border);object-fit:cover;" />
      <div>
        <div style="font-weight:800;">${user?.name ?? "User"}</div>
        <div class="small">${user?.email ?? ""}</div>
      </div>
    </div>

    <hr style="margin:16px 0;border:none;border-top:1px solid var(--border);" />

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn" id="btnLogout">Logout</button>
    </div>

    <div class="small" style="margin-top:16px;">Access token preview (first 80 chars):</div>
    <pre style="white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,0.22);padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-top:8px;">${(token ?? "").slice(0, 80)}...</pre>
  `);

  document.getElementById("btnLogout")!.addEventListener("click", () => auth.logout(env.VITE_AUTH0_LOGOUT_URI));
}

async function handleCallback() {
  renderShell(`<div class="small">Completing login...</div>`);
  try {
    await auth.handleRedirectCallback();
  } finally {
    // Auth0 stores appState; we default to /home
    window.history.replaceState({}, "", "/home");
    await route();
  }
}

async function route() {
  const path = window.location.pathname;
  if (path === "/callback") {
    await handleCallback();
    return;
  }
  if (path === "/home") {
    await renderHomePage();
    return;
  }
  renderLoginPage();
}

(async () => {
  await auth.init();
  await route();

  // Minimal SPA navigation for our internal links
  window.addEventListener("popstate", () => void route());
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("/")) return;
    e.preventDefault();
    window.history.pushState({}, "", href);
    void route();
  });
})();
