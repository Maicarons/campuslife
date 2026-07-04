# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Start**: `npm start`
- **Git status**: `git status`

## Architecture Overview

- **Frontend**: 
  - Built with React using Vite. Entry point: `src/main.tsx`. 
  - Components located in `src/components/`. 
  - Styling via CSS modules or Tailwind; uses shadcn/ui components.

- **Backend**: 
  - Node.js server in `server/` directory. 
  - API routes in `src/server/*.ts`. 
  - Uses Express/Fastify (as appropriate).

- **Configuration**: 
  - Vite config at `vite.config.ts`. 
  - Environment variables in `.env*` files.

- **Testing**: 
  - Unit tests with Jest under `tests/`. 
  - Run with `npm test`. 
  - End‑to‑end tests with Playwright under `tests/e2e/`.

- **Scripts** (from `package.json`): 
  - `dev`: start development server. 
  - `build`: production build. 
  - `lint`: linting with ESLint. 
  - `format`: code formatting with Prettier. 
  - `test:playwright`: run Playwright tests.

## Development Workflow

1. Install dependencies: `npm ci`.
2. Run dev server: `npm run dev`.
3. Write code; add unit/integration tests.
4. Lint and type‑check: `npm run lint` and `npm run type-check`.
5. Build for production: `npm run build`.
6. Run all tests: `npm test`.

## Useful Tools

- **Playwright**: `npm run test:playwright`.
- **MCP Skills**: Various skills (e.g., `find-skills`, `web-search`, `github` integration) are available; see `skills` directory.
- **Git**: Standard workflow (`git add`, `git commit`, `git push`).

## Adding New Features

- Follow the existing component structure.
- Add relevant unit and integration tests.
- Update Storybook or design docs if applicable.
- Ensure code passes lint and type‑check before PR.

## Contact

- Maintainer: Maicarons (repository owner).