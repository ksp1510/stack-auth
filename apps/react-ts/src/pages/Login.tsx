import React, { useEffect, useState } from "react";
import { auth } from "../auth";
import { Link } from "react-router-dom";

export default function Login() {
  const [alreadyAuthed, setAlreadyAuthed] = useState(false);
  
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const msg = sessionStorage.getItem("stackauth_notice") || "";
    if (msg) {
      sessionStorage.removeItem("stackauth_notice");
      setNotice(msg);
    }
  }, []);


  useEffect(() => {
    (async () => {
      try {
        setAlreadyAuthed(await auth.isAuthenticated());
      } catch {
        setAlreadyAuthed(false);
      }
    })();
  }, []);

  const target = { appState: { target: "/home" } } as any;

  return (
    <div>
      <header className="head">
        <div>
          <div className="title">React (TS)</div>
          <div className="sub">Auth0 Universal Login · Google · No backend</div>
        </div>

        <a className="ghost" href="http://localhost:3000/">Landing</a>
      </header>


      <div className="actions">
        <button className="btn primary" onClick={() => auth.login(target)} type="button">
          Login
        </button>
        <button className="btn" onClick={() => auth.signup(target)} type="button">
          Sign up
        </button>
      </div>

      <div className="divider"><span>or</span></div>

      <button className="btn google" onClick={() => auth.login(target)} type="button">
        Continue with Google
      </button>

      {notice ? (
        <div className="status" style={{ marginTop: 14 }}>
          <span>{notice}</span>
        </div>
      ) : null}

      <p className="hint">
        Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
      </p>

      {alreadyAuthed && (
        <div className="status">
          <span>Already logged in.</span>
          <Link className="link" to="/home">Go to Home</Link>
        </div>
      )}

    </div>
  );
}
