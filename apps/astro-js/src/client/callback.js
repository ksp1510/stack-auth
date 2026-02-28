import { auth, initAuthOnce } from "../auth.js";

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const desc = params.get("error_description");

(async () => {
  if (err) {
    sessionStorage.setItem(
      "stackauth_notice",
      err === "access_denied" ? "Login cancelled." : `${err}${desc ? ": " + desc : ""}`
    );
    window.location.replace("/");
    return;
  }

  await initAuthOnce();
  await auth.handleRedirectCallback();

  // Default to home after callback (same behavior as Svelte target "/home")
  window.location.replace("/home");
})();