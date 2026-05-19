import { describe, expect, it } from 'vitest';
import { maxLengthURL, maxPortInteger, minPortInteger } from '../src/config/index.js';
import {
  encodeSitemapURL,
  encodeURIComponentString,
  encodeURIString,
  encodeWebURL,
} from '../src/encoders/index.js';
import {
  AZ,
  allowedPathCharsToEncode,
  allowedQueryOrFragmentCharsToEncode,
  allowedSitemapPathCharsToEncode,
  allowedSitemapQueryOrFragmentCharsToEncode,
  allowedSitemapUserinfoCharsToEncode,
  allowedUserinfoCharsToEncode,
  az,
  digits,
  disallowed,
  disallowedOtherChars,
} from './fixtures/chars.js';

import { expectThrowWithCode } from './helpers.js';

describe('#encoders', () => {
  describe('when using encodeURIComponentString', () => {
    it('should return an empty string when uri is not a string', () => {
      expect(encodeURIComponentString()).toBe('');
      expect(encodeURIComponentString(undefined)).toBe('');
      expect(encodeURIComponentString(null)).toBe('');
      expect(encodeURIComponentString(NaN)).toBe('');
      expect(encodeURIComponentString([])).toBe('');
      expect(encodeURIComponentString(new Error('error'))).toBe('');
      expect(encodeURIComponentString(5)).toBe('');
      expect(encodeURIComponentString(true)).toBe('');
      expect(encodeURIComponentString(false)).toBe('');
      expect(encodeURIComponentString({})).toBe('');
    });

    it('should return a lowercased string only if lowercase is true', () => {
      expect(encodeURIComponentString(az)).toBe(az);
      expect(encodeURIComponentString('ABCDEF')).toBe('ABCDEF');
      expect(encodeURIComponentString('ABcDEF')).toBe('ABcDEF');
      expect(encodeURIComponentString('aBcDEF')).toBe('aBcDEF');
      expect(encodeURIComponentString('aBcDEf')).toBe('aBcDEf');
      expect(encodeURIComponentString('abcdef')).toBe('abcdef');

      expect(encodeURIComponentString(AZ, { lowercase: true })).toBe(az);
      expect(encodeURIComponentString('ABCDEF', { lowercase: true })).toBe('abcdef');
      expect(encodeURIComponentString('ABcDEF', { lowercase: true })).toBe('abcdef');
      expect(encodeURIComponentString('aBcDEF', { lowercase: true })).toBe('abcdef');
      expect(encodeURIComponentString('aBcDEf', { lowercase: true })).toBe('abcdef');
      expect(encodeURIComponentString('abcdef', { lowercase: true })).toBe('abcdef');
    });

    it('should return the exact same uppercased characters if lowercase is false', () => {
      expect(encodeURIComponentString(AZ, { lowercase: false })).toBe(AZ);
      expect(encodeURIComponentString('ABCDEF', { lowercase: false })).toBe('ABCDEF');
      expect(encodeURIComponentString('ABcDEF', { lowercase: false })).toBe('ABcDEF');
      expect(encodeURIComponentString('aBcDEF', { lowercase: false })).toBe('aBcDEF');
      expect(encodeURIComponentString('aBcDEf', { lowercase: false })).toBe('aBcDEf');
      expect(encodeURIComponentString('abcdef', { lowercase: false })).toBe('abcdef');
    });

    it('should return a string with percent-encoded characters if no type but based on an outdated standard', () => {
      expect(encodeURIComponentString("A#/?@[]&'*")).toBe("A%23%2F%3F%40%5B%5D%26'*");
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'userinfo' })).toBe(
        "A%23%2F%3F%40%5B%5D&'*",
      );
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'path' })).toBe("A%23/%3F@%5B%5D&'*");
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'query' })).toBe("A%23/?@%5B%5D&'*");
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'fragment' })).toBe("A%23/?@%5B%5D&'*");
    });

    it('should return a string with the exact same characters if allowed in userinfo', () => {
      expect(encodeURIComponentString(az, { type: 'userinfo' })).toBe(az);
      expect(encodeURIComponentString(AZ, { type: 'userinfo' })).toBe(AZ);
      expect(encodeURIComponentString(digits, { type: 'userinfo' })).toBe(digits);
      expect(encodeURIComponentString(allowedUserinfoCharsToEncode, { type: 'userinfo' })).toBe(
        allowedUserinfoCharsToEncode,
      );

      expect(
        encodeURIComponentString(az, { type: 'userinfo', lowercase: false, sitemap: false }),
      ).toBe(az);
      expect(
        encodeURIComponentString(AZ, { type: 'userinfo', lowercase: false, sitemap: false }),
      ).toBe(AZ);
      expect(
        encodeURIComponentString(digits, { type: 'userinfo', lowercase: false, sitemap: false }),
      ).toBe(digits);
      expect(
        encodeURIComponentString(allowedUserinfoCharsToEncode, {
          type: 'userinfo',
          lowercase: false,
          sitemap: false,
        }),
      ).toBe(allowedUserinfoCharsToEncode);
    });

    it('should return a string with the exact same characters if allowed in path', () => {
      expect(encodeURIComponentString(az, { type: 'path' })).toBe(az);
      expect(encodeURIComponentString(AZ, { type: 'path' })).toBe(AZ);
      expect(encodeURIComponentString(digits, { type: 'path' })).toBe(digits);
      expect(encodeURIComponentString(allowedPathCharsToEncode, { type: 'path' })).toBe(
        allowedPathCharsToEncode,
      );

      expect(encodeURIComponentString(az, { type: 'path', lowercase: false, sitemap: false })).toBe(
        az,
      );
      expect(encodeURIComponentString(AZ, { type: 'path', lowercase: false, sitemap: false })).toBe(
        AZ,
      );
      expect(
        encodeURIComponentString(digits, { type: 'path', lowercase: false, sitemap: false }),
      ).toBe(digits);
      expect(
        encodeURIComponentString(allowedPathCharsToEncode, {
          type: 'path',
          lowercase: false,
          sitemap: false,
        }),
      ).toBe(allowedPathCharsToEncode);
    });

    it('should return a string with the exact same characters if allowed in query', () => {
      expect(encodeURIComponentString(az, { type: 'query' })).toBe(az);
      expect(encodeURIComponentString(AZ, { type: 'query' })).toBe(AZ);
      expect(encodeURIComponentString(digits, { type: 'query' })).toBe(digits);
      expect(encodeURIComponentString(allowedQueryOrFragmentCharsToEncode, { type: 'query' })).toBe(
        allowedQueryOrFragmentCharsToEncode,
      );

      expect(
        encodeURIComponentString(az, { type: 'query', lowercase: false, sitemap: false }),
      ).toBe(az);
      expect(
        encodeURIComponentString(AZ, { type: 'query', lowercase: false, sitemap: false }),
      ).toBe(AZ);
      expect(
        encodeURIComponentString(digits, { type: 'query', lowercase: false, sitemap: false }),
      ).toBe(digits);
      expect(
        encodeURIComponentString(allowedQueryOrFragmentCharsToEncode, {
          type: 'query',
          lowercase: false,
          sitemap: false,
        }),
      ).toBe(allowedQueryOrFragmentCharsToEncode);
    });

    it('should return a string with the exact same characters if allowed in fragment', () => {
      expect(encodeURIComponentString(az, { type: 'fragment' })).toBe(az);
      expect(encodeURIComponentString(AZ, { type: 'fragment' })).toBe(AZ);
      expect(encodeURIComponentString(digits, { type: 'fragment' })).toBe(digits);
      expect(encodeURIComponentString(allowedQueryOrFragmentCharsToEncode, { type: 'query' })).toBe(
        allowedQueryOrFragmentCharsToEncode,
      );

      expect(
        encodeURIComponentString(az, { type: 'fragment', lowercase: false, sitemap: false }),
      ).toBe(az);
      expect(
        encodeURIComponentString(AZ, { type: 'fragment', lowercase: false, sitemap: false }),
      ).toBe(AZ);
      expect(
        encodeURIComponentString(digits, { type: 'fragment', lowercase: false, sitemap: false }),
      ).toBe(digits);
      expect(
        encodeURIComponentString(allowedQueryOrFragmentCharsToEncode, {
          type: 'fragment',
          lowercase: false,
          sitemap: false,
        }),
      ).toBe(allowedQueryOrFragmentCharsToEncode);
    });

    it('should return a string with the exact same characters if allowed in userinfo and sitemap', () => {
      expect(
        encodeURIComponentString(allowedSitemapUserinfoCharsToEncode.replace('&', ''), {
          type: 'userinfo',
          sitemap: true,
        }),
      ).toBe(allowedSitemapUserinfoCharsToEncode.replace('&', ''));
    });

    it('should return a string with the exact same characters if allowed in path and sitemap', () => {
      expect(
        encodeURIComponentString(allowedSitemapPathCharsToEncode.replace('&', ''), {
          type: 'path',
          sitemap: true,
        }),
      ).toBe(allowedSitemapPathCharsToEncode.replace('&', ''));
    });

    it('should return a string with the exact same characters if allowed in query and sitemap', () => {
      expect(
        encodeURIComponentString(allowedSitemapQueryOrFragmentCharsToEncode.replace('&', ''), {
          type: 'query',
          sitemap: true,
        }),
      ).toBe(allowedSitemapQueryOrFragmentCharsToEncode.replace('&', ''));
    });

    it('should return a string with the exact same characters if allowed in fragment and sitemap', () => {
      expect(
        encodeURIComponentString(allowedSitemapQueryOrFragmentCharsToEncode.replace('&', ''), {
          type: 'fragment',
          sitemap: true,
        }),
      ).toBe(allowedSitemapQueryOrFragmentCharsToEncode.replace('&', ''));
    });

    it('should return a string with percent-encoded characters if not allowed, by default', () => {
      expect(encodeURIComponentString(disallowed)).toBe('%5C%5E%60%7B%7C%7D%3C%3E');
      expect(encodeURIComponentString('<>')).toBe('%3C%3E');
      expect(encodeURIComponentString(disallowedOtherChars)).toBe(
        '%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );

      expect(encodeURIComponentString(disallowed, { sitemap: false })).toBe(
        '%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeURIComponentString('<>', { sitemap: false })).toBe('%3C%3E');
      expect(encodeURIComponentString(disallowedOtherChars, { sitemap: false })).toBe(
        '%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );
    });

    it('should return a string with specific escaped and percent-encoded characters when sitemap is true', () => {
      expect(encodeURIComponentString(AZ, { sitemap: true })).toBe(az);
      expect(encodeURIComponentString(disallowed, { sitemap: true })).toBe(
        '%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeURIComponentString("&'*", { sitemap: true })).toBe('&amp;&apos;%2A');
      expect(encodeURIComponentString(disallowedOtherChars, { sitemap: true })).toBe(
        '%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );

      expect(encodeURIComponentString("A#/?@[]&'*", { sitemap: true })).toBe(
        'a%23%2F%3F%40%5B%5D&amp;&apos;%2A',
      );
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'userinfo', sitemap: true })).toBe(
        'a%23%2F%3F%40%5B%5D&amp;&apos;%2A',
      );
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'path', sitemap: true })).toBe(
        'a%23/%3F@%5B%5D&amp;&apos;%2A',
      );
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'query', sitemap: true })).toBe(
        'a%23/?@%5B%5D&amp;&apos;%2A',
      );
      expect(encodeURIComponentString("A#/?@[]&'*", { type: 'fragment', sitemap: true })).toBe(
        'a%23/?@%5B%5D&amp;&apos;%2A',
      );
    });
  });

  describe('when using encodeURIString that uses checkURISyntax and encodeURIComponentString', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => encodeURIString(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeURIString({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => encodeURIString('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeURIString('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeURIString(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => encodeURIString('htép://example.com'), 'URI_INVALID_SCHEME_CHAR');
      expectThrowWithCode(() => encodeURIString('ht°p://example.com'), 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error if scheme is not http or https when option is web or sitemap', () => {
      expectThrowWithCode(
        () => encodeURIString('httpp://www.example.com', { web: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('httpp://www.example.com', { web: true, sitemap: false }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('httpp://www.example.com', { web: false, sitemap: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('httpp://www.example.com', { sitemap: true }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () => encodeURIString('htp://www.example.com', { web: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('htp://www.example.com', { web: true, sitemap: false }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('htp://www.example.com', { web: false, sitemap: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => encodeURIString('htp://www.example.com', { sitemap: true }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should not throw an uri error if scheme is not http or https when option is not web or sitemap', () => {
      expect(() => encodeURIString('httpp://www.example.com')).not.toThrow();
      expect(() => encodeURIString('httpp://www.example.com', { web: false })).not.toThrow();
      expect(() =>
        encodeURIString('httpp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('httpp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => encodeURIString('httpp://www.example.com', { sitemap: false })).not.toThrow();

      expect(() => encodeURIString('htp://www.example.com')).not.toThrow();
      expect(() => encodeURIString('htp://www.example.com', { web: false })).not.toThrow();
      expect(() =>
        encodeURIString('htp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('htp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => encodeURIString('htp://www.example.com', { sitemap: false })).not.toThrow();
    });

    it('should throw an uri error if host to encode is not valid', () => {
      expectThrowWithCode(() => encodeURIString('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => encodeURIString('http://com.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to encode is not an integer', () => {
      expectThrowWithCode(() => encodeURIString('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if port to encode is out of range', () => {
      expectThrowWithCode(
        () => encodeURIString(`http://example.com:${minPortInteger - 1}`),
        'URI_INVALID_PORT',
      );
      expectThrowWithCode(
        () => encodeURIString(`http://example.com:${maxPortInteger + 1}`),
        'URI_INVALID_PORT',
      );
    });

    it('should not throw an uri error if port to encode is in range', () => {
      expect(() => encodeURIString(`http://example.com:${minPortInteger}`)).not.toThrow();
      expect(() => encodeURIString(`http://example.com:${maxPortInteger}`)).not.toThrow();
    });

    it('should throw an uri error if authority is null and option is web or sitemap', () => {
      expectThrowWithCode(
        () => encodeURIString('http:isbn:0-486-27557-4', { web: true, sitemap: false }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeURIString('http:isbn:0-486-27557-4', { web: true, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeURIString('https:isbn:0-486-27557-4', { web: true, sitemap: false }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeURIString('http:isbn:0-486-27557-4', { web: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeURIString('https:isbn:0-486-27557-4', { sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error if authority is null and option is not web or sitemap', () => {
      expect(() => encodeURIString('https:isbn:0-486-27557-4')).not.toThrow();
      expect(() =>
        encodeURIString('http:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => encodeURIString('http:isbn:0-486-27557-4', { web: false })).not.toThrow();
      expect(() => encodeURIString('https:isbn:0-486-27557-4', { sitemap: false })).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase by default', () => {
      expect(() => encodeURIString('http://example.com/OVER/there')).not.toThrow();
      expect(() => encodeURIString('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => encodeURIString('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => encodeURIString('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => encodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();

      expect(() => encodeURIString('http://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => encodeURIString('HTTP://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://EXAMPLE.com/OVER/there', { web: true })).not.toThrow();
      expect(() =>
        encodeURIString('http://USER:PASS@example.com/OVER/there', { web: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { web: true }),
      ).not.toThrow();

      expect(() =>
        encodeURIString('http://example.com/OVER/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://example.com/OVER/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://EXAMPLE.com/OVER/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://USER:PASS@example.com/OVER/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { sitemap: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme', () => {
      expect(() =>
        encodeURIString('FTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('FTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('FTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();

      expect(() =>
        encodeURIString('HTTP://example.com/OVER/there', { web: true, lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { web: true, lowercase: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://user:pass@example.com', { web: true, lowercase: true }),
      ).not.toThrow();

      expect(() =>
        encodeURIString('HTTP://example.com/OVER/there', { sitemap: true, lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', {
          sitemap: true,
          lowercase: false,
        }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('HTTP://user:pass@example.com', { sitemap: true, lowercase: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters', () => {
      expect(() => encodeURIString("http://example.com/OVER/&'*there")).not.toThrow();
      expect(() =>
        encodeURIString("http://example.com/OVER/&'*there", { web: false }),
      ).not.toThrow();
      expect(() =>
        encodeURIString("http://example.com/OVER/&'*there", { sitemap: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters when sitemap is true', () => {
      expect(() =>
        encodeURIString("http://example.com/OVER/&'*there", { sitemap: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has invalid characters that should be percent-encoded whether web or sitemap is true or not', () => {
      expect(() => encodeURIString('ftp://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeURIString('ftp://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/over/t}ere')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/over|there')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/over/there')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/over/thère')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/over/there€')).not.toThrow();
      expect(() => encodeURIString('ftp://example.com/oveùr/there')).not.toThrow();

      expect(() =>
        encodeURIString('http://user:pass@example.com/path{', { web: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://user:pass@example.com/path{', { web: true }),
      ).not.toThrow();
      expect(() => encodeURIString('http://example.com/over/t}ere', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://example.com/over|there', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://example.com/over/there', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://example.com/over/thère', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://example.com/over/there€', { web: true })).not.toThrow();
      expect(() => encodeURIString('http://example.com/oveùr/there', { web: true })).not.toThrow();

      expect(() =>
        encodeURIString('http://user:pass@example.com/path{', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://user:pass@example.com/path{', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/over/t}ere', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/over|there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/over/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/over/thère', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/over/there€', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        encodeURIString('http://example.com/oveùr/there', { sitemap: true }),
      ).not.toThrow();
    });

    it('should return a lowercased uri only for scheme and host by default', () => {
      expect(encodeURIString('FTP://WWW.EXAMPLE.COM./Path')).toBe('ftp://www.example.com./Path');
      expect(encodeURIString('HTTP://WWW.EXAMPLE.COM.', { web: true })).toBe(
        'http://www.example.com./',
      );
      expect(encodeURIString('HTTP://WWW.EXAMPLE.COM.', { sitemap: true })).toBe(
        'http://www.example.com./',
      );
    });

    it('should return a lowercased uri if lowercase is true', () => {
      expect(encodeURIString('urn:Over:There')).toBe('urn:Over:There');
      expect(encodeURIString('urn:Over:There', { lowercase: true })).toBe('urn:over:there');
      expect(encodeURIString('urn:Over:There', { lowercase: false })).toBe('urn:Over:There');
      expect(
        encodeURIString('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor', { lowercase: true }),
      ).toBe('https://www.xn--fiq228c.com./over/there?a=b&b=c#anchor');
      expect(
        encodeURIString(`HTTP://${AZ}@www.EXAMPLE.com./${AZ}?${AZ}#${AZ}`, { lowercase: true }),
      ).toBe(`http://${az}@www.example.com./${az}?${az}#${az}`);
    });

    it('should return an uri with uppercase letters if lowercase is false except scheme and host automatically put in lowercase to be RFC-3986 compliant', () => {
      expect(encodeURIString('ftp://WWW.EXAMPLE.COM./Path')).toBe('ftp://www.example.com./Path');
      expect(encodeURIString('ftp://WWW.EXAMPLE.COM.', { lowercase: false })).toBe(
        'ftp://www.example.com./',
      );
      expect(encodeURIString('http://WWW.EXAmPLE.COM.', { web: true, lowercase: false })).toBe(
        'http://www.example.com./',
      );
      expect(encodeURIString('https://WWW.EXaMPLE.COM.', { sitemap: true, lowercase: false })).toBe(
        'https://www.example.com./',
      );
      expect(
        encodeURIString(`HTTP://${AZ}@www.EXAMPLE.com./${AZ}?${AZ}#${AZ}`, { lowercase: false }),
      ).toBe(`http://${AZ}@www.example.com./${AZ}?${AZ}#${AZ}`);

      expect(encodeURIString('ftp://WWW.EXAMPLE.COM./Over/There', { lowercase: false })).toBe(
        'ftp://www.example.com./Over/There',
      );
      expect(
        encodeURIString('http://WWW.EXAmPLE.COM./Over/There?a=B#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('http://www.example.com./Over/There?a=B#Anchor');
      expect(
        encodeURIString('https://WWW.EXaMPLE.COM./Over/There?a=B&b=c#Anchor', {
          sitemap: true,
          lowercase: false,
        }),
      ).toBe('https://www.example.com./over/there?a=b&amp;b=c#anchor');

      expect(
        encodeURIString('https://WWW.中文.COM./Over/There?a=B&b=c#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor');
      expect(
        encodeURIString('https://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor');
    });

    it('should return a string with the exact same characters if allowed in userinfo', () => {
      expect(encodeURIString(`http://${allowedUserinfoCharsToEncode}@host.com`)).toBe(
        `http://${allowedUserinfoCharsToEncode}@host.com/`,
      );
    });

    it('should return a string with the exact same characters if allowed in path', () => {
      expect(encodeURIString(`urn:isbn:0-486-27557-4/${allowedPathCharsToEncode}`)).toBe(
        `urn:isbn:0-486-27557-4/${allowedPathCharsToEncode}`,
      );
    });

    it('should return a string with the exact same characters if allowed in query', () => {
      expect(encodeURIString(`http://host.com/path?${allowedQueryOrFragmentCharsToEncode}`)).toBe(
        `http://host.com/path?${allowedQueryOrFragmentCharsToEncode}`,
      );
    });

    it('should return a string with the exact same characters if allowed in fragment', () => {
      expect(
        encodeURIString(`http://host.com/path?a=b#${allowedQueryOrFragmentCharsToEncode}`),
      ).toBe(`http://host.com/path?a=b#${allowedQueryOrFragmentCharsToEncode}`);
    });

    it('should return a string with the exact same characters if allowed in userinfo and sitemap', () => {
      expect(
        encodeURIString(`http://${allowedSitemapUserinfoCharsToEncode.replace('&', '')}@host.com`, {
          sitemap: true,
        }),
      ).toBe(`http://${allowedSitemapUserinfoCharsToEncode.replace('&', '')}@host.com/`);
    });

    it('should return a string with the exact same characters if allowed in path and sitemap', () => {
      expect(
        encodeURIString(`http://example.com/${allowedSitemapPathCharsToEncode.replace('&', '')}`, {
          sitemap: true,
        }),
      ).toBe(`http://example.com/${allowedSitemapPathCharsToEncode.replace('&', '')}`);
    });

    it('should return a string with the exact same characters if allowed in query and sitemap', () => {
      expect(
        encodeURIString(
          `http://host.com/path?${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
          { sitemap: true },
        ),
      ).toBe(`http://host.com/path?${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`);
    });

    it('should return a string with the exact same characters if allowed in fragment and sitemap', () => {
      expect(
        encodeURIString(
          `http://host.com/path?a=b#${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
          { sitemap: true },
        ),
      ).toBe(
        `http://host.com/path?a=b#${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
      );
    });

    it('should return a string with percent-encoded characters if not allowed, by default', () => {
      expect(encodeURIString(`http://example.com/${disallowed}`)).toBe(
        'http://example.com/%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeURIString('http://example.com/<>')).toBe('http://example.com/%3C%3E');
      expect(encodeURIString(`http://example.com/${disallowedOtherChars}`)).toBe(
        'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );

      expect(encodeURIString(`http://example.com/${disallowed}`, { web: false })).toBe(
        'http://example.com/%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeURIString('http://example.com/<>', { web: false })).toBe(
        'http://example.com/%3C%3E',
      );
      expect(encodeURIString(`http://example.com/${disallowedOtherChars}`, { web: false })).toBe(
        'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );

      expect(encodeURIString(`http://example.com/${disallowed}`, { sitemap: false })).toBe(
        'http://example.com/%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeURIString('http://example.com/<>', { sitemap: false })).toBe(
        'http://example.com/%3C%3E',
      );
      expect(
        encodeURIString(`http://example.com/${disallowedOtherChars}`, { sitemap: false }),
      ).toBe('http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3');
    });

    it('should return a string with percent-encoded characters if not allowed in userinfo', () => {
      expect(encodeURIString(`http://é&'*@host.com/`)).toBe("http://%C3%A9&'*@host.com/");
    });

    it('should return a string with percent-encoded characters if not allowed in path', () => {
      expect(encodeURIString(`http://host.com/A@[]&'*`)).toBe("http://host.com/A@%5B%5D&'*");
    });

    it('should return a string with percent-encoded characters if not allowed in query', () => {
      expect(encodeURIString(`http://host.com/path?A@[]&'*`)).toBe(
        "http://host.com/path?A@%5B%5D&'*",
      );
    });

    it('should return a string with percent-encoded characters if not allowed in fragment', () => {
      expect(encodeURIString(`http://host.com/path?a=b#A#/?@[]&'*`)).toBe(
        "http://host.com/path?a=b#A%23/?@%5B%5D&'*",
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in userinfo and sitemap', () => {
      expect(encodeURIString(`http://é&'*@host.com/`, { sitemap: true })).toBe(
        'http://%C3%A9&amp;&apos;%2A@host.com/',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in path and sitemap', () => {
      expect(encodeURIString(`http://host.com/A@[]&'*`, { sitemap: true })).toBe(
        'http://host.com/a@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in query and sitemap', () => {
      expect(encodeURIString(`http://host.com/path?A@[]&'*`, { sitemap: true })).toBe(
        'http://host.com/path?a@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in fragment and sitemap', () => {
      expect(encodeURIString(`http://host.com/path?a=b#A#/?@[]&'*`, { sitemap: true })).toBe(
        'http://host.com/path?a=b#a%23/?@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return the expected uri encoded string with the punycoded host', () => {
      expect(encodeURIString('ftp://exèmple.com:8080')).toBe('ftp://xn--exmple-4ua.com:8080/');
      expect(encodeURIString('ftp://exèmple.com/pâth')).toBe('ftp://xn--exmple-4ua.com/p%C3%A2th');
      expect(encodeURIString('ftp://中文.com.')).toBe('ftp://xn--fiq228c.com./');

      expect(encodeURIString('http://exèmple.com:8080', { web: true })).toBe(
        'http://xn--exmple-4ua.com:8080/',
      );
      expect(encodeURIString('http://exèmple.com/pâth', { web: true })).toBe(
        'http://xn--exmple-4ua.com/p%C3%A2th',
      );
      expect(encodeURIString('http://中文.com.', { web: true })).toBe('http://xn--fiq228c.com./');

      expect(encodeURIString('http://exèmple.com:8080', { sitemap: true })).toBe(
        'http://xn--exmple-4ua.com:8080/',
      );
      expect(encodeURIString('http://exèmple.com/pâth', { sitemap: true })).toBe(
        'http://xn--exmple-4ua.com/p%C3%A2th',
      );
      expect(encodeURIString('http://中文.com.', { sitemap: true })).toBe(
        'http://xn--fiq228c.com./',
      );
    });

    it('should return the expected uri encoded string', () => {
      expect(encodeURIString('foo://user:pâss@exèmple.com:8080/pâth')).toBe(
        'foo://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th',
      );
      expect(encodeURIString('foo://user:pa$$@example.com/')).toBe('foo://user:pa$$@example.com/');
      expect(encodeURIString('foo://usèr:pass@example.com/')).toBe(
        'foo://us%C3%A8r:pass@example.com/',
      );
      expect(encodeURIString('foo://example.com/pâth')).toBe('foo://example.com/p%C3%A2th');

      expect(encodeURIString('http://user:pâss@exèmple.com:8080/pâth', { sitemap: true })).toBe(
        'http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th',
      );
      expect(encodeURIString('http://user:pa$$@example.com/', { sitemap: true })).toBe(
        'http://user:pa$$@example.com/',
      );
      expect(encodeURIString('http://usèr:pass@example.com/', { sitemap: true })).toBe(
        'http://us%C3%A8r:pass@example.com/',
      );
      expect(encodeURIString('http://example.com/pâth', { sitemap: true })).toBe(
        'http://example.com/p%C3%A2th',
      );

      expect(encodeURIString('http://example.com/there?a=5&b=11', { sitemap: true })).toBe(
        'http://example.com/there?a=5&amp;b=11',
      );
    });

    it('should throw an uri error if url is more than the maximal allowed length when web or sitemap is true only', () => {
      expectThrowWithCode(
        () =>
          encodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { sitemap: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expectThrowWithCode(
        () =>
          encodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { web: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expectThrowWithCode(
        () =>
          encodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { sitemap: true, web: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expect(() =>
        encodeURIString(
          `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
        ),
      ).not.toThrow();
    });
  });

  describe('when using encodeWebURL that uses encodeURIString with web option to true', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => encodeWebURL(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeWebURL({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => encodeWebURL('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeWebURL('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeWebURL(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(() => encodeWebURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => encodeWebURL('htp://www.example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if host to encode is not valid', () => {
      expectThrowWithCode(() => encodeWebURL('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => encodeWebURL('http://com.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to encode is not valid', () => {
      expectThrowWithCode(() => encodeWebURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(() => encodeWebURL('http:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
      expectThrowWithCode(() => encodeWebURL('https:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
    });

    it('should not throw an uri error if uri to encode has letters in uppercase by default', () => {
      expect(() => encodeWebURL('http://example.com/OVER/there')).not.toThrow();
      expect(() => encodeWebURL('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => encodeWebURL('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => encodeWebURL('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => encodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme when lowercase is false', () => {
      expect(() =>
        encodeWebURL('HTTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeWebURL('HTTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters', () => {
      expect(() => encodeWebURL("http://example.com/OVER/&'*")).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has invalid characters that should be percent-encoded', () => {
      expect(() => encodeWebURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeWebURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/over/t}ere')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/over|there')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/over/there')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/over/thère')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/over/there€')).not.toThrow();
      expect(() => encodeWebURL('http://example.com/oveùr/there')).not.toThrow();
    });

    it('should return an uri with uppercase letters if lowercase is false except host automatically put in lowercase to be RFC-3986 compliant', () => {
      expect(encodeWebURL('http://WWW.EXAmPLE.COM.')).toBe('http://www.example.com./');
      expect(encodeWebURL('https://WWW.EXaMPLE.COM.', { lowercase: false })).toBe(
        'https://www.example.com./',
      );
      expect(
        encodeWebURL('http://USER:pass@WWW.EXAmPLE.COM./Over/There?a=B#Anchor', {
          lowercase: false,
        }),
      ).toBe('http://USER:pass@www.example.com./Over/There?a=B#Anchor');
    });

    it('should return an uri with lowercase letters if lowercase is true', () => {
      expect(
        encodeWebURL(`http://${AZ}@WWW.EXAmPLE.COM./${AZ}?${AZ}#${AZ}`, { lowercase: true }),
      ).toBe(`http://${az}@www.example.com./${az}?${az}#${az}`);
    });

    it('should return a string with the exact same characters if allowed in userinfo', () => {
      expect(encodeWebURL(`http://${allowedUserinfoCharsToEncode}@host.com`)).toBe(
        `http://${allowedUserinfoCharsToEncode}@host.com/`,
      );
    });

    it('should return a string with the exact same characters if allowed in path', () => {
      expect(encodeWebURL(`http://example.com/${allowedPathCharsToEncode}`)).toBe(
        `http://example.com/${allowedPathCharsToEncode}`,
      );
    });

    it('should return a string with the exact same characters if allowed in query', () => {
      expect(encodeWebURL(`http://host.com/path?${allowedQueryOrFragmentCharsToEncode}`)).toBe(
        `http://host.com/path?${allowedQueryOrFragmentCharsToEncode}`,
      );
    });

    it('should return a string with the exact same characters if allowed in fragment', () => {
      expect(encodeWebURL(`http://host.com/path?a=b#${allowedQueryOrFragmentCharsToEncode}`)).toBe(
        `http://host.com/path?a=b#${allowedQueryOrFragmentCharsToEncode}`,
      );
    });

    it('should return a string with percent-encoded characters if not allowed in userinfo', () => {
      expect(encodeWebURL(`http://é&'*@host.com/`)).toBe("http://%C3%A9&'*@host.com/");
    });

    it('should return a string with percent-encoded characters if not allowed in path', () => {
      expect(encodeWebURL(`http://host.com/A@[]&'*`)).toBe("http://host.com/A@%5B%5D&'*");
    });

    it('should return a string with percent-encoded characters if not allowed in query', () => {
      expect(encodeWebURL(`http://host.com/path?A@[]&'*`)).toBe("http://host.com/path?A@%5B%5D&'*");
    });

    it('should return a string with percent-encoded characters if not allowed in fragment', () => {
      expect(encodeWebURL(`http://host.com/path?a=b#A#/?@[]&'*`)).toBe(
        "http://host.com/path?a=b#A%23/?@%5B%5D&'*",
      );
    });

    it('should return the expected url encoded string with the punycoded host', () => {
      expect(encodeWebURL('http://exèmple.com:8080')).toBe('http://xn--exmple-4ua.com:8080/');
      expect(encodeWebURL('http://exèmple.com/pâth')).toBe('http://xn--exmple-4ua.com/p%C3%A2th');
      expect(encodeWebURL('http://中文.com.')).toBe('http://xn--fiq228c.com./');
    });

    it('should return the expected url encoded string with the userinfo encoded', () => {
      expect(encodeWebURL('http://user:pâss@exèmple.com:8080/pâth')).toBe(
        'http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th',
      );
      expect(encodeWebURL('http://usèr:pass@example.com/')).toBe(
        'http://us%C3%A8r:pass@example.com/',
      );
    });

    it('should return the expected url encoded string', () => {
      expect(encodeWebURL('http://user:pâss@exèmple.com:8080/pâth')).toBe(
        'http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th',
      );
      expect(encodeWebURL('http://user:pa$$@example.com/')).toBe('http://user:pa$$@example.com/');
      expect(encodeWebURL('http://usèr:pass@example.com/')).toBe(
        'http://us%C3%A8r:pass@example.com/',
      );
      expect(encodeWebURL('http://example.com/pâth')).toBe('http://example.com/p%C3%A2th');
    });

    it('should throw an uri error if url is more than the maximal allowed length when web or sitemap is true only', () => {
      expectThrowWithCode(
        () =>
          encodeWebURL(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
          ),
        'URI_MAX_LENGTH_URL',
      );
    });
  });

  describe('when using encodeSitemapURL that uses encodeURIString with sitemap option to true', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => encodeSitemapURL(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => encodeSitemapURL({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => encodeSitemapURL('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeSitemapURL('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => encodeSitemapURL(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(() => encodeSitemapURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => encodeSitemapURL('htp://www.example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if host to encode is not valid', () => {
      expectThrowWithCode(() => encodeSitemapURL('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => encodeSitemapURL('http://com.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to encode is not valid', () => {
      expectThrowWithCode(() => encodeSitemapURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(
        () => encodeSitemapURL('http:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => encodeSitemapURL('https:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error if uri to encode has letters in uppercase by default', () => {
      expect(() => encodeSitemapURL('http://example.com/OVER/there')).not.toThrow();
      expect(() => encodeSitemapURL('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => encodeSitemapURL('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => encodeSitemapURL('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => encodeSitemapURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme when lowercase is false', () => {
      expect(() =>
        encodeSitemapURL('HTTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeSitemapURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        encodeSitemapURL('HTTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has special sitemap characters', () => {
      expect(() => encodeSitemapURL("http://example.com/OVER/&'*")).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has invalid characters that should be percent-encoded', () => {
      expect(() => encodeSitemapURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeSitemapURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/over/t}ere')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/over|there')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/over/there')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/over/thère')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/over/there€')).not.toThrow();
      expect(() => encodeSitemapURL('http://example.com/oveùr/there')).not.toThrow();
    });

    it('should always return an uri with lowercase letters', () => {
      expect(encodeSitemapURL('https://WWW.EXaMPLE.COM.')).toBe('https://www.example.com./');
      expect(encodeSitemapURL('http://USER:pass@WWW.EXAmPLE.COM./Over/There?a=B#Anchor')).toBe(
        'http://user:pass@www.example.com./over/there?a=b#anchor',
      );
    });

    it('should return a string with the exact same characters if allowed in userinfo and sitemap', () => {
      expect(
        encodeSitemapURL(`http://${allowedSitemapUserinfoCharsToEncode.replace('&', '')}@host.com`),
      ).toBe(`http://${allowedSitemapUserinfoCharsToEncode.replace('&', '')}@host.com/`);
    });

    it('should return a string with the exact same characters if allowed in path and sitemap', () => {
      expect(
        encodeSitemapURL(`http://example.com/${allowedSitemapPathCharsToEncode.replace('&', '')}`),
      ).toBe(`http://example.com/${allowedSitemapPathCharsToEncode.replace('&', '')}`);
    });

    it('should return a string with the exact same characters if allowed in query and sitemap', () => {
      expect(
        encodeSitemapURL(
          `http://host.com/path?${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
        ),
      ).toBe(`http://host.com/path?${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`);
    });

    it('should return a string with the exact same characters if allowed in fragment and sitemap', () => {
      expect(
        encodeSitemapURL(
          `http://host.com/path?a=b#${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
        ),
      ).toBe(
        `http://host.com/path?a=b#${allowedSitemapQueryOrFragmentCharsToEncode.replace('&', '')}`,
      );
    });

    it('should return a string with percent-encoded characters if not allowed, by default', () => {
      expect(encodeSitemapURL(`http://example.com/${disallowed}`)).toBe(
        'http://example.com/%5C%5E%60%7B%7C%7D%3C%3E',
      );
      expect(encodeSitemapURL('http://example.com/<>')).toBe('http://example.com/%3C%3E');
      expect(encodeSitemapURL(`http://example.com/${disallowedOtherChars}`)).toBe(
        'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in userinfo and sitemap', () => {
      expect(encodeSitemapURL(`http://é&'*@host.com/`)).toBe(
        'http://%C3%A9&amp;&apos;%2A@host.com/',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in path and sitemap', () => {
      expect(encodeSitemapURL(`http://host.com/A@[]&'*`)).toBe(
        'http://host.com/a@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in query and sitemap', () => {
      expect(encodeSitemapURL(`http://host.com/path?A@[]&'*`)).toBe(
        'http://host.com/path?a@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return a string with escaped and percent-encoded characters if not allowed in fragment and sitemap', () => {
      expect(encodeSitemapURL(`http://host.com/path?a=b#A#/?@[]&'*`)).toBe(
        'http://host.com/path?a=b#a%23/?@%5B%5D&amp;&apos;%2A',
      );
    });

    it('should return the expected url encoded string with the punycoded host', () => {
      expect(encodeSitemapURL('http://exèmple.com:8080')).toBe('http://xn--exmple-4ua.com:8080/');
      expect(encodeSitemapURL('http://exèmple.com/pâth')).toBe(
        'http://xn--exmple-4ua.com/p%C3%A2th',
      );
      expect(encodeSitemapURL('http://中文.com.')).toBe('http://xn--fiq228c.com./');
    });

    it('should return the expected url encoded string', () => {
      expect(encodeSitemapURL('http://user:pâss@exèmple.com:8080/pâth')).toBe(
        'http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th',
      );
      expect(encodeSitemapURL('http://user:pa$$@example.com/')).toBe(
        'http://user:pa$$@example.com/',
      );
      expect(encodeSitemapURL('http://usèr:pass@example.com/')).toBe(
        'http://us%C3%A8r:pass@example.com/',
      );
      expect(encodeSitemapURL('http://example.com/pâth')).toBe('http://example.com/p%C3%A2th');
      expect(encodeSitemapURL('http://example.com/there?a=5&b=11')).toBe(
        'http://example.com/there?a=5&amp;b=11',
      );
    });

    it('should throw an uri error if url is more than the maximal allowed length when web or sitemap is true only', () => {
      expectThrowWithCode(
        () =>
          encodeSitemapURL(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
          ),
        'URI_MAX_LENGTH_URL',
      );
    });
  });
});
