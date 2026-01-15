import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Callback() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("Completing login...");

  useEffect(() => {
    (async () => {
      try {
        await auth.handleRedirectCallback();
        nav("/home", { replace: true });
      } catch (e) {
        setMsg("Login callback failed. Check Auth0 callback URL and env vars.");
        // eslint-disable-next-line no-console
        console.error(e);
      }
    })();
  }, [nav]);

  return <div className="small">{msg}</div>;
}
