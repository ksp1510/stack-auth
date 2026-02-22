import { onMount, createSignal } from "solid-js";
import { auth, logoutUri } from "../auth";
import { navigate } from "../router";

export default function Home() {
  const [loading, setLoading] = createSignal(true);
  const [authed, setAuthed] = createSignal(false);
  const [user, setUser] = createSignal(null);

  onMount(async () => {
    try {
      const ok = await auth.isAuthenticated();
      setAuthed(ok);
      if (!ok) {
        navigate("/");
        return;
      }
      setUser((await auth.getUser()) ?? null);
    } finally {
      setLoading(false);
    }
  });

  return (
    <section class="card wide">
      <header class="head">
        <div>
          <div class="title">Home</div>
          <div class="sub">SolidJS (JS) · Authenticated area</div>
        </div>
        <button class="btn" type="button" onClick={() => auth.logout(logoutUri)}>
          Logout
        </button>
      </header>

      {loading() ? (
        <div class="small">Loading…</div>
      ) : (
        <>
          <div class="grid">
            <div class="box">
              <div class="k">Authenticated</div>
              <div class="v">{authed() ? "Yes" : "No"}</div>
            </div>
            <div class="box">
              <div class="k">User</div>
              <div class="v">{user()?.name || user()?.email || "—"}</div>
            </div>
          </div>

          <div class="panel">
            <div class="panelTitle">Profile JSON</div>
            <pre>{JSON.stringify(user() ?? {}, null, 2)}</pre>
          </div>

          <a class="link" href="http://localhost:3000/">Back to landing</a>
        </>
      )}
    </section>
  );
}
