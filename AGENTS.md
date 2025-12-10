# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (port 3000)
bun run build        # Production build
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run format       # Format with Prettier
bun run tsc          # Type check
bun test             # Run tests
```

### Database (Drizzle + SQLite)

```bash
bun run db:push      # Push schema changes
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio
```

## Guidelines

- Prefer CSR and client-side patterns
- Use type-safe RPC for interacting with the database
- Always perform session check `auth.api.getSession()` and use user data from there to protect them

## Bun

Default to Bun instead of Node.js. Bun automatically loads `.env` files.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

### APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Architecture

**TanStack Start** full-stack React framework with file-based routing, SSR, and React Query integration.

### Directory Structure

```
src/
├── components/       # UI components
├── drizzle/
│   └── schema.ts     # Database schema definitions
├── hooks/            # Custom React hooks
├── lib/              # Libraries and utiltiies
├── middleware/
│   └── auth.ts       # Auth middleware for protected routes
├── routes/
│   ├── __root.tsx    # Root layout
│   ├── _auth.tsx     # Protected layout (applies auth middleware)
│   ├── _auth/        # Protected routes (e.g Dashboard, Team)
│   ├── api/          # API routes
├── server/           # Server functions (RPC, Backend logic)
├── router.tsx        # Router + QueryClient setup
└── routeTree.gen.ts  # Auto-generated (do not edit)
guides/               # How-tos, guides, and instructions for LLMs

```

### Routing (`src/routes/`)

- File-based routing via TanStack Router
- `__root.tsx` - Root layout with devtools, global CSS
- `_auth.tsx` - Layout route that applies `authMiddleware` to all children
- `_auth/dashboard.tsx` - Protected routes under `_auth` layout
- Route tree auto-generated to `src/routeTree.gen.ts` (NEVER edit this file)

### Server Functions (`src/server/`)

- Use `createServerFn()` from `@tanstack/react-start` for type-safe RPC
- All server backend logic should use server functions
- Validate inputs with Zod schemas
- Example: `src/server/auth.ts` - `getCurrentUser`, `triggerOTPLogin`, `loginWithOTP`

### Auth (better-auth)

- `src/lib/auth.ts` - Main auth config with email OTP plugin
- `src/lib/auth.cli.ts` - CLI-only config for schema generation
- `src/middleware/auth.ts` - Route middleware that redirects unauthenticated users

### Database (Drizzle ORM)

- `src/lib/db.ts` - Database connection (SQLite in-memory for dev)
- `src/drizzle/schema.ts` - Schema definitions (user, session, account, verification, posts)
- Config: `drizzle.config.ts`

### React Query

- Configured in `src/router.tsx` with SSR integration
- Use React Query for all client-side fetching

### Path Alias

Use `@/*` for imports from `src/*` (configured in `tsconfig.json`).
