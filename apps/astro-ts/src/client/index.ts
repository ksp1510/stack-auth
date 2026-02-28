import { auth, logoutUri, initAuthOnce } from "../auth";

const noticeEl = document.getElementById("notice");
const loginBtn = document.getElementById("login") as HTMLButtonElement | null;
const logoutBtn = document.getElementById("logout") as HTMLButtonElement | null;

const notice = sessionStorage.getItem("stackauth_notice");
if (notice && noticeEl) {
  noticeEl.textContent = notice;
  sessionStorage.removeItem("stackauth_notice");
}

loginBtn?.addEventListener("click", async () => {
  await initAuthOnce();
  await auth.login();
});

logoutBtn?.addEventListener("click", async () => {
  await initAuthOnce();
  auth.logout(logoutUri);
});