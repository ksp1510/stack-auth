import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { auth, logoutUri } from "../auth";

type User = {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: unknown;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const name = useMemo(() => user?.name || user?.email || "", [user]);

  useEffect(() => {
    (async () => {
      try {
        const isAuthed = await auth.isAuthenticated();
        setAuthed(isAuthed);

        if (isAuthed) {
          const u = (await auth.getUser()) as User | undefined;
          setUser(u ?? null);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="sub">Loading…</div>;

  if (!authed) {
    return (
      <div>
        <div className="title h1">Not logged in</div>
        <div className="sub">You need to login first.</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn primary" to="/">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="headRow">
        <div>
          <div className="title h1">Home</div>
          <div className="sub">React (TS) · Authenticated area</div>
        </div>
        <button className="btn" type="button" onClick={() => auth.logout(logoutUri)}>
          Logout
        </button>
      </header>

      <div className="grid">
        <div className="box">
          <div className="k">Authenticated</div>
          <div className="v">Yes</div>
        </div>
        <div className="box">
          <div className="k">User</div>
          <div className="v">{name || "—"}</div>
        </div>
      </div>

      <div className="json">
        <div className="k">Profile JSON</div>
        <pre>{JSON.stringify(user ?? {}, null, 2)}</pre>
      </div>

      <a className="a" href="http://localhost:3000/">Back to landing</a>
    </div>
  );
}
