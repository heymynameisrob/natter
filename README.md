# 2026 Starter Kit

Modern, full-stack TypeScript application starter kit. This is highly opinionated and built around my personal preferences of structuring an web application. It focuses on keeping things simple and obvious.

- Runs on bun making development crazy fast
- Type-safe RPC, routing, and rendering with TanStack Start
- Magic Link authentication with Better Auth
- Async data management with React Query
- SQLite\* database managed by DrizzleORM
- UI components using Tailwind, Radix, and Base UI
- Global store management with Zustand (TBD)
- Realtime event relay with PartyKit (TBD)

The goal of this project is to make it easy to get started with new projects. It's preference is for isomorphic applications which prefer to do most things on the client. It priortisies a fast UX, simple patterns, and a low-effort architecture. Perfect for productivity apps, dashboards, and the like!

\*SQLite may change to Postgres

## Commands

All commands are run from the root of the project, from a terminal:

| Command       | Action                                      |
| :------------ | :------------------------------------------ |
| `bun install` | Installs dependencies                       |
| `bun dev`     | Starts local dev server at `localhost:3000` |
| `bun build`   | Build your production site to `./dist/`     |
