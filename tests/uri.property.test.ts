import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  decodeURIComponentString,
  encodeURIComponentString,
  parseURI,
  recomposeURI,
  removeDotSegments,
  resolveURI,
} from '../src/index.js';

const runs = { numRuns: 1000 };

describe('#uri — property tests', () => {
  it('parseURI is total — never throws for any string', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        expect(() => parseURI(input)).not.toThrow();
      }),
      runs,
    );
  });

  it('parse → recompose is idempotent on the recomposed href', () => {
    fc.assert(
      fc.property(fc.webUrl({ withQueryParameters: true, withFragments: true }), (url) => {
        const first = parseURI(url).href;

        if (first !== null) {
          expect(parseURI(first).href).toBe(first);
        }
      }),
      runs,
    );
  });

  it('removeDotSegments is idempotent and leaves no . or .. complete segment', () => {
    const segment = fc.constantFrom('a', 'b', '.', '..', 'c', 'd');
    const path = fc
      .tuple(fc.nat({ max: 8 }), fc.array(segment, { maxLength: 12 }), fc.boolean())
      .map(([climb, segs, absolute]) => {
        const body = `${'../'.repeat(climb)}${segs.join('/')}`;

        return absolute ? `/${body}` : body;
      });

    fc.assert(
      fc.property(path, (p) => {
        const once = removeDotSegments(p);

        expect(removeDotSegments(once)).toBe(once);

        for (const seg of once.split('/')) {
          expect(seg === '.' || seg === '..').toBe(false);
        }
      }),
      runs,
    );
  });

  it('resolveURI with an empty reference strips only the fragment (RFC-3986 §5.3)', () => {
    fc.assert(
      fc.property(
        fc.webUrl({ withQueryParameters: true, withFragments: false }),
        fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
        (url, frag) => {
          const base = frag === undefined ? url : `${url}#${frag}`;

          expect(resolveURI(base, '')).toBe(url);
        },
      ),
      runs,
    );
  });

  it('resolveURI never throws and returns a string for any reference', () => {
    fc.assert(
      fc.property(fc.webUrl(), fc.string(), (base, reference) => {
        const resolved = resolveURI(base, reference);

        expect(typeof resolved).toBe('string');
      }),
      runs,
    );
  });

  it('component encode then decode round-trips an arbitrary string', () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const encoded = encodeURIComponentString(raw, { type: 'path' });

        expect(decodeURIComponentString(encoded)).toBe(raw);
      }),
      runs,
    );
  });

  it('recomposeURI of parsed components equals the parsed href', () => {
    fc.assert(
      fc.property(fc.webUrl({ withQueryParameters: true, withFragments: true }), (url) => {
        const parsed = parseURI(url);

        if (parsed.href !== null) {
          expect(
            recomposeURI({
              scheme: parsed.scheme,
              userinfo: parsed.userinfo,
              host: parsed.host,
              port: parsed.port,
              path: parsed.path,
              query: parsed.query,
              fragment: parsed.fragment,
            }),
          ).toBe(parsed.href);
        }
      }),
      runs,
    );
  });
});
