import { auth, logoutUri, initAuthOnce } from "../auth";

const loadingEl = document.getElementById("loading") as HTMLElement | null;
const contentEl = document.getElementById("content") as HTMLElement | null;
const userLabelEl = document.getElementById("userLabel") as HTMLElement | null;
const profileJsonEl = document.getElementById("profileJson") as HTMLElement | null;
const logoutBtn = document.getElementById("logout") as HTMLButtonElement | null;

function setLoading(loading: boolean) {
  if (loadingEl) loadingEl.hidden = !loading;
  if (contentEl) contentEl.hidden = loading;
}

(async () => {
  setLoading(true);
  await initAuthOnce();

  const authed = await auth.isAuthenticated();
  if (!authed) {
    window.location.replace("/");
    return;
  }

  const user = await auth.getUser();

  if (userLabelEl) {
    userLabelEl.textContent = (user && (user.name || user.email)) ? (user.name || user.email) as string : "—";
  }
  if (profileJsonEl) {
    profileJsonEl.textContent = JSON.stringify(user || {}, null, 2);
  }

  setLoading(false);
})().catch(() => {
  window.location.replace("/");
});

logoutBtn?.addEventListener("click", async () => {
  await initAuthOnce();
  auth.logout(logoutUri);
});
