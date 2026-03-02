import { auth, initAuthOnce } from "../auth";

const target = { appState: { target: "/home" } } as any;

const loginBtn = document.getElementById("login") as HTMLButtonElement | null;
const signupBtn = document.getElementById("signup") as HTMLButtonElement | null;
const googleBtn = document.getElementById("google") as HTMLButtonElement | null;

const noticeWrap = document.getElementById("noticeWrap") as HTMLElement | null;
const noticeEl = document.getElementById("notice") as HTMLElement | null;

function showNotice(msg: string) {
  if (!noticeWrap || !noticeEl) return;
  if (!msg) {
    noticeWrap.hidden = true;
    noticeEl.textContent = "";
    return;
  }
  noticeWrap.hidden = false;
  noticeEl.textContent = msg;
}

function setBusy(busy: boolean) {
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

  const authed = await auth.isAuthenticated();
  if (authed) window.location.replace("/home");
})().catch((e: unknown) => showNotice(e instanceof Error ? e.message : String(e)));

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

googleBtn?.addEventListener("click", async () => {
  try {
    setBusy(true);
    await initAuthOnce();
    await auth.login(target);
  } finally {
    setBusy(false);
  }
});
