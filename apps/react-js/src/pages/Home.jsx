import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, logoutUri } from "../auth";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const ok = await auth.isAuthenticated();
      setAuthed(ok);
      if (ok) setUser(await auth.getUser());
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="card">
        <div className="title">Home</div>
        <div className="sub">Loading…</div>
      </section>
    );
  }

  if (!authed) {
    return (
      <section className="card">
        <div className="title">Not logged in</div>
        <div className="sub">You need to login first.</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn primary" to="/">Go to Login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="card" style={{ width: "min(720px, 92vw)" }}>
      <header className="head">
        <div>
          <div className="title">Home</div>
          <div className="sub">React (JS) · Authenticated area</div>
        </div>
        <button className="btn" onClick={() => auth.logout(logoutUri)} type="button">Logout</button>
      </header>

      <div className="grid">
        <div className="box">
          <div className="k">Authenticated</div>
          <div className="v">Yes</div>
        </div>
        <div className="box">
          <div className="k">User</div>
          <div className="v">{String(user?.name || user?.email || "—")}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panelTitle">Profile JSON</div>
        <pre>{JSON.stringify(user ?? {}, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <a className="link" href="http://localhost:3000/">Back to landing</a>
      </div>
    </section>
  );
}
