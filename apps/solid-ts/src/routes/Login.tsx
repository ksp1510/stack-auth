import { onMount, createSignal } from "solid-js";
import { auth } from "../auth";

export default function Login() {
  const [notice, setNotice] = createSignal("");

  onMount(() => {
    const msg = sessionStorage.getItem("stackauth_notice");
    if (msg) {
      setNotice(msg);
      sessionStorage.removeItem("stackauth_notice");
    }
  });

  const target = { appState: { target: "/home" } };

  return (
    <section class="card">
      <header class="head">
        <div>
          <div class="title">SolidJS (TS)</div>
          <div class="sub">Auth0 Universal Login · Google · No backend</div>
        </div>
        <a class="ghost" href="http://localhost:3000/">Landing</a>
      </header>

      <div class="actions">
        <button class="btn primary" type="button" onClick={() => auth.login(target)}>
          Login
        </button>
        <button class="btn" type="button" onClick={() => auth.signup(target)}>
          Sign up
        </button>
      </div>

      <div class="divider"><span>or</span></div>

      <button class="btn google" type="button" onClick={() => auth.login(target)}>
        Continue with Google
      </button>

      {notice() ? (
        <div class="status warn" style="margin-top:14px;">
          <span>{notice()}</span>
        </div>
      ) : null}

      <p class="hint">
        Email/Password and Google are both enabled in Auth0. If Google isn't configured, the button will still work but may fall back to the default login.
      </p>
    </section>
  );
}
