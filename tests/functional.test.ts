import { describe, expect, it } from 'vitest';
import {
  decodeSitemapURL,
  decodeURIString,
  decodeWebURL,
  encodeSitemapURL,
  encodeURIString,
  encodeWebURL,
} from '../src/index.js';
import { http, https, idn, sitemap, unicode, uri } from './fixtures/uris.js';

describe('#functional', () => {
  describe('when using decodeURIString with encodeURIString', () => {
    it('should return the exact same string', () => {
      uri.forEach((string) => {
        expect(decodeURIString(encodeURIString(string))).toBe(string);
      });

      http.forEach((string) => {
        expect(decodeURIString(encodeURIString(string))).toBe(string);
      });

      https.forEach((string) => {
        expect(decodeURIString(encodeURIString(string))).toBe(string);
      });

      idn.forEach((string) => {
        expect(decodeURIString(encodeURIString(string))).toBe(string);
      });

      unicode.forEach((string) => {
        expect(decodeURIString(encodeURIString(string))).toBe(string);
      });
    });
  });

  describe('when using decodeWebURL with encodeWebURL', () => {
    it('should return the exact same string', () => {
      http.forEach((string) => {
        expect(decodeWebURL(encodeWebURL(string))).toBe(string);
      });

      https.forEach((string) => {
        expect(decodeWebURL(encodeWebURL(string))).toBe(string);
      });

      idn.forEach((string) => {
        expect(decodeWebURL(encodeWebURL(string))).toBe(string);
      });

      unicode.forEach((string) => {
        expect(decodeWebURL(encodeWebURL(string))).toBe(string);
      });
    });
  });

  describe('when using decodeSitemapURL with encodeSitemapURL', () => {
    it('should return the exact same string', () => {
      sitemap.forEach((string) => {
        expect(decodeSitemapURL(encodeSitemapURL(string))).toBe(string);
      });
    });
  });
});
