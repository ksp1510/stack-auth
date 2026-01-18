import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/Login.vue";
import Callback from "./pages/Callback.vue";
import Home from "./pages/Home.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Login },
    { path: "/callback", component: Callback },
    { path: "/home", component: Home }
  ]
});
// Redirect cancelled/failed Auth0 callback straight to Login (no callback UI)
router.beforeEach((to) => {
  if (to.path !== "/callback") return true;

  const err = to.query?.error;
  const desc = (to.query?.error_description ?? "").toString();

  if (!err) return true;

  // Store notice and bounce to login (keeps layout consistent)
  sessionStorage.setItem(
    "stackauth_notice",
    err === "access_denied" ? "Login cancelled." : `${err}${desc ? ": " + desc : ""}`
  );

  return { path: "/", replace: true };
});
