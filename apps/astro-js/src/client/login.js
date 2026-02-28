import { auth, initAuthOnce } from "../auth.js";

const target = { appState: { target: "/home" } };

const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const googleBtn = document.getElementById("google");

const noticeWrap = document.getElementById("noticeWrap");
const noticeEl = document.getElementById("notice");

function showNotice(msg) {
  if (!noticeWrap || !noticeEl) return;
  if (!msg) {
    noticeWrap.hidden = true;
    noticeEl.textContent = "";
    return;
  }
  noticeWrap.hidden = false;
  noticeEl.textContent = msg;
}

function setBusy(busy) {
  if (loginBtn) loginBtn.disabled = busy;
  if (signupBtn) signupBtn.disabled = busy;
  if (googleBtn) googleBtn.disabled = busy;
}

(async () => {
  const msg = sessionStorage.getItem("stackauth_notice");
  if (msg) {
    showNotice(msg);
    sessionStorage.removeItem("stackauth_notice");
  } else {
    showNotice("");
  }

  await initAuthOnce();

  // If already authed, go straight to home
  const authed = await auth.isAuthenticated();
  if (authed) window.location.replace("/home");
})().catch((e) => showNotice(e?.message ? String(e.message) : String(e)));

loginBtn?.addEventListener("click", async () => {
  try {
    setBusy(true);
    await initAuthOnce();
    await auth.login(target);
  } finally {
    setBusy(false);
  }
});

signupBtn?.addEventListener("click", async () => {
  try {
    setBusy(true);
    await initAuthOnce();
    await auth.signup(target);
  } finally {
    setBusy(false);
  }
});

// Same as Svelte/Vue: Google uses Universal Login
googleBtn?.addEventListener("click", async () => {
  try {
    setBusy(true);
    await initAuthOnce();
    await auth.login(target);
  } finally {
    setBusy(false);
  }
});