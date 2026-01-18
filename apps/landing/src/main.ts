import "@stack-auth/ui-tokens/src/tokens.css";

type StackLink = {
  title: string;
  description: string;
  url: string;
  badge?: string;
};

const stacks: StackLink[] = [
  {
    title: "Core (HTML + JS)",
    description: "Vanilla JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5175/",
    badge: "Reference"
  },
  {
    title: "Core (HTML + TS)",
    description: "Vanilla TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5173/",
    badge: "Reference"
  },
  {
    title: "Core (HTML + Sass + JS)",
    description: "Vanilla JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5176/",
    badge: "Reference"
  },
  {
    title: "React (TS)",
    description: "React + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5174/",
    badge: "Reference"
  },
  {
    title: "React (JS)",
    description: "React + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5177/",
    badge: "Reference"
  },
  {
    title: "Angular (TS)",
    description: "Angular + TypeScript + Vite. Auth0 Universal Login",
    url: "http://localhost:5178/",
    badge: "Reference"
  },
  {
    title: "Angular (JS)",
    description: "Angular + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5179/",
    badge: "Reference"
  },
  {
    title: "Vue (JS)",
    description: "Vue + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5180/",
    badge: "Reference"
  },
  {
    title: "Vue (TS)",
    description: "Vue + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5181/",
    badge: "Reference"
  },
  {
    title: "Svelte (JS)",
    description: "Svelte + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5182/",
    badge: "TODO"
  },
  {
    title: "Svelte (TS)",
    description: "Svelte + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5183/",
    badge: "TODO"
  },
  {
    title: "SolidJS (JS)",
    description: "SolidJS + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5184/",
    badge: "TODO"
  },
  {
    title: "SolidJS (TS)",
    description: "SolidJS + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5185/",
    badge: "TODO"
  },
  {
    title: "Astro (JS)",
    description: "Astro + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5186/",
    badge: "TODO"
  },
  {
    title: "Astro (TS)",
    description: "Astro + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5187/",
    badge: "TODO"
  },
  {
    title: "Qwik (JS)",
    description: "Qwik + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5188/",
    badge: "TODO"
  },
  {
    title: "Qwik (TS)",
    description: "Qwik + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5189/",
    badge: "TODO"
  },
  {
    title: "jQuery (JS)",
    description: "jQuery + JavaScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5190/",
    badge: "TODO"
  },
  { title: "jQuery (TS)",
    description: "jQuery + TypeScript + Vite. Auth0 Universal Login.",
    url: "http://localhost:5191/",
    badge: "TODO"
  }
];

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;">
      <div>
        <h1 style="margin:0;font-size:28px;">stack-auth</h1>
        <div class="small" style="margin-top:6px;">Pick a stack. Each one has Login/Sign Up + Google using Auth0.</div>
      </div>
      <a class="btn" href="https://auth0.com/" target="_blank" rel="noreferrer">Auth provider: Auth0</a>
    </div>

    <div class="grid">
      ${stacks
        .map(
          (s) => `
        <a href="${s.url}" class="card" style="text-decoration:none;padding:16px;display:block;">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
            <div>
              <div style="font-weight:800;font-size:16px;">${s.title}</div>
              <div class="small" style="margin-top:6px;line-height:1.4;">${s.description}</div>
            </div>
            <span style="font-size:12px;padding:6px 10px;border:1px solid var(--border);border-radius:999px;background:rgba(255,255,255,0.06);">
              ${s.badge ?? "Stack"}
            </span>
          </div>
        </a>
      `
        )
        .join("")}
    </div>

    <div class="card" style="margin-top:16px;padding:16px;">
      <div style="font-weight:700;">Ports used by this repo</div>
      <div class="small" style="margin-top:8px;line-height:1.6;">
        Landing: 3000 · Core TS: 5173 · Core JS: 5175 · Core Sass + JS: 5176 · React TS: 5174 · React JS: 5177 · Angular TS: 5178 · Angular JS: 5179 · Vue TS: 5180 · Vue JS: 5181 · Svelte TS: 5182 · Svelte JS: 5183 · SolidJS TS: 5184 · SolidJS JS: 5185 · Astro TS: 5186 · Astro JS: 5187 · Qwik TS: 5188 · Qwik JS: 5189 · jQuery TS: 5190 · jQuery JS: 5191
      </div>
    </div>
  </div>
`;
