import { auth, logoutUri, initAuthOnce } from "../auth.js";

const loadingEl = document.getElementById("loading");
const contentEl = document.getElementById("content");
const userLabelEl = document.getElementById("userLabel");
const profileJsonEl = document.getElementById("profileJson");
const logoutBtn = document.getElementById("logout");

function setLoading(loading) {
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
    userLabelEl.textContent = (user && (user.name || user.email)) ? (user.name || user.email) : "—";
  }
  if (profileJsonEl) {
    profileJsonEl.textContent = JSON.stringify(user || {}, null, 2);
  }

  setLoading(false);
})().catch(() => {
  // If anything goes wrong, just kick back to login like the Svelte router does
  window.location.replace("/");
});

logoutBtn?.addEventListener("click", async () => {
  await initAuthOnce();
  auth.logout(logoutUri);
});