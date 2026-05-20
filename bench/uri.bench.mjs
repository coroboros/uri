/**
 * Micro-benchmark for @coroboros/uri over representative URI shapes.
 *
 * Usage (from the package root):
 *   pnpm build && node bench/uri.bench.mjs
 *
 * Compares the in-package functions against the native field:
 *   - new URL()        (throwing, WHATWG)
 *   - URL.canParse()   (boolean, WHATWG)
 *
 * The native URL is a different model (WHATWG, not strict RFC-3986); it is
 * shown for scale only, not as an equivalence.
 */
import { bench, do_not_optimize, group, run, summary } from 'mitata';
import {
  checkWebURL,
  decodeWebURL,
  encodeWebURL,
  isIP,
  parseURI,
  recomposeURI,
  removeDotSegments,
  resolveURI,
} from '../dist/index.mjs';

const URIS = {
  simple: 'http://example.com/',
  typical: 'https://user:pass@example.com:8080/over/there?name=ferret&x=1#nose',
  idn: 'https://中文.example.com/over/there?name=ferret#nose',
  ipv6: 'http://[2001:db8::1]:8080/over/there?name=ferret#nose',
  long: `https://example.com/${'segment/'.repeat(40)}?${'k=v&'.repeat(40)}#end`,
};

for (const [label, uri] of Object.entries(URIS)) {
  group(`parse · ${label}`, () => {
    summary(() => {
      bench('parseURI', () => {
        do_not_optimize(parseURI(uri));
      });
      bench('new URL', () => {
        do_not_optimize(new URL(uri));
      });
    });
  });
}

for (const [label, uri] of Object.entries(URIS)) {
  group(`validate · ${label}`, () => {
    summary(() => {
      bench('checkWebURL', () => {
        try {
          do_not_optimize(checkWebURL(uri));
        } catch {}
      });
      bench('URL.canParse', () => {
        do_not_optimize(URL.canParse(uri));
      });
    });
  });
}

group('encode / decode · typical', () => {
  bench('encodeWebURL', () => {
    do_not_optimize(encodeWebURL(URIS.typical));
  });
  bench('decodeWebURL', () => {
    do_not_optimize(decodeWebURL(URIS.typical));
  });
  bench('recomposeURI', () => {
    do_not_optimize(recomposeURI(parseURI(URIS.typical)));
  });
});

group('ip', () => {
  bench('isIP · ipv4', () => {
    do_not_optimize(isIP('192.168.1.1'));
  });
  bench('isIP · ipv6', () => {
    do_not_optimize(isIP('2001:db8::1'));
  });
  bench('isIP · reject', () => {
    do_not_optimize(isIP('999.999.999.999'));
  });
});

group('reference resolution', () => {
  bench('resolveURI', () => {
    do_not_optimize(resolveURI('http://a/b/c/d;p?q', '../../g'));
  });
  bench('removeDotSegments', () => {
    do_not_optimize(removeDotSegments('/a/b/c/./../../g'));
  });
});

await run({ colors: true });
