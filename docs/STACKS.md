# Stack list mapping

Landing page currently links:
- Core TS (Vite Vanilla) -> http://localhost:5173/
- React TS (Vite + React) -> http://localhost:5174/

Suggested port plan for adding more stacks:
- Vue TS -> 5175
- Svelte TS -> 5176
- Solid TS -> 5177
- Astro -> 4321
- Qwik -> 5178
- Angular -> 4200
- jQuery -> 5179

When you add a new stack app locally:
1) Pick a free port
2) Add the port's callback/logout/origin in Auth0
3) Add a card to apps/landing/src/main.ts
