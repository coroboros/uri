import { describe, expect, it } from 'vitest';
import { removeDotSegments, resolveURI } from '../src/resolver/index.js';

describe('#resolver', () => {
  describe('when using removeDotSegments', () => {
    // RFC-3986 §5.2.4 worked examples (verbatim from the specification)
    it('should match the RFC-3986 §5.2.4 worked examples', () => {
      expect(removeDotSegments('/a/b/c/./../../g')).toBe('/a/g');
      expect(removeDotSegments('mid/content=5/../6')).toBe('mid/6');
    });

    it('should handle empty, root and trailing-dot paths', () => {
      expect(removeDotSegments('')).toBe('');
      expect(removeDotSegments('/')).toBe('/');
      expect(removeDotSegments('/a/b/')).toBe('/a/b/');
      expect(removeDotSegments('a/./b')).toBe('a/b');
      expect(removeDotSegments('/.')).toBe('/');
      expect(removeDotSegments('/..')).toBe('/');
      expect(removeDotSegments('.')).toBe('');
      expect(removeDotSegments('..')).toBe('');
      expect(removeDotSegments('/a/.')).toBe('/a/');
      expect(removeDotSegments('/a/..')).toBe('/');
    });

    it('should not treat .foo or g. as dot segments', () => {
      expect(removeDotSegments('/.foo')).toBe('/.foo');
      expect(removeDotSegments('/b/c/g.')).toBe('/b/c/g.');
      expect(removeDotSegments('/b/c/..g')).toBe('/b/c/..g');
    });

    it('should return the empty string for a non-string input', () => {
      // @ts-expect-error runtime guard for non-string input
      expect(removeDotSegments(null)).toBe('');
      // @ts-expect-error runtime guard for non-string input
      expect(removeDotSegments(undefined)).toBe('');
    });
  });

  describe('when using resolveURI', () => {
    const base = 'http://a/b/c/d;p?q';

    // RFC-3986 §5.4.1 — normal examples (verbatim)
    const normal: [string, string][] = [
      ['g:h', 'g:h'],
      ['g', 'http://a/b/c/g'],
      ['./g', 'http://a/b/c/g'],
      ['g/', 'http://a/b/c/g/'],
      ['/g', 'http://a/g'],
      ['//g', 'http://g'],
      ['?y', 'http://a/b/c/d;p?y'],
      ['g?y', 'http://a/b/c/g?y'],
      ['#s', 'http://a/b/c/d;p?q#s'],
      ['g#s', 'http://a/b/c/g#s'],
      ['g?y#s', 'http://a/b/c/g?y#s'],
      [';x', 'http://a/b/c/;x'],
      ['g;x', 'http://a/b/c/g;x'],
      ['g;x?y#s', 'http://a/b/c/g;x?y#s'],
      ['', 'http://a/b/c/d;p?q'],
      ['.', 'http://a/b/c/'],
      ['./', 'http://a/b/c/'],
      ['..', 'http://a/b/'],
      ['../', 'http://a/b/'],
      ['../g', 'http://a/b/g'],
      ['../..', 'http://a/'],
      ['../../', 'http://a/'],
      ['../../g', 'http://a/g'],
    ];

    // RFC-3986 §5.4.2 — abnormal examples (verbatim, strict mode)
    const abnormal: [string, string][] = [
      ['../../../g', 'http://a/g'],
      ['../../../../g', 'http://a/g'],
      ['/./g', 'http://a/g'],
      ['/../g', 'http://a/g'],
      ['g.', 'http://a/b/c/g.'],
      ['.g', 'http://a/b/c/.g'],
      ['g..', 'http://a/b/c/g..'],
      ['..g', 'http://a/b/c/..g'],
      ['./../g', 'http://a/b/g'],
      ['./g/.', 'http://a/b/c/g/'],
      ['g/./h', 'http://a/b/c/g/h'],
      ['g/../h', 'http://a/b/c/h'],
      ['g;x=1/./y', 'http://a/b/c/g;x=1/y'],
      ['g;x=1/../y', 'http://a/b/c/y'],
      ['g?y/./x', 'http://a/b/c/g?y/./x'],
      ['g?y/../x', 'http://a/b/c/g?y/../x'],
      ['g#s/./x', 'http://a/b/c/g#s/./x'],
      ['g#s/../x', 'http://a/b/c/g#s/../x'],
      ['http:g', 'http:g'],
    ];

    it('should resolve every RFC-3986 §5.4.1 normal example', () => {
      for (const [reference, expected] of normal) {
        expect(resolveURI(base, reference)).toBe(expected);
      }
    });

    it('should resolve every RFC-3986 §5.4.2 abnormal example (strict)', () => {
      for (const [reference, expected] of abnormal) {
        expect(resolveURI(base, reference)).toBe(expected);
      }
    });

    it('should preserve a present-empty query/fragment per RFC-3986 §5.3', () => {
      expect(resolveURI(base, 'g?')).toBe('http://a/b/c/g?');
      expect(resolveURI(base, 'g#')).toBe('http://a/b/c/g#');
      expect(resolveURI('http://a/b?x', '')).toBe('http://a/b?x');
    });

    it('should merge against a base with an authority and empty path', () => {
      expect(resolveURI('http://a', 'g')).toBe('http://a/g');
      expect(resolveURI('http://a', './g')).toBe('http://a/g');
    });

    it('should merge against a base whose path has no slash', () => {
      expect(resolveURI('a:b', 'c')).toBe('a:c');
      expect(resolveURI('a:b', './c')).toBe('a:c');
    });

    it('should round-trip a reference carrying every component', () => {
      expect(resolveURI('http://a/b/c', '//h/p?x=1#y')).toBe('http://h/p?x=1#y');
      expect(resolveURI('http://a/b/c', 's:/p?x#y')).toBe('s:/p?x#y');
      expect(resolveURI('http://h/p?q#f', '')).toBe('http://h/p?q');
    });

    it('should return the empty string when the base is not absolute', () => {
      expect(resolveURI('/b/c', 'g')).toBe('');
      expect(resolveURI('//host/path', 'g')).toBe('');
      expect(resolveURI('', 'g')).toBe('');
    });

    it('should return the empty string for a non-string argument', () => {
      // @ts-expect-error runtime guard for non-string input
      expect(resolveURI(null, 'g')).toBe('');
      // @ts-expect-error runtime guard for non-string input
      expect(resolveURI(base, 42)).toBe('');
    });
  });
});
