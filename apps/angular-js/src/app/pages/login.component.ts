import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <header class="head">
        <div>
          <div class="title">Angular (JS)</div>
          <div class="sub">Auth0 Universal Login · Google · No backend</div>
        </div>
        <a class="btn ghost" href="http://localhost:3000/">Landing</a>
      </header>

      <div class="status warn" *ngIf="notice">
        <span>{{ notice }}</span>
      </div>

      <div class="actions">
        <button class="btn primary" (click)="login()">Login</button>
        <button class="btn" (click)="signup()">Sign up</button>
      </div>

      <div class="divider"><span>or</span></div>

      <button class="btn google" (click)="login()">Continue with Google</button>

      <p class="hint">
        Email/Password happens inside Auth0 Universal Login (DB connection). Your app never sees passwords.
      </p>

      <div class="status" *ngIf="(isAuth$ | async) === true">
        <span>Already logged in.</span>
        <a class="link" href="/home">Go to Home</a>
      </div>
    </section>
  `,
  styles: [`
    .card{
      width: min(520px, 92vw);
      background: rgba(17, 24, 39, .7);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      padding: 22px;
      box-shadow: 0 20px 60px rgba(0,0,0,.45);
      backdrop-filter: blur(10px);
    }
    .head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:14px;
      margin-bottom:16px;
    }

    .title{ font-size:22px; font-weight:700; }
    .sub{ opacity:.8; margin-top:6px; font-size:13px; }

    .actions{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }

    .ghost{
      border:1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color:#e5e7eb;
      padding:10px 12px;
      border-radius:12px;
      cursor:pointer;
      font-weight:700;
      text-decoration:none;
      white-space:nowrap;
    }
    .ghost:hover{ background: rgba(255,255,255,.10); }

    .btn{
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color: #e5e7eb;
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn:hover{ background: rgba(255,255,255,.10); }
    .btn.primary{
      border-color: rgba(99,102,241,.5);
      background: rgba(99,102,241,.18);
    }
    .btn.primary:hover{ background: rgba(99,102,241,.28); }
    .btn.google{ width: 100%; margin-top: 10px; }

    .divider{ display: grid; place-items: center; margin: 14px 0; position: relative; }
    .divider::before{
      content: "";
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: rgba(255,255,255,.10);
    }
    .divider span{
      position: relative;
      padding: 0 10px;
      background: rgba(17, 24, 39, .9);
      font-size: 12px;
      opacity: .8;
    }

    .hint{ margin-top: 12px; font-size: 12px; opacity: .75; line-height: 1.4; }

    .status{
      margin-top: 14px;
      padding: 10px 12px;
      border: 1px solid rgba(16,185,129,.35);
      background: rgba(16,185,129,.08);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-size: 13px;
    }
    .link{ color: #93c5fd; font-weight: 700; text-decoration: none; }
    .link:hover{ text-decoration: underline; }
  `]
})
export class LoginComponent {
  auth = inject(AuthService);
  isAuth$ = this.auth.isAuthenticated$;

  notice: string | null = null;

  ngOnInit() {
    this.notice = sessionStorage.getItem("stackauth_notice");
    if (this.notice) sessionStorage.removeItem("stackauth_notice");
  }

  login() {
    this.auth.loginWithRedirect({ appState: { target: "/home" } });
  }

  signup() {
    this.auth.loginWithRedirect({
      appState: { target: "/home" },
      authorizationParams: { screen_hint: "signup" }
    });
  }
}
