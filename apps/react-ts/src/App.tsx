import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>React TS</div>
          <div className="small">React + TS + Auth0 Universal Login</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn" href="http://localhost:3000/">Back to Landing</a>
          <Link className="btn" to="/">Login</Link>
          <Link className="btn" to="/home">Home</Link>
        </div>
      </header>

      <div className="card" style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}
