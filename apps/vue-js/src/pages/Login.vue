<script setup>
import { onMounted, ref } from "vue";
import { auth } from "../auth";

const notice = ref("");

onMounted(() => {
  const msg = sessionStorage.getItem("stackauth_notice");
  if (msg) {
    notice.value = msg;
    sessionStorage.removeItem("stackauth_notice");
  }
});

const target = { appState: { target: "/home" } };

function login() {
  auth.login(target);
}

function signup() {
  auth.signup(target);
}
</script>

<template>
  <section class="card">
    <header class="head">
      <div>
        <div class="title">Vue (JS)</div>
        <div class="sub">Auth0 Universal Login · Google · No backend</div>
      </div>

      <a class="ghost" href="http://localhost:3000/">Landing</a>
    </header>

    <div class="actions">
      <!-- type="button" prevents form-submit reloads -->
      <button class="btn primary" type="button" @click="login">Login</button>
      <button class="btn" type="button" @click="signup">Sign up</button>
    </div>

    <div class="divider"><span>or</span></div>

    <button class="btn google" type="button" @click="login">
      Continue with Google
    </button>

    <div v-if="notice" class="status" style="margin-top:14px;">
      <span>{{ notice }}</span>
    </div>

    <p class="hint">
      Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
    </p>
  </section>
</template>
