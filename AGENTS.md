# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

**Formë** — marketing + booking site for a dress-rental studio in Tiranë.
Full-stack React app built on **TanStack Start** (SSR) with **TanStack Router**
(file-based routing) and **TanStack Query**. Styled with **Tailwind CSS v4** and
**shadcn/ui**. Runtime and package manager: **Bun**.

## Commands

```bash
bun install          # install dependencies
bun run dev          # dev server (SSR + HMR) on http://localhost:3000
bun run build        # production build → dist/client + dist/server
bun run start        # serve the built app with Bun
bun run lint         # ESLint
bun run typecheck    # tsc --noEmit
bun run format       # Prettier write
```

Always use `bun` / `bunx` — never `npm`, `pnpm`, or `yarn`. The lockfile is
`bun.lock`.

## Conventions

- **Imports:** use the `@/*` alias for `src/*` (e.g. `@/components/ui/button`).
- **Routing:** routes live in `src/routes/`. Each route module exports a `Route`
  created with `createFileRoute` (or `createRootRouteWithContext` for the root).
  `src/routeTree.gen.ts` is **generated** by TanStack Router — never edit it by
  hand; it is regenerated on dev/build.
- **UI components:** prefer existing shadcn/ui primitives in
  `src/components/ui/`. Add new ones with `bunx shadcn@latest add <name>`
  (config in `components.json`). Compose classes with the `cn()` helper from
  `@/lib/utils`.
- **Styling:** Tailwind CSS **v4** — configuration lives in `src/styles.css`
  (`@theme`, CSS variables, semantic tokens), not a `tailwind.config.js`. Use
  the semantic color tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-primary`, …) rather than raw colors.
- **Forms:** `react-hook-form` + `zod` for validation.
- **Server code:** `src/server.ts` is the request handler and normalizes
  catastrophic SSR errors; `src/start.ts` defines request middleware (error
  boundary + CSRF). Keep server functions protected by the CSRF middleware.
- **Code style:** TypeScript, 2-space indent, double quotes, semicolons,
  100-char print width, trailing commas (see `.prettierrc`). Run
  `bun run format` before finishing.

## Before you finish

Run and make sure these pass (no new errors):

```bash
bun run typecheck && bun run lint && bun run build
```

Pinned versions matter: this project's shadcn components target **recharts v2**
and **react-day-picker v9** — do not bump those majors without updating
`src/components/ui/chart.tsx` and `src/components/ui/calendar.tsx`.
