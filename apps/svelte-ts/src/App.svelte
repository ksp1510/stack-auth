<script lang="ts">
  import { currentPath } from './router';
  import Login from './routes/Login.svelte';
  import Callback from './routes/Callback.svelte';
  import Home from './routes/Home.svelte';
</script>

<main class="app">
  {#if $currentPath === '/home'}
    <Home />
  {:else if $currentPath === '/callback'}
    <Callback />
  {:else}
    <Login />
  {/if}
</main>