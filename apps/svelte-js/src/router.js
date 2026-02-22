// apps/svelte-js/src/router.js
import { writable } from "svelte/store";

export const route = writable(window.location.pathname);

function sync() {
  route.set(window.location.pathname);
}

window.addEventListener("popstate", sync);

export function navigate(to, opts = {}) {
  const { replace = false } = opts;
  if (replace) window.history.replaceState({}, "", to);
  else window.history.pushState({}, "", to);
  sync();
}

// Svelte action: <a use:link href="/home">Home</a>
export function link(node) {
  function onClick(e) {
    // allow normal behavior for new-tab, etc.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) return;

    const href = node.getAttribute("href");
    if (!href) return;

    // external links -> let browser handle
    if (href.startsWith("http://") || href.startsWith("https://")) return;

    e.preventDefault();
    navigate(href);
  }

  node.addEventListener("click", onClick);
  return {
    destroy() {
      node.removeEventListener("click", onClick);
    }
  };
}

// optional helper if you want to force-sync after replaceState in other files
export function syncRoute() {
  sync();
}
