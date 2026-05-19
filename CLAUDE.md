# @coroboros/uri

RFC-3986 URI toolkit: parse and recompose URIs, Punycode encode/decode domains, validate IPs, domains, URIs, HTTP(S) and Sitemap URLs, and encode/decode URI strings and components.

## Canonical rules

Follows the Coroboros engineering global rules. Repo-specific divergences are stated inline in `## Rules` below.

> **Public-repo hygiene:** this is shipped into a public community repo. Never reference private `~/.claude/rules/*` paths, local machine paths, or the migration recipe here — keep it generic.

## Tech Stack
- TypeScript strict, ES modules + CJS dual build (tsdown)
- Vitest for tests, Biome for lint/format
- Node.js 22 LTS
- Zero runtime dependencies — Punycode uses Node's `node:url` (`domainToASCII` / `domainToUnicode`)

## Commands
- `pnpm build` — bundle ESM + CJS + types to `dist/`
- `pnpm test` — run Vitest suite
- `pnpm lint` / `pnpm lint:fix` — Biome check
- `pnpm typecheck` — tsc --noEmit
- `pnpm dev` — tsdown watch mode

## Important Files
- `src/index.ts` — public entry point; all exports surface through here
- `src/parser/index.ts` — `parseURI`, `recomposeURI`, `hostToURI` (RFC-3986 Appendix B grammar)
- `src/checkers/index.ts` — URI / URL / Sitemap validators, error taxonomy
- `src/encoders/index.ts`, `src/decoders/index.ts` — RFC-3986 encode/decode
- `src/resolver/index.ts` — `resolveURI`, `removeDotSegments` (RFC-3986 §5.2 verbatim)
- `src/helpers/object.ts` — private `exists` / `is` type guards (inlined, not exported)
- `tsdown.config.ts` — dual build config (ESM + CJS + dts)
- `tests/` — Vitest suites, one test file per source module

## Public API (1.0.0 contract)
- `punycode(domain)`, `punydecode(domain)` — domain ASCII/Unicode serialization
- `parseURI(uri)`, `recomposeURI(components)` — RFC-3986 parse / recompose
- `resolveURI(base, reference)`, `removeDotSegments(path)` — RFC-3986 §5.2 reference resolution
- `isDomainLabel(label)`, `isDomain(name)`, `isIP(ip)`, `isIPv4(ip)`, `isIPv6(ip)` — validators
- `checkURI(uri)`, `checkHttpURL(uri)`, `checkHttpsURL(uri)`, `checkWebURL(uri)`, `checkSitemapURL(uri)`, `checkHttpSitemapURL(uri)`, `checkHttpsSitemapURL(uri)` — throw a coded error on invalid input
- `encodeURIComponentString(component, options)`, `encodeURIString(uri, options)`, `encodeWebURL(uri, options)`, `encodeSitemapURL(uri)` — RFC-3986 encoders
- `decodeURIComponentString(component, options)`, `decodeURIString(uri, options)`, `decodeWebURL(uri, options)`, `decodeSitemapURL(uri, options)` — RFC-3986 decoders

## Rules
- **NEVER** break the public API above. The signatures and the error/type shapes are the 1.0.0 contract.
- **NEVER** add a new runtime dependency without user approval. Zero-dependency is a feature.
- **NEVER** use `axios`, `request`, or `node-fetch` — use native `fetch` (Node 22+).
- Run `pnpm lint && pnpm typecheck && pnpm test` before every commit.
- Scoped package — `publishConfig.access = "public"` is mandatory, do not remove.
