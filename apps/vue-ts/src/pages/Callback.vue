<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // main.js already processes callback before mount
  router.replace("/");
});
</script>

<template>
  <section class="card">
    <div class="title">Signing you in…</div>
    <div class="sub">Handling Auth0 callback</div>
    <div class="small">If you see this, reload once.</div>
  </section>
</template>

