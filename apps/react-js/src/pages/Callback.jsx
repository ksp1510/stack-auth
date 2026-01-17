import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Callback() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("Signing you in…");

  useEffect(() => {
    (async () => {
      try {
        await auth.handleRedirectCallback();
        nav("/home", { replace: true });
      } catch (e) {
        setMsg("Login callback failed. Check Auth0 callback URL and env vars.");
        console.error(e);
      }
    })();
  }, [nav]);

  return (
    <section className="card">
      <div className="title">{msg}</div>
      <div className="sub">Handling Auth0 callback</div>
    </section>
  );
}
