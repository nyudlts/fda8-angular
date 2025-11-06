## Quick orientation for AI coding agents

This repo is the Angular frontend for Faculty Digital Archive (a fork of DSpace `dspace-angular`). The goal of this file is to provide targeted, actionable context so an AI can be immediately productive editing, building, and testing the project.

Key facts
- Frontend only: Angular (v17) app talking to a separate Java REST backend (see https://github.com/nyudlts/fda8) — service boundary is the REST API (configured at `rest.host`, `rest.port`, `rest.nameSpace`).
- Server-Side Rendering (SSR) is enabled. See `server.ts` and the `server` build target in `angular.json`.
- Custom webpack builders are used (`@angular-builders/custom-webpack`). See `webpack/*` configs referenced in `angular.json`.
- Themes are compiled as separate SCSS bundles under `src/themes/*` and referenced in `angular.json` styles.

Where to look (examples)
- Application source: `src/` (components under `src/app/`).
- Environment/build-time config: `src/environments/` (e.g. `environment.production.ts`).
- Runtime config: `config/` (e.g. `config.example.yml`, runtime overrides written to `dist/browser/assets/config.json` in production or `src/app/assets/config.json` in dev).
- Webpack: `webpack/webpack.*.ts` (browser/test/prod/mirador configs).
- Server entrypoint (SSR): `server.ts` and `main.server.ts`.
- Lint rules: `lint/` and local ESLint plugins are linked in `package.json` (`eslint-plugin-dspace-angular-*` -> `link:./lint/dist/...`).
- E2E: `cypress/` (tests live under `cypress/e2e` or `cypress/` folders; config in `cypress.config.ts`).

Important workflows & commands (copyable)
- Install: `yarn install`
- Start dev server (watch + SSR reload): `yarn start:dev` (this runs `nodemon` which executes `scripts/serve.ts`)
- Start production build and server: `yarn start` (runs `build:prod` then `serve:ssr`)
- Build SSR for production: `yarn run build:ssr` or `yarn run build:prod`
- Run unit tests (Karma/Jasmine): `yarn test` (see `karma.conf.js`, specs colocated as `*.spec.ts`)
- Run Cypress: `yarn cypress:open` or `yarn cypress:run`
- Lint build step (required to produce local eslint plugin code): `yarn build:lint` (used by `yarn test:lint` and other scripts). Note: `postinstall` runs `yarn build:lint || echo 'Skipped DSpace ESLint plugins.'`

Project-specific patterns & gotchas
- Runtime vs build-time config: runtime YAML (`config/*.yml`) is merged at startup and written into `assets/config.json`. Changing runtime config does not require a new build. Build-time config lives in `src/environments/` and is compiled into bundles.
- SSR/Cypress interplay: some attributes are only present in CSR; tests prefer `data-test` attributes guarded with `ngBrowserOnly` to ensure Cypress waits for client rendering (see README guidance). If a failing E2E looks like a timing/element-not-found problem, check SSR/client-only attribute patterns.
- Local eslint plugins: the repo compiles custom lint rules in `lint/` and links them via `package.json`. If lint errors or plugin build problems occur, run `yarn build:lint` before `ng lint`.
- NgRx devtools replacement: production build replaces `src/config/store/devtools.ts` with `devtools.prod.ts` via `angular.json` file replacements — look there for store/devtools behavior.
- The project uses `@angular-builders/custom-webpack` so edits in `webpack/*` affect builds; the builder merges custom config with Angular CLI config.

Integration & external dependencies
- Backend REST API: environment/runtime config points to `rest` host/port/namespace. Environment variables use the `DSPACE_` prefix (e.g. `DSPACE_REST_HOST`, `DSPACE_REST_PORT`, `DSPACE_REST_SSL`). See README for exact mapping.
- Mirador and plugins: Mirador is used for viewer functionality. Mirador build occurs with `yarn run build:mirador` (webpack `webpack.mirador.config.ts`).
- CI workflows: GitHub Actions live in `.github/workflows/*.yml` (build, docker, code scan). Use them as examples for what CI expects the project to do.

What to change when implementing features/fixes
- Prefer editing code under `src/app/**`. Place unit tests next to implementation files as `*.spec.ts`.
- For visual/theme changes, update the appropriate `src/themes/*/styles/theme.scss` and confirm the build bundles in `angular.json`.
- For runtime behavior changes dependent on backend API, update runtime `config/*.yml` or doc the new `rest` endpoint usage and prefer feature toggles at runtime when possible.

Useful files to open when troubleshooting
- `package.json` (scripts & dependencies)
- `angular.json` (builders, file replacements, style bundles)
- `README.md` (project-specific developer notes)
- `server.ts`, `src/main.server.ts` (SSR entrypoints)
- `lint/` (custom lint rules)
- `webpack/*` (custom webpack behavior)
- `cypress/` (E2E tests and fixtures)

If something is unclear, ask for one of these specifics: the target branch, intended environment (dev vs production), or whether the change should affect runtime config or build-time code.

-- End of guidance. Please review and indicate any area where you'd like more detail (examples, file pointers, or tests to add).
