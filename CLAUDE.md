# @coroboros/uri

RFC-3986 URI toolkit: parse and recompose URIs, Punycode encode/decode domains, validate IPs, domains, URIs, HTTP(S) and Sitemap URLs, and encode/decode URI strings and components.

## Canonical rules

Follows the Coroboros engineering global rules. Repo-specific divergences are stated inline in `## Rules` below.

> **Public-repo hygiene:** this is shipped into a public community repo. Never reference private `~/.claude/rules/*` paths, local machine paths, or the migration recipe here — keep it generic.

## Tech Stack
- TypeScript strict, ES modules + CJS dual build (tsdown)
- Vitest + `fast-check` for property tests, Biome for lint/format
- `mitata` for benchmarks (`pnpm bench`)
- Node.js 22 LTS
- Zero runtime dependencies — Punycode uses Node's `node:url` (`domainToASCII` / `domainToUnicode`)

## Commands
- `pnpm build` — bundle ESM + CJS + types to `dist/`
- `pnpm test` — run the Vitest suite (incl. property-based)
- `pnpm test:coverage` — Vitest with the 100% coverage gate
- `pnpm lint` / `pnpm lint:fix` — Biome check
- `pnpm typecheck` — tsc --noEmit
- `pnpm bench` — build then run `bench/uri.bench.mjs`
- `pnpm dev` — tsdown watch mode

## Important Files
- `src/index.ts` — public entry point; all exports surface through here
- `src/parser/index.ts` — `parseURI`, `recomposeURI`, `hostToURI` (RFC-3986 Appendix B grammar)
- `src/checkers/index.ts` — URI / URL / Sitemap validators, error taxonomy
- `src/encoders/index.ts`, `src/decoders/index.ts` — RFC-3986 encode/decode
- `src/resolver/index.ts` — `resolveURI`, `removeDotSegments` (RFC-3986 §5.2 verbatim)
- `src/helpers/object.ts` — private `exists` / `is` type guards (inlined, not exported)
- `tsdown.config.ts` — dual build config (ESM + CJS + dts)
- `tests/` — one spec per source module + `uri.property.test.ts` for `fast-check` invariants
- `bench/uri.bench.mjs` — mitata bench vs native `URL` / `URL.canParse`; `bench/baseline.md` documents the 1.0.0 numbers

## Public API (1.0.0 contract)
- `punycode(domain)`, `punydecode(domain)` — domain ASCII/Unicode serialization
- `parseURI(uri)`, `recomposeURI(components)` — RFC-3986 parse / recompose
- `resolveURI(base, reference)`, `removeDotSegments(path)` — RFC-3986 §5.2 reference resolution
- `isDomainLabel(label)`, `isDomain(name)`, `isIP(ip)`, `isIPv4(ip)`, `isIPv6(ip)` — validators
- `checkURI(uri)`, `checkHttpURL(uri)`, `checkHttpsURL(uri)`, `checkWebURL(uri)`, `checkSitemapURL(uri)`, `checkHttpSitemapURL(uri)`, `checkHttpsSitemapURL(uri)` — throw a coded error on invalid input
- `encodeURIComponentString(component, options)`, `encodeURIString(uri, options)`, `encodeWebURL(uri, options)`, `encodeSitemapURL(uri)` — RFC-3986 encoders
- `decodeURIComponentString(component, options)`, `decodeURIString(uri, options)`, `decodeWebURL(uri, options)`, `decodeSitemapURL(uri, options)` — RFC-3986 decoders

## Rules
- The **published** `1.0.0` tag is the public contract — once it ships, **NEVER** break the API above (signatures, error codes, type shapes) without a major bump. Until `1.0.0` is published, breaking changes are allowed but every break must be enumerated in the PR.
- **NEVER** add a new runtime dependency without user approval. Zero-dependency is a feature.
- **NEVER** use `axios`, `request`, or `node-fetch` — use native `fetch` (Node 22+).
- Run `pnpm lint && pnpm typecheck && pnpm test` before every commit.
- Run `pnpm bench` against `bench/baseline.md` when touching the parser, encoders or decoders — no regression > 10 % on any bucket at fixed feature set.
- Scoped package — `publishConfig.access = "public"` is mandatory, do not remove.
- **Publish** — CI-owned via OIDC Trusted Publisher + npm provenance. The first `1.0.0` publish bootstraps through the org registry token (CI auto-detects it); once the package exists on npm, configure it as a Trusted Publisher and never re-add a token to `ci.yml`. Manual `pnpm publish` is forbidden — it bypasses provenance and the tag guard.
- **Git** — `main`-only; branch → PR → squash-merge → tag the merge commit. The tag is the only manual step; release automation (version bump, `CHANGELOG.md`, npm publish, GitHub release) is owned by [`coroboros/ci`](https://github.com/coroboros/ci). Never hand-edit `package.json` version or `CHANGELOG.md`. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before tagging.
