import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Callback() {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await auth.handleRedirectCallback();
        nav("/home", { replace: true });
      } catch (e: any) {
          const message =
            e?.error === "access_denied" ? "Login cancelled." : "Login callback failed.";
          sessionStorage.setItem("stackauth_notice", message);
          nav("/", { replace: true });
        }
    })();
  }, [nav]);

  return (
    <div>
      <div className="title h1">Signing you in…</div>
      <div className="sub">Handling Auth0 callback</div>

      {error && (
        <div className="row">
          <div className="err">Error: {error}</div>
          <Link className="a" to="/">Back to Login</Link>
        </div>
      )}
    </div>
  );
}
