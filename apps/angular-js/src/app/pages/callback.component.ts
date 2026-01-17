import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <div class="title">Signing you in…</div>
      <div class="sub">Handling Auth0 callback</div>

      <div class="row" *ngIf="errorMsg">
        <div class="err">Error: {{ errorMsg }}</div>
        <a class="a" href="/">Back to Login</a>
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
    .title{ font-size: 18px; font-weight: 800; }
    .sub{ opacity: .8; margin-top: 6px; font-size: 13px; }
    .row{ margin-top: 12px; }
    .err{
      margin-top: 10px;
      padding: 10px 12px;
      border: 1px solid rgba(239,68,68,.35);
      background: rgba(239,68,68,.10);
      border-radius: 12px;
      font-size: 13px;
    }
    .a{ display: inline-block; margin-top: 10px; color: #93c5fd; }
  `]
})
export class CallbackComponent {
  auth = inject(AuthService);
  router = inject(Router);

  errorMsg: string | null = null;

  ngOnInit() {
    this.auth.error$
      .pipe(filter((e): e is any => !!e))
      .subscribe((e) => {
        const err = e?.error ?? "";
        const desc = e?.error_description ?? e?.message ?? "";

        if (err === "access_denied") {
          sessionStorage.setItem("stackauth_notice", "Login cancelled.");
          this.router.navigateByUrl("/", { replaceUrl: true });
          return;
        }

        this.errorMsg = `${err}${desc ? ": " + desc : ""}`;
      });
  }
}
