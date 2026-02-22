<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../auth';

  let notice = $state('');

  onMount(() => {
    const msg = sessionStorage.getItem('stackauth_notice');
    if (msg) {
      notice = msg;
      sessionStorage.removeItem('stackauth_notice');
    }
  });

  const target = { appState: { target: '/home' } };

  function login() {
    auth.login(target);
  }

  function signup() {
    auth.signup(target);
  }
</script>

<section class="card">
  <header class="head">
    <div>
      <div class="title">Svelte (TS)</div>
      <div class="sub">Auth0 Universal Login · Google · No backend</div>
    </div>
    <a class="ghost" href="http://localhost:3000/">Landing</a>
  </header>

  <div class="actions">
    <button class="btn primary" type="button" onclick={login}>Login</button>
    <button class="btn" type="button" onclick={signup}>Sign up</button>
  </div>

  <div class="divider"><span>or</span></div>

  <button class="btn google" type="button" onclick={login}>
    Continue with Google
  </button>

  {#if notice}
    <div class="status warn" style="margin-top:14px;">
      <span>{notice}</span>
    </div>
  {/if}

  <p class="hint">
    Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
  </p>
</section>