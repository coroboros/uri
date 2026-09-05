# @coroboros/uri

RFC-3986 URI parsing, resolution, validation and encoding for Node.js 22+, including IDN and Sitemap support.

## Project constraints

- `README.md` documents the standards and API; `src/index.ts` owns exports. Preserve published signatures, error codes and types. Any approved break requires a major version and an explicit migration description.
- Preserve RFC-3986 resolution semantics in `src/resolver/`; do not substitute WHATWG URL behavior. Punycode uses `node:url`.
- Keep zero runtime dependencies; additions require user approval. Use native `fetch` where needed.
- Preserve the public scoped package and dual ESM/CJS exports. Keep public artifacts free of private paths and infrastructure references.

## Validation

Use the scripts in `package.json`. Source or dependency changes require `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`; use `pnpm test:coverage` when coverage is affected. Documentation-only edits need Markdown and reference checks.

For parser, encoder or decoder changes, run `pnpm bench` against the bucket budgets in `bench/baseline.md`. Reuse passing results while the tested inputs remain unchanged.

## Release

Target `main` through a PR and squash-merge the reviewed head. After release approval, tag the merge commit with the next SemVer. `.github/workflows/ci.yml` delegates version updates, changelog, npm publication and GitHub release to the shared package pipeline; leave those generated artifacts to CI. Publishing uses OIDC with provenance; do not add an npm token or publish locally.
