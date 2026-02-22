import { writable } from 'svelte/store';

export type Route = '/' | '/callback' | '/home';

function getPath(): Route {
  const p = window.location.pathname;
  if (p === '/callback' || p === '/home' || p === '/') return p as Route;
  return '/';
}

export const currentPath = writable<Route>(getPath());

export function navigate(path: Route): void {
  window.history.pushState({}, '', path);
  currentPath.set(path);
}

window.addEventListener('popstate', () => {
  currentPath.set(getPath());
});