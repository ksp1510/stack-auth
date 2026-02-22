import { createSignal } from "solid-js";

function getPath() {
  const p = window.location.pathname;
  if (p === "/callback" || p === "/home" || p === "/") return p;
  return "/";
}

const [currentPath, setCurrentPath] = createSignal(getPath());

export { currentPath };

export function navigate(path) {
  window.history.pushState({}, "", path);
  setCurrentPath(path);
}

window.addEventListener("popstate", () => setCurrentPath(getPath()));
