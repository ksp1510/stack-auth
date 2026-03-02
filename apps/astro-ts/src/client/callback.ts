import { auth, initAuthOnce } from "../auth";

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
  window.location.replace("/home");
})();