<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../auth";

const router = useRouter();
const errorMsg = ref("");

onMounted(async () => {
  try {
    await auth.handleRedirectCallback();
    router.replace("/home");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errorMsg.value = msg || "Login callback failed.";
  }
});
</script>

<template>
  <section class="card">
    <div class="title">Signing you in…</div>
    <div class="sub">Handling Auth0 callback</div>

    <div v-if="errorMsg" class="status err" style="margin-top:14px;">
      <span>Error: {{ errorMsg }}</span>
      <router-link class="link" to="/">Back to Login</router-link>
    </div>
  </section>
</template>
