import { describe, expect, it } from 'vitest';
import { maxLengthURL, maxPortInteger, minPortInteger } from '../src/config/index.js';
import {
  decodeSitemapURL,
  decodeURIComponentString,
  decodeURIString,
  decodeWebURL,
} from '../src/decoders/index.js';
import { AZ, allowed, az, digits, disallowed, disallowedOtherChars } from './fixtures/chars.js';

import { expectThrowWithCode } from './helpers.js';

describe('#decoders', () => {
  describe('when using decodeURIComponentString', () => {
    it('should return an empty string when uri is not a string', () => {
      expect(decodeURIComponentString()).toBe('');
      expect(decodeURIComponentString(undefined)).toBe('');
      expect(decodeURIComponentString(null)).toBe('');
      expect(decodeURIComponentString(NaN)).toBe('');
      expect(decodeURIComponentString([])).toBe('');
      expect(decodeURIComponentString(new Error('error'))).toBe('');
      expect(decodeURIComponentString(5)).toBe('');
      expect(decodeURIComponentString(true)).toBe('');
      expect(decodeURIComponentString(false)).toBe('');
      expect(decodeURIComponentString({})).toBe('');
    });

    it('should return a lowercased string only if lowercase is true', () => {
      expect(decodeURIComponentString('ABCDEF')).toBe('ABCDEF');
      expect(decodeURIComponentString('ABcDEF')).toBe('ABcDEF');
      expect(decodeURIComponentString('aBcDEF')).toBe('aBcDEF');
      expect(decodeURIComponentString('aBcDEf')).toBe('aBcDEf');
      expect(decodeURIComponentString('abcdef')).toBe('abcdef');
      expect(decodeURIComponentString(AZ)).toBe(AZ);

      expect(decodeURIComponentString('ABCDEF', { lowercase: true })).toBe('abcdef');
      expect(decodeURIComponentString('ABcDEF', { lowercase: true })).toBe('abcdef');
      expect(decodeURIComponentString('aBcDEF', { lowercase: true })).toBe('abcdef');
      expect(decodeURIComponentString('aBcDEf', { lowercase: true })).toBe('abcdef');
      expect(decodeURIComponentString('abcdef', { lowercase: true })).toBe('abcdef');
      expect(decodeURIComponentString(AZ, { lowercase: true })).toBe(az);
    });

    it('should return letters in uppercase if lowercase is false', () => {
      expect(decodeURIComponentString('ABCDEF', { lowercase: false })).toBe('ABCDEF');
      expect(decodeURIComponentString('ABcDEF', { lowercase: false })).toBe('ABcDEF');
      expect(decodeURIComponentString('aBcDEF', { lowercase: false })).toBe('aBcDEF');
      expect(decodeURIComponentString('aBcDEf', { lowercase: false })).toBe('aBcDEf');
      expect(decodeURIComponentString('abcdef', { lowercase: false })).toBe('abcdef');
      expect(decodeURIComponentString(AZ, { lowercase: false })).toBe(AZ);
    });

    it('should return a string with the exact same characters if allowed, by default', () => {
      expect(decodeURIComponentString(az)).toBe(az);
      expect(decodeURIComponentString(AZ)).toBe(AZ);
      expect(decodeURIComponentString(digits)).toBe(digits);
      expect(decodeURIComponentString(allowed.replace('%', ''))).toBe(allowed.replace('%', ''));

      expect(decodeURIComponentString(az, { sitemap: false })).toBe(az);
      expect(decodeURIComponentString(AZ, { sitemap: false })).toBe(AZ);
      expect(decodeURIComponentString(digits, { sitemap: false })).toBe(digits);
      expect(decodeURIComponentString(allowed.replace('%', ''), { sitemap: false })).toBe(
        allowed.replace('%', ''),
      );
    });

    it('should return a string with the exact same characters if allowed when sitemap is true', () => {
      expect(decodeURIComponentString(az, { sitemap: true })).toBe(az);
      expect(decodeURIComponentString(AZ, { sitemap: true })).toBe(AZ);
      expect(decodeURIComponentString(digits, { sitemap: true })).toBe(digits);
      expect(decodeURIComponentString(allowed.replace('%', ''), { sitemap: true })).toBe(
        allowed.replace('%', ''),
      );
      expect(decodeURIComponentString("*'&", { sitemap: true })).toBe("*'&");
    });

    it('should return an empty string if percent encoded characters are wrong whether sitemap option is true or false', () => {
      expect(decodeURIComponentString('%')).toBe('');
      expect(decodeURIComponentString('%A')).toBe('');
      expect(decodeURIComponentString('%20%%A')).toBe('');
      expect(decodeURIComponentString('%20%9')).toBe('');

      expect(decodeURIComponentString('%', { sitemap: false })).toBe('');
      expect(decodeURIComponentString('%A', { sitemap: false })).toBe('');
      expect(decodeURIComponentString('%20%%At', { sitemap: false })).toBe('');
      expect(decodeURIComponentString('%20%9', { sitemap: false })).toBe('');

      expect(decodeURIComponentString('%', { sitemap: true })).toBe('');
      expect(decodeURIComponentString('%A', { sitemap: true })).toBe('');
      expect(decodeURIComponentString('%20%%Yx', { sitemap: true })).toBe('');
      expect(decodeURIComponentString('a%20%9', { sitemap: true })).toBe('');
    });

    it('should return a string with percent encoded characters decoded whether sitemap option is true or false', () => {
      expect(decodeURIComponentString('%5C%5E%60%7B%7C%7D%3C%3E')).toBe(disallowed);
      expect(decodeURIComponentString('%3C%3E')).toBe('<>');
      expect(
        decodeURIComponentString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3'),
      ).toBe(disallowedOtherChars);

      expect(decodeURIComponentString('%5C%5E%60%7B%7C%7D%3C%3E', { sitemap: false })).toBe(
        disallowed,
      );
      expect(decodeURIComponentString('%3C%3E', { sitemap: false })).toBe('<>');
      expect(
        decodeURIComponentString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3', {
          sitemap: false,
        }),
      ).toBe(disallowedOtherChars);

      expect(decodeURIComponentString('%5C%5E%60%7B%7C%7D%3C%3E', { sitemap: true })).toBe(
        disallowed,
      );
      expect(decodeURIComponentString('%3C%3E', { sitemap: true })).toBe('<>');
      expect(
        decodeURIComponentString('%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3', {
          sitemap: true,
        }),
      ).toBe(disallowedOtherChars);
    });

    it('should return a string with unescaped characters when sitemap is true', () => {
      expect(decodeURIComponentString('&amp;&apos;%2A', { sitemap: true })).toBe("&'*");
      expect(
        decodeURIComponentString(
          'http://www.example.co.jp/it&apos;s%20there?name=thx%2A&amp;pseudo=superhero#anchor',
          { sitemap: true },
        ),
      ).toBe("http://www.example.co.jp/it's there?name=thx*&pseudo=superhero#anchor");
      expect(decodeURIComponentString('&amp;&apos;%2A', { sitemap: false })).toBe('&amp;&apos;*');
      expect(decodeURIComponentString("&'%2A", { sitemap: false })).toBe("&'*");
    });
  });

  describe('when using decodeURIString that uses checkURISyntax and decodeURIComponentString', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => decodeURIString(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeURIString({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => decodeURIString('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeURIString('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeURIString(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => decodeURIString('htép://example.com'), 'URI_INVALID_SCHEME_CHAR');
      expectThrowWithCode(() => decodeURIString('ht°p://example.com'), 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error if scheme is not http or https when option is web or sitemap', () => {
      expectThrowWithCode(
        () => decodeURIString('httpp://www.example.com', { web: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('httpp://www.example.com', { web: true, sitemap: false }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('httpp://www.example.com', { web: false, sitemap: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('httpp://www.example.com', { sitemap: true }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () => decodeURIString('htp://www.example.com', { web: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('htp://www.example.com', { web: true, sitemap: false }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('htp://www.example.com', { web: false, sitemap: true }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => decodeURIString('htp://www.example.com', { sitemap: true }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should not throw an uri error if scheme is not http or https when option is not web or sitemap', () => {
      expect(() => decodeURIString('httpp://www.example.com')).not.toThrow();
      expect(() => decodeURIString('httpp://www.example.com', { web: false })).not.toThrow();
      expect(() =>
        decodeURIString('httpp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('httpp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => decodeURIString('httpp://www.example.com', { sitemap: false })).not.toThrow();

      expect(() => decodeURIString('htp://www.example.com')).not.toThrow();
      expect(() => decodeURIString('htp://www.example.com', { web: false })).not.toThrow();
      expect(() =>
        decodeURIString('htp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('htp://www.example.com', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => decodeURIString('htp://www.example.com', { sitemap: false })).not.toThrow();
    });

    it('should throw an uri error if host to decode is not valid', () => {
      expectThrowWithCode(() => decodeURIString('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if host to decode is not a valid IP or domain name', () => {
      expectThrowWithCode(() => decodeURIString('http://[123:4:5%%%].com'), 'URI_INVALID_HOST');
      expectThrowWithCode(
        () => decodeURIString('http://100..100.100.100..com'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(() => decodeURIString('http://a.b.a.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to decode is not an integer', () => {
      expectThrowWithCode(() => decodeURIString('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if port to decode is out of range', () => {
      expectThrowWithCode(
        () => decodeURIString(`http://example.com:${minPortInteger - 1}`),
        'URI_INVALID_PORT',
      );
      expectThrowWithCode(
        () => decodeURIString(`http://example.com:${maxPortInteger + 1}`),
        'URI_INVALID_PORT',
      );
    });

    it('should not throw an uri error if port to decode is in range', () => {
      expect(() => decodeURIString(`http://example.com:${minPortInteger}`)).not.toThrow();
      expect(() => decodeURIString(`http://example.com:${maxPortInteger}`)).not.toThrow();
    });

    it('should ignore userinfo provided if unable to decode', () => {
      expect(decodeURIString('http://user%pass@example.com:8080')).toBe('http://example.com:8080/');
    });

    it('should ignore path provided if unable to decode', () => {
      expect(decodeURIString('http://example.com:8080/over%there')).toBe(
        'http://example.com:8080/',
      );
    });

    it('should ignore query provided if unable to decode', () => {
      expect(decodeURIString('http://example.com:8080/over/there?query=val%ue')).toBe(
        'http://example.com:8080/over/there',
      );
    });

    it('should ignore fragment provided if unable to decode', () => {
      expect(decodeURIString('http://example.com:8080/over/there?query=value#anch%or')).toBe(
        'http://example.com:8080/over/there?query=value',
      );
    });

    it('should ignore userinfo, path, query and fragment provided if unable to decode', () => {
      expect(
        decodeURIString('http://user%pass@example.com:8080/over%there?query=val%ue#anch%or'),
      ).toBe('http://example.com:8080/');
    });

    it('should throw an uri error if authority is null and option is web or sitemap', () => {
      expectThrowWithCode(
        () => decodeURIString('http:isbn:0-486-27557-4', { web: true, sitemap: false }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => decodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => decodeURIString('http:isbn:0-486-27557-4', { web: true, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => decodeURIString('https:isbn:0-486-27557-4', { web: true, sitemap: false }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => decodeURIString('http:isbn:0-486-27557-4', { web: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => decodeURIString('https:isbn:0-486-27557-4', { sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error if authority is null and option is not web or sitemap', () => {
      expect(() => decodeURIString('https:isbn:0-486-27557-4')).not.toThrow();
      expect(() =>
        decodeURIString('http:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('https:isbn:0-486-27557-4', { web: false, sitemap: false }),
      ).not.toThrow();
      expect(() => decodeURIString('http:isbn:0-486-27557-4', { web: false })).not.toThrow();
      expect(() => decodeURIString('https:isbn:0-486-27557-4', { sitemap: false })).not.toThrow();
    });

    it('should not throw an uri error if uri to decode has letters in uppercase by default', () => {
      expect(() => decodeURIString('http://example.com/OVER/there')).not.toThrow();
      expect(() => decodeURIString('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => decodeURIString('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => decodeURIString('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => decodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();

      expect(() => decodeURIString('http://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => decodeURIString('HTTP://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://EXAMPLE.com/OVER/there', { web: true })).not.toThrow();
      expect(() =>
        decodeURIString('http://USER:PASS@example.com/OVER/there', { web: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { web: true }),
      ).not.toThrow();

      expect(() => decodeURIString('http://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => decodeURIString('HTTP://example.com/OVER/there', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://EXAMPLE.com/OVER/there', { web: true })).not.toThrow();
      expect(() =>
        decodeURIString('http://USER:PASS@example.com/OVER/there', { web: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { web: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme when lowercase is false', () => {
      expect(() =>
        decodeURIString('FTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('FTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('FTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();

      expect(() =>
        decodeURIString('HTTP://example.com/OVER/there', { web: true, lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { web: true, lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://user:pass@example.com', { web: true, lowercase: false }),
      ).not.toThrow();

      expect(() =>
        decodeURIString('HTTP://example.com/OVER/there', { sitemap: true, lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', {
          sitemap: true,
          lowercase: false,
        }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('HTTP://user:pass@example.com', { sitemap: true, lowercase: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to decode has no special sitemap characters', () => {
      expect(() => decodeURIString('ftp://EXAMPLE.com/OVER*there')).not.toThrow();
      expect(() => decodeURIString("ftp://EXAMPLE.com/OVER/'there")).not.toThrow();
      expect(() => decodeURIString('ftp://EXAMPLE.com/OVER/there&')).not.toThrow();

      expect(() => decodeURIString('http://EXAMPLE.com/OVER*there', { web: true })).not.toThrow();
      expect(() => decodeURIString("http://EXAMPLE.com/OVER/'there", { web: true })).not.toThrow();
      expect(() => decodeURIString('http://EXAMPLE.com/OVER/there&', { web: true })).not.toThrow();

      expect(() =>
        decodeURIString('http://EXAMPLE.com/OVER*there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString("http://EXAMPLE.com/OVER/'there", { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://EXAMPLE.com/OVER/there&', { sitemap: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to decode has invalid characters that should be percent encoded whether web or sitemap is true or not', () => {
      expect(() => decodeURIString('ftp://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeURIString('ftp://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/over/t}ere')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/over|there')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/over/there')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/over/thère')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/over/there€')).not.toThrow();
      expect(() => decodeURIString('ftp://example.com/oveùr/there')).not.toThrow();

      expect(() =>
        decodeURIString('http://user:pass@example.com/path{', { web: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://user:pass@example.com/path{', { web: true }),
      ).not.toThrow();
      expect(() => decodeURIString('http://example.com/over/t}ere', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://example.com/over|there', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://example.com/over/there', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://example.com/over/thère', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://example.com/over/there€', { web: true })).not.toThrow();
      expect(() => decodeURIString('http://example.com/oveùr/there', { web: true })).not.toThrow();

      expect(() =>
        decodeURIString('http://user:pass@example.com/path{', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://user:pass@example.com/path{', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/over/t}ere', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/over|there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/over/there', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/over/thère', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/over/there€', { sitemap: true }),
      ).not.toThrow();
      expect(() =>
        decodeURIString('http://example.com/oveùr/there', { sitemap: true }),
      ).not.toThrow();
    });

    it('should return scheme and host in lowercase by default', () => {
      expect(decodeURIString('FTP://WWW.EXAMPLE.COM.')).toBe('ftp://www.example.com./');
      expect(decodeURIString('HTTP://WWW.EXAMPLE.COM.', { web: true })).toBe(
        'http://www.example.com./',
      );
      expect(decodeURIString('HTTP://WWW.EXAMPLE.COM.', { sitemap: true })).toBe(
        'http://www.example.com./',
      );
    });

    it('should return an uri with uppercase letters if lowercase is false except host and scheme automatically put in lowercase to be RFC-3986 compliant', () => {
      expect(decodeURIString('ftp://WWW.EXAMPLE.COM.', { lowercase: false })).toBe(
        'ftp://www.example.com./',
      );
      expect(decodeURIString('HTTP://WWW.EXAmPLE.COM.', { web: true, lowercase: false })).toBe(
        'http://www.example.com./',
      );
      expect(decodeURIString('https://WWW.EXaMPLE.COM.', { sitemap: true, lowercase: false })).toBe(
        'https://www.example.com./',
      );

      expect(decodeURIString('ftp://WWW.EXAMPLE.COM./Over/There', { lowercase: false })).toBe(
        'ftp://www.example.com./Over/There',
      );
      expect(
        decodeURIString('http://WWW.EXAmPLE.COM./Over/There?a=B#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('http://www.example.com./Over/There?a=B#Anchor');
      expect(
        decodeURIString('https://WWW.EXaMPLE.COM./Over/There?a=B&amp;b=c#Anchor', {
          sitemap: true,
          lowercase: false,
        }),
      ).toBe('https://www.example.com./Over/There?a=B&b=c#Anchor');

      expect(
        decodeURIString('https://WWW.中文.COM./Over/There?a=B&b=c#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('https://www.中文.com./Over/There?a=B&b=c#Anchor');
      expect(
        decodeURIString('https://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor', {
          web: true,
          lowercase: false,
        }),
      ).toBe('https://www.中文.com./Over/There?a=B&b=c#Anchor');
    });

    it('should return a string with the exact same characters if allowed, by default', () => {
      expect(decodeURIString(`urn:isbn:0-486-27557-4/${az}`)).toBe(`urn:isbn:0-486-27557-4/${az}`);
      expect(decodeURIString(`urn:isbn:0-486-27557-4/${AZ}`)).toBe(`urn:isbn:0-486-27557-4/${AZ}`);
      expect(decodeURIString(`urn:isbn:0-486-27557-4/${digits}`)).toBe(
        `urn:isbn:0-486-27557-4/${digits}`,
      );
      expect(decodeURIString(`urn:isbn:0-486-27557-4/${allowed.replace('%', '')}`)).toBe(
        `urn:isbn:0-486-27557-4/${allowed.replace('%', '')}`,
      );

      expect(decodeURIString(`http://example.com/${az}`, { web: false })).toBe(
        `http://example.com/${az}`,
      );
      expect(decodeURIString(`http://example.com/${AZ}`, { web: false })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(decodeURIString(`http://example.com/${digits}`, { web: false })).toBe(
        `http://example.com/${digits}`,
      );
      expect(
        decodeURIString(`http://example.com/${allowed.replace('%', '')}`, { web: false }),
      ).toBe(`http://example.com/${allowed.replace('%', '')}`);

      expect(decodeURIString(`http://example.com/${az}`, { sitemap: false })).toBe(
        `http://example.com/${az}`,
      );
      expect(decodeURIString(`http://example.com/${AZ}`, { sitemap: false })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(decodeURIString(`http://example.com/${digits}`, { sitemap: false })).toBe(
        `http://example.com/${digits}`,
      );
      expect(
        decodeURIString(`http://example.com/${allowed.replace('%', '')}`, { sitemap: false }),
      ).toBe(`http://example.com/${allowed.replace('%', '')}`);
    });

    it('should return a string with the exact same characters if allowed and to not be escaped when sitemap is true', () => {
      expect(decodeURIString(`http://example.com/${az}`, { sitemap: true })).toBe(
        `http://example.com/${az}`,
      );
      expect(decodeURIString(`http://example.com/${AZ}`, { sitemap: true })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(decodeURIString(`http://example.com/${digits}`, { sitemap: true })).toBe(
        `http://example.com/${digits}`,
      );
      expect(decodeURIString(`http://example.com/*'&`, { sitemap: true })).toBe(
        `http://example.com/*'&`,
      );
    });

    it('should return a string with percent decoded characters, by default', () => {
      expect(decodeURIString(`http://example.com/${AZ}`)).toBe(`http://example.com/${AZ}`);
      expect(decodeURIString('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E')).toBe(
        `http://example.com/${disallowed}`,
      );
      expect(decodeURIString('http://example.com/%3C%3E')).toBe('http://example.com/<>');
      expect(
        decodeURIString(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);

      expect(decodeURIString(`http://example.com/${AZ}`, { web: false })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(decodeURIString('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E', { web: false })).toBe(
        `http://example.com/${disallowed}`,
      );
      expect(decodeURIString('http://example.com/%3C%3E', { web: false })).toBe(
        'http://example.com/<>',
      );
      expect(
        decodeURIString(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
          { web: false },
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);

      expect(decodeURIString(`http://example.com/${AZ}`, { sitemap: false })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(
        decodeURIString('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E', { sitemap: false }),
      ).toBe(`http://example.com/${disallowed}`);
      expect(decodeURIString('http://example.com/%3C%3E', { sitemap: false })).toBe(
        'http://example.com/<>',
      );
      expect(
        decodeURIString(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
          { sitemap: false },
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);
    });

    it('should return a string with percent decoded characters if not allowed when sitemap is true', () => {
      expect(decodeURIString(`http://example.com/${AZ}`, { sitemap: true })).toBe(
        `http://example.com/${AZ}`,
      );
      expect(
        decodeURIString('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E', { sitemap: true }),
      ).toBe(`http://example.com/${disallowed}`);
      expect(
        decodeURIString(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
          { sitemap: true },
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);
    });

    it('should return a string with unescaped characters when sitemap is true', () => {
      expect(decodeURIString('http://example.com/&amp;&apos;%2A', { sitemap: true })).toBe(
        "http://example.com/&'*",
      );
    });

    it('should return the expected uri decoded string with the punydecoded host', () => {
      expect(decodeURIString('ftp://xn--exmple-4ua.com:8080')).toBe('ftp://exèmple.com:8080/');
      expect(decodeURIString('ftp://exèmple.com:8080')).toBe('ftp://exèmple.com:8080/');
      expect(decodeURIString('ftp://xn--exmple-4ua.com/p%C3%A2th')).toBe('ftp://exèmple.com/pâth');
      expect(decodeURIString('ftp://xn--fiq228c.com.')).toBe('ftp://中文.com./');

      expect(decodeURIString('http://xn--exmple-4ua.com:8080', { web: true })).toBe(
        'http://exèmple.com:8080/',
      );
      expect(decodeURIString('http://xn--exmple-4ua.com/p%C3%A2th', { web: true })).toBe(
        'http://exèmple.com/pâth',
      );
      expect(decodeURIString('http://xn--fiq228c.com.', { web: true })).toBe('http://中文.com./');

      expect(decodeURIString('http://xn--exmple-4ua.com:8080', { sitemap: true })).toBe(
        'http://exèmple.com:8080/',
      );
      expect(decodeURIString('http://xn--exmple-4ua.com/p%C3%A2th', { sitemap: true })).toBe(
        'http://exèmple.com/pâth',
      );
      expect(decodeURIString('http://xn--fiq228c.com.', { sitemap: true })).toBe(
        'http://中文.com./',
      );
    });

    it('should return the expected uri decoded string with the userinfo decoded', () => {
      expect(decodeURIString('ftp://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'ftp://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeURIString('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'http://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeURIString('http://us%C3%A8r:pass@example.com/')).toBe(
        'http://usèr:pass@example.com/',
      );
    });

    it('should return the expected uri decoded string with userinfo decoded and unescaped chars when sitemap is true', () => {
      expect(
        decodeURIString('http://us&amp;er:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th&apos;', {
          sitemap: true,
        }),
      ).toBe("http://us&er:pâss@exèmple.com:8080/pâth'");
      expect(decodeURIString('http://us&apos;r:pa%2Ass@example.com/', { sitemap: true })).toBe(
        "http://us'r:pa*ss@example.com/",
      );
    });

    it('should return the expected uri decoded string with the path decoded and unescaped chars when sitemap is true', () => {
      expect(decodeURIString('http://example.com/p%2A.html')).toBe('http://example.com/p*.html');
      expect(decodeURIString('http://example.com/p%2A&amp;.html', { sitemap: true })).toBe(
        'http://example.com/p*&.html',
      );
    });

    it('should return the expected uri decoded string with the query decoded and unescaped chars when sitemap is true', () => {
      expect(decodeURIString('http://example.com/p.html?qu%2Ary=value')).toBe(
        'http://example.com/p.html?qu*ry=value',
      );
      expect(
        decodeURIString('http://example.com/p.html?qu%2Ary=value&amp;b=9', { sitemap: true }),
      ).toBe('http://example.com/p.html?qu*ry=value&b=9');
    });

    it('should return the expected uri decoded string with the fragment decoded and unescaped chars when sitemap is true', () => {
      expect(decodeURIString('http://example.com/p.html?query=value#an%2Achor')).toBe(
        'http://example.com/p.html?query=value#an*chor',
      );
      expect(
        decodeURIString('http://example.com/p.html?query=value#an%2Achor&amp;', { sitemap: true }),
      ).toBe('http://example.com/p.html?query=value#an*chor&');
    });

    it('should return the expected uri decoded string', () => {
      expect(decodeURIString('foo://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'foo://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeURIString('foo://user:pa$$@example.com/')).toBe('foo://user:pa$$@example.com/');
      expect(decodeURIString('foo://us%C3%A8r:pass@example.com/')).toBe(
        'foo://usèr:pass@example.com/',
      );
      expect(decodeURIString('foo://example.com/p%C3%A2th')).toBe('foo://example.com/pâth');
      expect(decodeURIString('foo://example.com/p%C3%A2th?a=1&b=2#11')).toBe(
        'foo://example.com/pâth?a=1&b=2#11',
      );
      expect(decodeURIString('foo://example.com/%C3%A2th?a=1&b=2')).toBe(
        'foo://example.com/âth?a=1&b=2',
      );

      expect(
        decodeURIString('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th', { web: true }),
      ).toBe('http://user:pâss@exèmple.com:8080/pâth');
      expect(decodeURIString('http://user:pa$$@example.com/', { web: true })).toBe(
        'http://user:pa$$@example.com/',
      );
      expect(decodeURIString('http://us%C3%A8r:pass@example.com/', { web: true })).toBe(
        'http://usèr:pass@example.com/',
      );
      expect(decodeURIString('http://example.com/p%C3%A2th', { web: true })).toBe(
        'http://example.com/pâth',
      );
      expect(decodeURIString('https://example.com/p%C3%A2th?%C3%A2=5', { web: true })).toBe(
        'https://example.com/pâth?â=5',
      );
      expect(decodeURIString('https://example.com/p%C3%A2th?%C3%A2=5#11', { web: true })).toBe(
        'https://example.com/pâth?â=5#11',
      );

      expect(decodeURIString('http://example.com/there?a=5&amp;b=11', { sitemap: true })).toBe(
        'http://example.com/there?a=5&b=11',
      );
      expect(
        decodeURIString('http://example.com/there?a=5&amp;b=11#anc%20hor', { sitemap: true }),
      ).toBe('http://example.com/there?a=5&b=11#anc hor');
    });

    it('should throw an uri error if url is more than the maximal allowed length when web or sitemap is true only', () => {
      expectThrowWithCode(
        () =>
          decodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { sitemap: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expectThrowWithCode(
        () =>
          decodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { web: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expectThrowWithCode(
        () =>
          decodeURIString(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
            { sitemap: true, web: true },
          ),
        'URI_MAX_LENGTH_URL',
      );
      expect(() =>
        decodeURIString(
          `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
        ),
      ).not.toThrow();
    });
  });

  describe('when using decodeWebURL that is an alias for decodeURIString with web option to true', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => decodeWebURL(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeWebURL({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when url has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => decodeWebURL('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeWebURL('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeWebURL(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => decodeWebURL('htép://example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => decodeWebURL('ht°p://example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(() => decodeWebURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => decodeWebURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => decodeWebURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => decodeWebURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if host to decode is not valid', () => {
      expectThrowWithCode(() => decodeWebURL('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to decode is not valid', () => {
      expectThrowWithCode(() => decodeWebURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(() => decodeWebURL('http:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
      expectThrowWithCode(() => decodeWebURL('https:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
    });

    it('should throw an uri error if host to decode is not a valid IP or domain name', () => {
      expectThrowWithCode(() => decodeWebURL('http://[123:4:5%%%].com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => decodeWebURL('http://100..100.100.100..com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => decodeWebURL('http://a.b.a.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to decode is not valid', () => {
      expectThrowWithCode(() => decodeWebURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should ignore userinfo provided if unable to decode', () => {
      expect(decodeWebURL('http://user%pass@example.com:8080')).toBe('http://example.com:8080/');
    });

    it('should ignore path provided if unable to decode', () => {
      expect(decodeWebURL('http://example.com:8080/over%there')).toBe('http://example.com:8080/');
    });

    it('should ignore query provided if unable to decode', () => {
      expect(decodeWebURL('http://example.com:8080/over/there?query=val%ue')).toBe(
        'http://example.com:8080/over/there',
      );
    });

    it('should ignore fragment provided if unable to decode', () => {
      expect(decodeWebURL('http://example.com:8080/over/there?query=value#anch%or')).toBe(
        'http://example.com:8080/over/there?query=value',
      );
    });

    it('should ignore userinfo, path, query and fragment provided if unable to decode', () => {
      expect(
        decodeWebURL('http://user%pass@example.com:8080/over%there?query=val%ue#anch%or'),
      ).toBe('http://example.com:8080/');
    });

    it('should not throw an uri error if uri to decode has letters in uppercase by default', () => {
      expect(() => decodeWebURL('http://example.com/OVER/there')).not.toThrow();
      expect(() => decodeWebURL('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => decodeWebURL('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => decodeWebURL('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => decodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme when lowercase is false', () => {
      expect(() =>
        decodeWebURL('HTTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeWebURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeWebURL('HTTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri to decode has invalid characters that should be percent encoded', () => {
      expect(() => decodeWebURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeWebURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/over/t}ere')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/over|there')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/over/there')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/over/thère')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/over/there€')).not.toThrow();
      expect(() => decodeWebURL('http://example.com/oveùr/there')).not.toThrow();
    });

    it('should return scheme and host in lowercase by default', () => {
      expect(decodeWebURL('HTTP://WWW.EXAMPLE.COM.')).toBe('http://www.example.com./');
    });

    it('should return an url with uppercase letters if lowercase is false except host and scheme automatically put in lowercase to be RFC-3986 compliant', () => {
      expect(decodeWebURL('http://WWW.EXAmPLE.COM.', { lowercase: false })).toBe(
        'http://www.example.com./',
      );
      expect(decodeWebURL('https://WWW.EXaMPLE.COM.', { lowercase: false })).toBe(
        'https://www.example.com./',
      );
      expect(decodeWebURL('http://WWW.EXAMPLE.COM./Over/There', { lowercase: false })).toBe(
        'http://www.example.com./Over/There',
      );
      expect(
        decodeWebURL('HTTP://WWW.EXAmPLE.COM./Over/There?a=B#Anchor', { lowercase: false }),
      ).toBe('http://www.example.com./Over/There?a=B#Anchor');
    });

    it('should return a string with the exact same characters if allowed', () => {
      expect(decodeWebURL(`http://example.com/${az}`)).toBe(`http://example.com/${az}`);
      expect(decodeWebURL(`http://example.com/${AZ}`)).toBe(`http://example.com/${AZ}`);
      expect(decodeWebURL(`http://example.com/${digits}`)).toBe(`http://example.com/${digits}`);
      expect(decodeWebURL(`http://example.com/${allowed.replace('%', '')}`)).toBe(
        `http://example.com/${allowed.replace('%', '')}`,
      );
    });

    it('should return a string with percent decoded characters', () => {
      expect(decodeWebURL(`http://example.com/${AZ}`)).toBe(`http://example.com/${AZ}`);
      expect(decodeWebURL('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E')).toBe(
        `http://example.com/${disallowed}`,
      );
      expect(decodeWebURL('http://example.com/%3C%3E')).toBe('http://example.com/<>');
      expect(
        decodeWebURL(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);
    });

    it('should return the expected url decoded string with the punydecoded host', () => {
      expect(decodeWebURL('http://exèmple.com:8080')).toBe('http://exèmple.com:8080/');
      expect(decodeWebURL('http://xn--exmple-4ua.com:8080', { web: true })).toBe(
        'http://exèmple.com:8080/',
      );
      expect(decodeWebURL('http://xn--exmple-4ua.com/p%C3%A2th', { web: true })).toBe(
        'http://exèmple.com/pâth',
      );
      expect(decodeWebURL('http://xn--fiq228c.com.', { web: true })).toBe('http://中文.com./');
    });

    it('should return the expected url decoded string with the userinfo decoded', () => {
      expect(decodeWebURL('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'http://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeWebURL('http://us%C3%A8r:pass@example.com/')).toBe(
        'http://usèr:pass@example.com/',
      );
    });

    it('should return the expected url decoded string with the path decoded', () => {
      expect(decodeWebURL('http://example.com/p%2A.html')).toBe('http://example.com/p*.html');
    });

    it('should return the expected url decoded string with the query decoded', () => {
      expect(decodeWebURL('http://example.com/p.html?qu%2Ary=value')).toBe(
        'http://example.com/p.html?qu*ry=value',
      );
    });

    it('should return the expected url decoded string with the fragment decoded', () => {
      expect(decodeWebURL('http://example.com/p.html?query=value#an%2Achor')).toBe(
        'http://example.com/p.html?query=value#an*chor',
      );
    });

    it('should return the expected uri decoded string', () => {
      expect(decodeWebURL('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'http://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeWebURL('http://user:pa$$@example.com/')).toBe('http://user:pa$$@example.com/');
      expect(decodeWebURL('http://us%C3%A8r:pass@example.com/')).toBe(
        'http://usèr:pass@example.com/',
      );
      expect(decodeWebURL('http://example.com/p%C3%A2th')).toBe('http://example.com/pâth');
      expect(decodeWebURL('https://example.com/p%C3%A2th?%C3%A2=5')).toBe(
        'https://example.com/pâth?â=5',
      );
      expect(decodeWebURL('https://example.com/p%C3%A2th?%C3%A2=5#11')).toBe(
        'https://example.com/pâth?â=5#11',
      );
    });

    it('should throw an uri error if url is more than the maximal allowed length', () => {
      expectThrowWithCode(
        () =>
          decodeWebURL(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
          ),
        'URI_MAX_LENGTH_URL',
      );
    });
  });

  describe('when using decodeSitemapURL that is an alias for decodeURIString with sitemap option to true', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => decodeSitemapURL(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => decodeSitemapURL({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when url has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => decodeSitemapURL('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeSitemapURL('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => decodeSitemapURL(':'), 'URI_MISSING_SCHEME');
    });

    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => decodeSitemapURL('htép://example.com'), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => decodeSitemapURL('ht°p://example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(() => decodeSitemapURL('httpp://www.example.com'), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error if host to decode is not valid', () => {
      expectThrowWithCode(() => decodeSitemapURL('http://xn--iñvalid.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to decode is not valid', () => {
      expectThrowWithCode(() => decodeSitemapURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(
        () => decodeSitemapURL('http:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should throw an uri error if host to decode is not a valid IP or domain name', () => {
      expectThrowWithCode(() => decodeSitemapURL('http://[123:4:5%%%].com'), 'URI_INVALID_HOST');
      expectThrowWithCode(
        () => decodeSitemapURL('http://100..100.100.100..com'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(() => decodeSitemapURL('http://a.b.a.com'), 'URI_INVALID_HOST');
    });

    it('should throw an uri error if port to decode is not valid', () => {
      expectThrowWithCode(() => decodeSitemapURL('http://example.com:80g80'), 'URI_INVALID_PORT');
    });

    it('should ignore userinfo provided if unable to decode', () => {
      expect(decodeSitemapURL('http://user%pass@example.com:8080')).toBe(
        'http://example.com:8080/',
      );
    });

    it('should ignore path provided if unable to decode', () => {
      expect(decodeSitemapURL('http://example.com:8080/over%there')).toBe(
        'http://example.com:8080/',
      );
    });

    it('should ignore query provided if unable to decode', () => {
      expect(decodeSitemapURL('http://example.com:8080/over/there?query=val%ue')).toBe(
        'http://example.com:8080/over/there',
      );
    });

    it('should ignore fragment provided if unable to decode', () => {
      expect(decodeSitemapURL('http://example.com:8080/over/there?query=value#anch%or')).toBe(
        'http://example.com:8080/over/there?query=value',
      );
    });

    it('should ignore userinfo, path, query and fragment provided if unable to decode', () => {
      expect(
        decodeSitemapURL('http://user%pass@example.com:8080/over%there?query=val%ue#anch%or'),
      ).toBe('http://example.com:8080/');
    });

    it('should not throw an uri error if url to decode has letters in uppercase by default', () => {
      expect(() => decodeSitemapURL('http://example.com/OVER/there')).not.toThrow();
      expect(() => decodeSitemapURL('HTTP://example.com/OVER/there')).not.toThrow();
      expect(() => decodeSitemapURL('http://EXAMPLE.com/OVER/there')).not.toThrow();
      expect(() => decodeSitemapURL('http://USER:PASS@example.com/OVER/there')).not.toThrow();
      expect(() => decodeSitemapURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE')).not.toThrow();
    });

    it('should not throw an uri error if uri to encode has letters in uppercase for scheme when lowercase is false', () => {
      expect(() =>
        decodeSitemapURL('HTTP://example.com/OVER/there', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeSitemapURL('HTTP://USER:PASS@EXAMPLE.COM/OVER/THERE', { lowercase: false }),
      ).not.toThrow();
      expect(() =>
        decodeSitemapURL('HTTP://user:pass@example.com', { lowercase: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error if url to decode has invalid characters that should be percent encoded', () => {
      expect(() => decodeSitemapURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeSitemapURL('http://user:pass@example.com/path{')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/over/t}ere')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/over|there')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/over/there')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/over/thère')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/over/there€')).not.toThrow();
      expect(() => decodeSitemapURL('http://example.com/oveùr/there')).not.toThrow();
    });

    it('should return scheme and host in lowercase by default', () => {
      expect(decodeSitemapURL('HTTP://WWW.EXAMPLE.COM.')).toBe('http://www.example.com./');
    });

    it('should return an url with uppercase letters if lowercase is false except host and scheme automatically put in lowercase to be RFC-3986 compliant', () => {
      expect(decodeSitemapURL('http://WWW.EXAmPLE.COM.', { lowercase: false })).toBe(
        'http://www.example.com./',
      );
      expect(decodeSitemapURL('HTTPS://WWW.EXaMPLE.COM.', { lowercase: false })).toBe(
        'https://www.example.com./',
      );
      expect(
        decodeSitemapURL('http://WWW.EXAmPLE.COM./Over/There?a=B#Anchor', { lowercase: false }),
      ).toBe('http://www.example.com./Over/There?a=B#Anchor');
      expect(
        decodeSitemapURL('https://WWW.EXaMPLE.COM./Over/There?a=B&amp;b=c#Anchor', {
          lowercase: false,
        }),
      ).toBe('https://www.example.com./Over/There?a=B&b=c#Anchor');
    });

    it('should return a string with the exact same characters if allowed', () => {
      expect(decodeSitemapURL(`http://example.com/${az}`)).toBe(`http://example.com/${az}`);
      expect(decodeSitemapURL(`http://example.com/${AZ}`)).toBe(`http://example.com/${AZ}`);
      expect(decodeSitemapURL(`http://example.com/${digits}`)).toBe(`http://example.com/${digits}`);
      expect(decodeSitemapURL(`http://example.com/${allowed.replace('%', '')}`)).toBe(
        `http://example.com/${allowed.replace('%', '')}`,
      );
    });

    it('should return a string with the exact same characters if allowed and to not be escaped', () => {
      expect(decodeSitemapURL(`http://example.com/${az}`)).toBe(`http://example.com/${az}`);
      expect(decodeSitemapURL(`http://example.com/${digits}`)).toBe(`http://example.com/${digits}`);
      expect(decodeSitemapURL(`http://example.com/*'&`)).toBe(`http://example.com/*'&`);
    });

    it('should return a string with percent decoded characters', () => {
      expect(decodeSitemapURL('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E')).toBe(
        `http://example.com/${disallowed}`,
      );
      expect(decodeSitemapURL('http://example.com/%3C%3E')).toBe('http://example.com/<>');
      expect(
        decodeSitemapURL(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);
    });

    it('should return a string with percent decoded characters if not allowed', () => {
      expect(decodeSitemapURL('http://example.com/%5C%5E%60%7B%7C%7D%3C%3E')).toBe(
        `http://example.com/${disallowed}`,
      );
      expect(decodeSitemapURL('http://example.com/&amp;&apos;%2A')).toBe("http://example.com/&'*");
      expect(
        decodeSitemapURL(
          'http://example.com/%E2%82%AC%C2%B0%C3%A9%C3%B9%C3%A8%C3%A0%C3%A7%20%C2%A7%C2%A3',
        ),
      ).toBe(`http://example.com/${disallowedOtherChars}`);
    });

    it('should return a string with unescaped characters', () => {
      expect(decodeSitemapURL('http://example.com/&amp;&apos;%2A')).toBe("http://example.com/&'*");
    });

    it('should return the expected url decoded string with the punydecoded host', () => {
      expect(decodeSitemapURL('http://exèmple.com:8080')).toBe('http://exèmple.com:8080/');
      expect(decodeSitemapURL('http://xn--exmple-4ua.com:8080')).toBe('http://exèmple.com:8080/');
      expect(decodeSitemapURL('http://xn--exmple-4ua.com/p%C3%A2th')).toBe(
        'http://exèmple.com/pâth',
      );
      expect(decodeSitemapURL('http://xn--fiq228c.com.')).toBe('http://中文.com./');
    });

    it('should return the expected url decoded string with the userinfo decoded', () => {
      expect(decodeSitemapURL('http://user:p%C3%A2ss@xn--exmple-4ua.com:8080/p%C3%A2th')).toBe(
        'http://user:pâss@exèmple.com:8080/pâth',
      );
      expect(decodeSitemapURL('http://us%C3%A8r:&amp;&apos;%2Apass@example.com/')).toBe(
        "http://usèr:&'*pass@example.com/",
      );
    });

    it('should return the expected url decoded string with the path decoded', () => {
      expect(decodeSitemapURL('http://example.com/p&amp;&apos;%2A.html')).toBe(
        "http://example.com/p&'*.html",
      );
    });

    it('should return the expected url decoded string with the query decoded', () => {
      expect(decodeSitemapURL('http://example.com/p.html?qu&amp;&apos;%2Ary=value')).toBe(
        "http://example.com/p.html?qu&'*ry=value",
      );
    });

    it('should return the expected url decoded string with the fragment decoded', () => {
      expect(decodeSitemapURL('http://example.com/p.html?query=value#an&amp;&apos;%2Achor')).toBe(
        "http://example.com/p.html?query=value#an&'*chor",
      );
    });

    it('should return the expected uri decoded string', () => {
      expect(decodeSitemapURL('http://example.com/there?a=5&amp;b=11')).toBe(
        'http://example.com/there?a=5&b=11',
      );
      expect(decodeSitemapURL('http://example.com/there?a=5&amp;b=11#anc%20hor')).toBe(
        'http://example.com/there?a=5&b=11#anc hor',
      );
    });

    // sitemaps.org: decoding inverts all five XML entities — &amp; &apos;
    // &quot; &gt; &lt; — round-tripping encodeSitemapURL.
    it('should decode all five sitemap XML entities (sitemaps.org)', () => {
      expect(decodeSitemapURL('http://example.com/a&amp;b&apos;c&quot;d&lt;e&gt;f')).toBe(
        'http://example.com/a&b\'c"d<e>f',
      );
    });

    it('should throw an uri error if url is more than the maximal allowed length', () => {
      expectThrowWithCode(
        () =>
          decodeSitemapURL(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
          ),
        'URI_MAX_LENGTH_URL',
      );
    });
  });
});
