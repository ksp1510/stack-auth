import { createSignal } from "solid-js";

export type Route = "/" | "/callback" | "/home";

function getPath(): Route {
  const p = window.location.pathname;
  if (p === "/callback" || p === "/home" || p === "/") return p as Route;
  return "/";
}

const [currentPath, setCurrentPath] = createSignal<Route>(getPath());

export { currentPath };

export function navigate(path: Route): void {
  window.history.pushState({}, "", path);
  setCurrentPath(path);
}

window.addEventListener("popstate", () => setCurrentPath(getPath()));
