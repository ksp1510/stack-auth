import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

export default function App() {
  const loc = useLocation();
  const sizeClass = loc.pathname.startsWith("/home") ? "md" : "sm";

  return (
    <main className="app">
      <section className={`card ${sizeClass}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </section>
    </main>
  );
}
