import React from "react";
import { auth } from "../auth";

export default function Login() {
  return (
    <div>
      <h2 style={{ margin: "0 0 10px 0" }}>Login / Sign Up</h2>
      <div className="small" style={{ marginBottom: 14 }}>
        Email/username + password and Google are handled by Auth0 Universal Login.
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="btn primary"
          onClick={() => auth.login({ appState: { target: "/home" } })}
        >
          Login
        </button>
        <button
          className="btn"
          onClick={() => auth.signup({ appState: { target: "/home" } })}
        >
          Create account
        </button>
      </div>

      <div className="small" style={{ marginTop: 14 }}>
        Provider buttons (Google) and database login are configured in Auth0.
      </div>
    </div>
  );
}
