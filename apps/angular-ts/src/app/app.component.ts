import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app{
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,.35), transparent 60%),
                  radial-gradient(900px 500px at 85% 25%, rgba(16,185,129,.28), transparent 55%),
                  #070a12;
      color: #e5e7eb;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
  `]
})
export class AppComponent {}
