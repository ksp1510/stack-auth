<!-- apps/svelte-js/src/App.svelte -->
<script>
  import { route } from "./router";
  import Login from "./routes/Login.svelte";
  import Callback from "./routes/Callback.svelte";
  import Home from "./routes/Home.svelte";
</script>

<main class="app">
  {#if $route === "/callback"}
    <Callback />
  {:else if $route === "/home"}
    <Home />
  {:else}
    <Login />
  {/if}
</main>
