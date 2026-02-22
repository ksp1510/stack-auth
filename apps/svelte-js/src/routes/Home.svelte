<!-- apps/svelte-js/src/routes/Home.svelte -->
<script>
  import { onMount } from "svelte";
  import { navigate, link } from "../router";
  import { auth, logoutUri } from "../auth";

  let loading = true;
  let authed = false;
  let user = null;

  onMount(async () => {
    try {
      authed = await auth.isAuthenticated();
      if (!authed) {
        navigate("/", { replace: true });
        return;
      }
      user = await auth.getUser();
    } finally {
      loading = false;
    }
  });

  function logout() {
    auth.logout(logoutUri);
  }
</script>

<section class="card wide">
  <header class="head">
    <div>
      <div class="title">Home</div>
      <div class="sub">Svelte (JS) · Authenticated area</div>
    </div>
    <button class="btn" type="button" on:click={logout}>Logout</button>
  </header>

  {#if loading}
    <div class="small">Loading...</div>
  {:else}
    <div class="grid">
      <div class="box">
        <div class="k">Authenticated</div>
        <div class="v">Yes</div>
      </div>
      <div class="box">
        <div class="k">User</div>
        <div class="v">{user?.name || user?.email || "—"}</div>
      </div>
    </div>

    <div class="panel">
      <div class="panelTitle">Profile JSON</div>
      <pre>{JSON.stringify(user || {}, null, 2)}</pre>
    </div>

    <a class="link" href="http://localhost:3000/" style="display:inline-block; margin-top:12px;">
      Back to landing
    </a>

  {/if}
</section>
