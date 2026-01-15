import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, logoutUri } from "../auth";

type User = {
  name?: string;
  email?: string;
  picture?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tokenPreview, setTokenPreview] = useState("");

  useEffect(() => {
    (async () => {
      const isAuthed = await auth.isAuthenticated();
      setAuthed(isAuthed);
      if (isAuthed) {
        const u = (await auth.getUser()) as User | undefined;
        setUser(u ?? null);
        try {
          const token = await auth.getAccessToken();
          setTokenPreview((token ?? "").slice(0, 80));
        } catch {
          setTokenPreview("(No access token - add an API audience later if you need one)");
        }
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="small">Loading...</div>;

  if (!authed) {
    return (
      <div>
        <h2 style={{ margin: "0 0 10px 0" }}>Not logged in</h2>
        <div className="small" style={{ marginBottom: 14 }}>You need to login first.</div>
        <Link className="btn primary" to="/">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <img
          src={user?.picture ?? ""}
          alt=""
          style={{ width: 52, height: 52, borderRadius: 999, border: "1px solid var(--border)", objectFit: "cover" }}
        />
        <div>
          <div style={{ fontWeight: 800 }}>{user?.name ?? "User"}</div>
          <div className="small">{user?.email ?? ""}</div>
        </div>
      </div>

      <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid var(--border)" }} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => auth.logout(logoutUri)}>Logout</button>
      </div>

      <div className="small" style={{ marginTop: 16 }}>Access token preview (first 80 chars):</div>
      <pre
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "rgba(0,0,0,0.22)", padding: 12, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginTop: 8 }}
      >
        {tokenPreview}...
      </pre>
    </div>
  );
}
