<script setup lang="ts">
import { onMounted, ref } from "vue";
import { auth, logoutUri } from "../auth";

type User = Record<string, unknown> & { name?: string; email?: string };

const authed = ref(false);
const user = ref<User | null>(null);

onMounted(async () => {
  authed.value = await auth.isAuthenticated();
  if (!authed.value) {
    window.history.replaceState({}, "", "/");
    window.location.assign("/");
    return;
  }
  user.value = (await auth.getUser()) as User | undefined ?? null;
});

function logout() {
  auth.logout(logoutUri);
}
</script>

<template>
  <section class="card" style="width:min(720px, 92vw);">
    <header class="head">
      <div>
        <div class="title">Home</div>
        <div class="sub">Vue (TS) · Authenticated area</div>
      </div>
      <button class="btn" type="button" @click="logout">Logout</button>
    </header>

    <div class="grid">
      <div class="box">
        <div class="k">Authenticated</div>
        <div class="v">{{ authed ? "Yes" : "No" }}</div>
      </div>
      <div class="box">
        <div class="k">User</div>
        <div class="v">{{ (user?.name as string) || (user?.email as string) || "—" }}</div>
      </div>
    </div>

    <div class="json">
      <div class="k">Profile JSON</div>
      <pre>{{ JSON.stringify(user ?? {}, null, 2) }}</pre>
    </div>

    <a class="a" href="http://localhost:3000/">Back to landing</a>
  </section>
</template>
