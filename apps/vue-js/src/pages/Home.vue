<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { auth, logoutUri } from "../auth";

const router = useRouter();

const loading = ref(true);
const authed = ref(false);
const user = ref(null);

onMounted(async () => {
  try {
    authed.value = await auth.isAuthenticated();
    if (!authed.value) {
      router.replace("/");
      return;
    }
    user.value = await auth.getUser();
  } finally {
    loading.value = false;
  }
});

function logout() {
  auth.logout(logoutUri);
}
</script>

<template>
  <section class="card wide">
    <header class="head">
      <div>
        <div class="title">Home</div>
        <div class="sub">Vue (JS) · Authenticated area</div>
      </div>
      <button class="btn" type="button" @click="logout">Logout</button>
    </header>

    <div v-if="loading" class="small">Loading...</div>

    <template v-else>
      <div class="grid">
        <div class="box">
          <div class="k">Authenticated</div>
          <div class="v">Yes</div>
        </div>
        <div class="box">
          <div class="k">User</div>
          <div class="v">{{ user?.name || user?.email || "—" }}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panelTitle">Profile JSON</div>
        <pre>{{ JSON.stringify(user || {}, null, 2) }}</pre>
      </div>

      <a class="link" href="http://localhost:3000/" style="display:inline-block; margin-top:12px;">
        Back to landing
      </a>
    </template>
  </section>
</template>
