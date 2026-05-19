# Benchmark baseline

Apple M1, Node 22.22.2. Run `pnpm bench` to reproduce.

Native `URL` is shown for scale only. It implements the WHATWG URL model,
not strict RFC-3986: it applies host/IPv4 leniency, default-port stripping
and mandatory IDNA that this toolkit deliberately does not. The columns are
not equivalent — `@coroboros/uri` trades raw speed for RFC-3986 fidelity,
explicit validation with coded errors, and zero runtime dependencies.

## 1.0.0

### parse — `parseURI(uri)` vs `new URL(uri)`

| Bucket  | parseURI  | new URL  | ratio |
| ------- | --------: | -------: | ----: |
| simple  | 979.57 ns | 215.6 ns | 4.5x  |
| typical |   1.22 µs | 377.7 ns | 3.2x  |
| idn     |   2.30 µs | 707.7 ns | 3.3x  |
| ipv6    |   1.57 µs | 345.1 ns | 4.6x  |
| long    |   1.27 µs | 502.0 ns | 2.5x  |

### validate — `checkWebURL(uri)` vs `URL.canParse(uri)`

| Bucket  | checkWebURL | URL.canParse | ratio  |
| ------- | ----------: | -----------: | -----: |
| simple  |     2.00 µs |     128.9 ns | 15.5x  |
| typical |     3.69 µs |     199.5 ns | 18.5x  |
| idn     |     4.53 µs |     657.5 ns |  6.9x  |
| ipv6    |     3.04 µs |     232.6 ns | 13.1x  |
| long    |    19.43 µs |     204.9 ns | 94.8x  |

`checkWebURL` does full RFC-3986 character validation per component plus
IP/domain checks; `URL.canParse` only attempts a WHATWG parse. The `long`
bucket is a 360-segment path with a 160-pair query — the per-character
validation is linear in input length by design.

### encode / decode / recompose · typical

| Operation      | avg/iter |
| -------------- | -------: |
| `recomposeURI` |  1.55 µs |
| `decodeWebURL` |  2.94 µs |
| `encodeWebURL` |  2.97 µs |

### ip · reference resolution

| Operation                  | avg/iter |
| -------------------------- | -------: |
| `isIP` ipv4                |  32.4 ns |
| `isIP` reject              |  74.9 ns |
| `isIP` ipv6                | 177.7 ns |
| `removeDotSegments`        | 257.3 ns |
| `resolveURI`               | 453.9 ns |

## Bundle size

| Format | Raw      | Gzip      |
| ------ | -------: | --------: |
| ESM    | 55.75 kB |  12.06 kB |
| CJS    | 56.44 kB |  12.18 kB |

## Why slower than native `URL`

`new URL` is C++-backed and lossy by design: it normalizes, strips default
ports, and discards the empty-vs-absent component distinction. This toolkit
runs a JavaScript RFC-3986 grammar, preserves every component exactly,
validates each component's characters against the RFC tables, and resolves
references through the verbatim §5.2 algorithm. The gap is the cost of
fidelity and zero dependencies, not of unoptimised code — the hot regexps
are compiled once at module load.

## Going-forward target

**No regression > 10 % on any bucket at fixed feature set.** A
string-grammar parser has more V8 inline-cache volatility than a tight
numeric loop; the bar is loose enough to absorb it without flapping CI.
Feature additions that legitimately cost time reset the bar for the
buckets they affect.
