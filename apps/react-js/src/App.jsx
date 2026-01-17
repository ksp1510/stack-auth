import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
