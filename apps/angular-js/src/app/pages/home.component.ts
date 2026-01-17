import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "@auth0/auth0-angular";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card wide">
      <header class="head">
        <div>
          <div class="title">Home</div>
          <div class="sub">Angular (JS-style) · Authenticated area</div>
        </div>
        <button class="btn" (click)="logout()">Logout</button>
      </header>

      <div class="grid">
        <div class="box">
          <div class="k">Authenticated</div>
          <div class="v">{{ (isAuth$ | async) ? "Yes" : "No" }}</div>
        </div>
        <div class="box">
          <div class="k">User</div>
          <div class="v">{{ (name$ | async) || "—" }}</div>
        </div>
      </div>

      <div class="json">
        <div class="k">Profile JSON</div>
        <pre>{{ (user$ | async) | json }}</pre>
      </div>

      <a class="a" href="http://localhost:3000/">Back to landing</a>
    </section>
  `,
  styles: [`
    .card{
      width: min(720px, 92vw);
      background: rgba(17, 24, 39, .7);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      padding: 22px;
      box-shadow: 0 20px 60px rgba(0,0,0,.45);
      backdrop-filter: blur(10px);
    }
    .wide{ width: min(720px, 92vw); }
    .head{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }
    .title{ font-size: 20px; font-weight: 800; }
    .sub{ opacity: .8; margin-top: 6px; font-size: 13px; }
    .btn{
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color: #e5e7eb;
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      white-space: nowrap;
    }
    .btn:hover{ background: rgba(255,255,255,.10); }
    .grid{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    .box{
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.05);
      border-radius: 14px;
      padding: 12px;
    }
    .k{ font-size: 12px; opacity: .75; }
    .v{ margin-top: 6px; font-size: 14px; font-weight: 800; }
    .json{
      margin-top: 12px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.05);
      border-radius: 14px;
      padding: 12px;
    }
    pre{
      margin: 8px 0 0;
      font-size: 12px;
      overflow: auto;
      max-height: 280px;
    }
    .a{ display: inline-block; margin-top: 12px; color: #93c5fd; }
  `]
})
export class HomeComponent {
  auth = inject(AuthService);

  isAuth$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
  name$ = this.auth.user$.pipe(map((u) => (u?.name || u?.email || "")));

  logout() {
    this.auth.logout({ logoutParams: { returnTo: environment.auth0.logoutUri } });
  }
}
