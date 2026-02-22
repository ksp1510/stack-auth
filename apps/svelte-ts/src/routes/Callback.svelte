<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../auth';
  import { navigate } from '../router';

  let errorMsg = $state('');

  onMount(async () => {
    // main.ts already called handleRedirectCallback() and navigated to /home.
    // If we're still on /callback, just check auth state and redirect.
    try {
      const isAuthed = await auth.isAuthenticated();
      if (isAuthed) {
        navigate('/home');
      } else {
        navigate('/');
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      errorMsg = err?.message || 'Authentication check failed.';
    }
  });
</script>

<section class="card">
  <div class="title">Signing you in…</div>
  <div class="sub">Handling Auth0 callback</div>

  {#if errorMsg}
    <div class="status err" style="margin-top:14px;">
      <span>Error: {errorMsg}</span>
      <a class="link" href="/">Back to Login</a>
    </div>
  {/if}
</section>