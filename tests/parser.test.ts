import { describe, expect, it } from 'vitest';
import { maxPortInteger, minPortInteger } from '../src/config/index.js';
import { hostToURI, parseURI, recomposeURI } from '../src/parser/index.js';

describe('#parser', () => {
  describe('when using hostToURI', () => {
    it('should return the empty string if not a string', () => {
      expect(hostToURI()).toBe('');
      expect(hostToURI(5)).toBe('');
      expect(hostToURI(true)).toBe('');
      expect(hostToURI(new Error('error'))).toBe('');
      expect(hostToURI({})).toBe('');
      expect(hostToURI([])).toBe('');
      expect(hostToURI(null)).toBe('');
      expect(hostToURI(undefined)).toBe('');
      expect(hostToURI(NaN)).toBe('');
    });

    it('should return the exact same string if not a IPv6', () => {
      expect(hostToURI('')).toBe('');
      expect(hostToURI('192.0.2.235')).toBe('192.0.2.235');
      expect(hostToURI('test')).toBe('test');
      expect(hostToURI('1000.2.3.4')).toBe('1000.2.3.4');
      expect(hostToURI('02001:0000:1234:0000:0000:C1C0:ABCD:0876')).toBe(
        '02001:0000:1234:0000:0000:C1C0:ABCD:0876',
      );
    });

    it('should return a string surrounder by brackets if IPv6', () => {
      expect(hostToURI('FF01:0:0:0:0:0:0:101')).toBe('[FF01:0:0:0:0:0:0:101]');
      expect(hostToURI('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(
        '[2001:0db8:85a3:0000:0000:8a2e:0370:7334]',
      );
      expect(hostToURI('2::10')).toBe('[2::10]');
    });
  });

  describe('when using parseURI', () => {
    const parsed = {
      scheme: null,
      authority: null,
      authorityPunydecoded: null,
      userinfo: null,
      host: null,
      hostPunydecoded: null,
      port: null,
      path: null,
      pathqf: null,
      query: null,
      fragment: null,
      href: null,
    };

    it('should return an object with null attributes if no uri is provided', () => {
      expect(parseURI()).toEqual(parsed);
      expect(parseURI(null)).toEqual(parsed);
      expect(parseURI(undefined)).toEqual(parsed);
      expect(parseURI(NaN)).toEqual(parsed);
      expect(parseURI('')).toEqual(parsed);
    });

    it('should return an object with null attributes if uri is not a string', () => {
      expect(parseURI({})).toEqual(parsed);
      expect(parseURI([])).toEqual(parsed);
      expect(parseURI(new Error('error'))).toEqual(parsed);
      expect(parseURI(255)).toEqual(parsed);
      expect(parseURI(true)).toEqual(parsed);
    });

    it('should return an object with all attributes at null if uri has no scheme', () => {
      let parsedURI = parseURI('http');
      expect(parsedURI).toHaveProperty('scheme', null);
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', null);
      expect(parsedURI).toHaveProperty('pathqf', null);
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', null);

      parsedURI = parseURI('httpwwwexample5com');
      expect(parsedURI).toHaveProperty('scheme', null);
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', null);
      expect(parsedURI).toHaveProperty('pathqf', null);
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', null);

      parsedURI = parseURI('example.com');
      expect(parsedURI).toHaveProperty('scheme', null);
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', null);
      expect(parsedURI).toHaveProperty('pathqf', null);
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', null);

      parsedURI = parseURI('example.com/index.html');
      expect(parsedURI).toHaveProperty('scheme', null);
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', null);
      expect(parsedURI).toHaveProperty('pathqf', null);
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', null);

      parsedURI = parseURI('/example.com/index.html');
      expect(parsedURI).toHaveProperty('scheme', null);
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', null);
      expect(parsedURI).toHaveProperty('pathqf', null);
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', null);
    });

    it('should return an object with missing attributes at null if uri is not valid', () => {
      let parsedURI = parseURI('http:///path');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', '');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '/path');
      expect(parsedURI).toHaveProperty('pathqf', '/path');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:/path');

      parsedURI = parseURI('http::path');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', ':path');
      expect(parsedURI).toHaveProperty('pathqf', ':path');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http::path');

      parsedURI = parseURI('http:\\path');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', null);
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', null);
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '\\path');
      expect(parsedURI).toHaveProperty('pathqf', '\\path');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:\\path');

      parsedURI = parseURI('http://');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', '');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:');
    });

    it('should return an object with appropriate attributes if uri is valid', () => {
      let parsedURI = parseURI('foo://example.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'example.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'example.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://example.com:8042/over/there?name=ferret#nose',
      );

      parsedURI = parseURI('foo://user:pass@example.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@example.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@example.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://user:pass@example.com:8042/over/there?name=ferret#nose',
      );

      parsedURI = parseURI('foo://example.com/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'example.com');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty('href', 'foo://example.com/over/there?name=ferret#nose');
    });

    it('should return an object with the original port value if port is not an integer', () => {
      const parsedURI = parseURI('foo://example.com:80g42/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'example.com:80g42');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'example.com:80g42');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('port', '80g42');
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty('href', 'foo://example.com/over/there?name=ferret#nose');
    });

    it('should return an object with the scheme an hosts in lowercase', () => {
      let parsedURI = parseURI('FOO://example.com');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'example.com');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'foo://example.com/');

      parsedURI = parseURI('foo://中文.COM:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );

      parsedURI = parseURI('fOo://WwW.中文.COM:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'www.xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'www.中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'www.xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'www.中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://www.xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
    });

    it('should return an object with the authority and host attributes with the Punycode ASCII serialization value + authorityPunydecoded and hostPunydecoded with the original Unicode serialization value in lowercase', () => {
      let parsedURI = parseURI('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );

      parsedURI = parseURI('foo://xn--fiq228c.com:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );

      parseURI('foo://中文.COM:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );

      parsedURI = parseURI('foo://WWW.xn--fiq228c.COM:8042/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('scheme', 'foo');
      expect(parsedURI).toHaveProperty('authority', 'www.xn--fiq228c.com:8042');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'www.中文.com:8042');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'www.xn--fiq228c.com');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'www.中文.com');
      expect(parsedURI).toHaveProperty('port', 8042);
      expect(parsedURI).toHaveProperty('path', '/over/there');
      expect(parsedURI).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(parsedURI).toHaveProperty('query', 'name=ferret');
      expect(parsedURI).toHaveProperty('fragment', 'nose');
      expect(parsedURI).toHaveProperty(
        'href',
        'foo://www.xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
    });

    it('should return an object with authority and its components at null except original authority components if uri has an invalid host', () => {
      let parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:');

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:');

      parsedURI = parseURI('http://xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http:');

      parsedURI = parseURI('http://user:pass@example.co.jp\\');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@example.co.jp');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@example.co.jp\\');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', 'example.co.jp');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'example.co.jp\\');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://user:pass@example.co.jp/');

      parsedURI = parseURI('http://user:pass@xn--iñvalid.com:8080/path?query=test#fragment');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', null);
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@xn--iñvalid.com:8080');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'xn--iñvalid.com');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '/path');
      expect(parsedURI).toHaveProperty('pathqf', '/path?query=test#fragment');
      expect(parsedURI).toHaveProperty('query', 'query=test');
      expect(parsedURI).toHaveProperty('fragment', 'fragment');
      expect(parsedURI).toHaveProperty('href', 'http:/path?query=test#fragment');
    });

    it('should parse IPv4 hosts', () => {
      let parsedURI = parseURI('http://223.255.255.255');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', '223.255.255.255');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '223.255.255.255');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', '223.255.255.255');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '223.255.255.255');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://223.255.255.255/');

      parsedURI = parseURI('http://user:pass@223.255.255.255');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@223.255.255.255');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@223.255.255.255');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', '223.255.255.255');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '223.255.255.255');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://user:pass@223.255.255.255/');

      parsedURI = parseURI('http://user:pass@223.255.255.255:8080');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@223.255.255.255:8080');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@223.255.255.255:8080');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', '223.255.255.255');
      expect(parsedURI).toHaveProperty('hostPunydecoded', '223.255.255.255');
      expect(parsedURI).toHaveProperty('port', 8080);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://user:pass@223.255.255.255:8080/');
    });

    it('should parse IPv6 hosts', () => {
      let parsedURI = parseURI('http://[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', '[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', '[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('userinfo', null);
      expect(parsedURI).toHaveProperty('host', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://[fe80::7:8%eth0]/');

      parsedURI = parseURI('http://user:pass@[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@[fe80::7:8%eth0]');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('port', null);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://user:pass@[fe80::7:8%eth0]/');

      parsedURI = parseURI('http://user:pass@[fe80::7:8%eth0]:8080');
      expect(parsedURI).toHaveProperty('scheme', 'http');
      expect(parsedURI).toHaveProperty('authority', 'user:pass@[fe80::7:8%eth0]:8080');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'user:pass@[fe80::7:8%eth0]:8080');
      expect(parsedURI).toHaveProperty('userinfo', 'user:pass');
      expect(parsedURI).toHaveProperty('host', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'fe80::7:8%eth0');
      expect(parsedURI).toHaveProperty('port', 8080);
      expect(parsedURI).toHaveProperty('path', '');
      expect(parsedURI).toHaveProperty('pathqf', '');
      expect(parsedURI).toHaveProperty('query', null);
      expect(parsedURI).toHaveProperty('fragment', null);
      expect(parsedURI).toHaveProperty('href', 'http://user:pass@[fe80::7:8%eth0]:8080/');
    });

    // RFC-3986 §3.2.1: userinfo is delimited by the LAST '@', not the first.
    // Splitting on the first '@' silently truncates the host (host confusion).
    it('should split userinfo on the last @ (RFC-3986 §3.2.1)', () => {
      const parsedURI = parseURI('foo://user:pa@ss@example.com:8042/p?q#f');

      expect(parsedURI).toHaveProperty('userinfo', 'user:pa@ss');
      expect(parsedURI).toHaveProperty('host', 'example.com');
      expect(parsedURI).toHaveProperty('port', 8042);
    });

    // RFC-3986 §3.2.2/§3.2.3: for a non-IPv6 authority the port follows the
    // LAST ':'; splitting on the first ':' silently truncates the host.
    it('should split host and port on the last : (RFC-3986 §3.2.2)', () => {
      const parsedURI = parseURI('foo://a:b:8042/p');

      expect(parsedURI).toHaveProperty('host', null);
      expect(parsedURI).toHaveProperty('hostPunydecoded', 'a:b');
      expect(parsedURI).toHaveProperty('authorityPunydecoded', 'a:b:8042');
    });

    // RFC-3986 §5.3: a present-but-empty query/fragment ('') is distinct
    // from an absent one (null) and parse → recompose must be idempotent.
    it('should distinguish a present-empty query/fragment from an absent one (RFC-3986 §5.3)', () => {
      const withEmptyQuery = parseURI('http://example.com/?');
      expect(withEmptyQuery).toHaveProperty('query', '');
      expect(withEmptyQuery).toHaveProperty('href', 'http://example.com/?');

      const withEmptyFragment = parseURI('http://example.com/#');
      expect(withEmptyFragment).toHaveProperty('fragment', '');
      expect(withEmptyFragment).toHaveProperty('href', 'http://example.com/#');

      const absent = parseURI('http://example.com/');
      expect(absent).toHaveProperty('query', null);
      expect(absent).toHaveProperty('fragment', null);
      expect(absent).toHaveProperty('href', 'http://example.com/');

      const both = parseURI('http://example.com/?#');
      expect(both).toHaveProperty('query', '');
      expect(both).toHaveProperty('fragment', '');
      expect(both).toHaveProperty('href', 'http://example.com/?#');
    });

    // RFC-3986 §3.2.3: port = *DIGIT, so an empty port (zero digits) is
    // syntactically valid — present-but-empty ('') and distinct from an
    // absent port (null), not an error.
    it('should keep an empty port present-but-empty, distinct from absent (RFC-3986 §3.2.3)', () => {
      const emptyPort = parseURI('http://example.com:/path');
      expect(emptyPort).toHaveProperty('port', '');
      expect(emptyPort).toHaveProperty('host', 'example.com');
      expect(emptyPort).toHaveProperty('href', 'http://example.com:/path');

      const absentPort = parseURI('http://example.com/path');
      expect(absentPort).toHaveProperty('port', null);
      expect(absentPort).toHaveProperty('href', 'http://example.com/path');
    });
  });

  describe('when using recomposeURI', () => {
    it('should return an empty string if no uri is provided', () => {
      expect(recomposeURI()).toBe('');
      expect(recomposeURI(null)).toBe('');
      expect(recomposeURI(undefined)).toBe('');
      expect(recomposeURI(NaN)).toBe('');
      expect(recomposeURI('')).toBe('');
    });

    it('should return an empty string if uri has no components', () => {
      expect(recomposeURI({})).toBe('');
      expect(recomposeURI([])).toBe('');
      expect(recomposeURI(new Error('error'))).toBe('');
      expect(recomposeURI(255)).toBe('');
      expect(recomposeURI(true)).toBe('');
    });

    it('should return an empty string if uri has no scheme or path', () => {
      const toRecompose = {
        scheme: null,
        userinfo: 'user:pass',
        host: 'example.com',
        port: 8080,
        path: null,
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('');

      toRecompose.scheme = 'foo';
      expect(recomposeURI(toRecompose)).toBe('');

      toRecompose.scheme = null;
      toRecompose.path = '';
      expect(recomposeURI(toRecompose)).toBe('');
    });

    it('should return the recomposed uri if uri has a scheme and a path', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo:');
    });

    it('should return an empty string if uri scheme is not at least one character', () => {
      const toRecompose = {
        scheme: '',
        userinfo: 'user:pass',
        host: 'example.com',
        port: 8080,
        path: '',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('');
    });

    it('should return the recomposed uri if uri scheme is at least one character', () => {
      const toRecompose = {
        scheme: 'f',
        userinfo: null,
        host: null,
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('f:');
    });

    it('should return an empty string if uri host is present and path is not empty or does not start with /', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: 'user:pass',
        host: 'example.com',
        port: 8080,
        path: 'path',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('');
    });

    it('should return the recomposed uri if uri host is present and path is empty or start with /', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'bar.com',
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://bar.com/');

      toRecompose.path = '/';
      expect(recomposeURI(toRecompose)).toBe('foo://bar.com/');

      toRecompose.path = '/baz';
      expect(recomposeURI(toRecompose)).toBe('foo://bar.com/baz');
    });

    it('should return an empty string if uri host is not present and path starts with //', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: '//bar',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('');
    });

    it('should return the recomposed uri if uri host is not present and path does not start with //', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: 'bar',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo:bar');
    });

    it('should return an empty string if uri host is not at least 3 characters', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'ba',
        port: null,
        path: '',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('');
    });

    it('should return the recomposed uri if uri host is at least 3 characters', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'b.r',
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://b.r/');
    });

    it('should add / if path is null or empty but host is not empty', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');
    });

    it('should not add / if path is not null or empty but host is empty', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: 'bar',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo:bar');
    });

    it('should ignore port if not a number', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: '80g80',
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');

      toRecompose.port = NaN;
      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');
    });

    it('should ignore port if out of range', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: minPortInteger - 1,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');

      toRecompose.port = maxPortInteger + 1;
      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');
    });

    it('should parse port', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: '8080',
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com:8080/');
    });

    it('should not ignore port if in range', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: minPortInteger,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe(`foo://example.com:${minPortInteger}/`);

      toRecompose.port = maxPortInteger;
      expect(recomposeURI(toRecompose)).toBe(`foo://example.com:${maxPortInteger}/`);
    });

    it('should ignore userinfo if not at least 1 character', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: '',
        host: 'example.com',
        port: null,
        path: '',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/?a=b#anchor');

      toRecompose.userinfo = null;
      expect(recomposeURI(toRecompose)).toBe('foo://example.com/?a=b#anchor');
    });

    it('should not ignore userinfo if at least 1 character', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: 'u',
        host: 'example.com',
        port: null,
        path: '',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://u@example.com/?a=b#anchor');
    });

    it('should emit ? for a present-empty query, omit it when null (RFC-3986 §5.3)', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: null,
        path: '',
        query: '',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/?#anchor');

      toRecompose.query = null;
      expect(recomposeURI(toRecompose)).toBe('foo://example.com/#anchor');
    });

    it('should not ignore query if at least 1 character', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: null,
        path: '',
        query: 'a=b',
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/?a=b#anchor');
    });

    it('should emit # for a present-empty fragment, omit it when null (RFC-3986 §5.3)', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: null,
        path: '',
        query: null,
        fragment: '',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/#');

      toRecompose.fragment = null;
      expect(recomposeURI(toRecompose)).toBe('foo://example.com/');
    });

    it('should not ignore fragment if at least 1 character', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: 'example.com',
        port: null,
        path: '',
        query: null,
        fragment: 'anchor',
      };

      expect(recomposeURI(toRecompose)).toBe('foo://example.com/#anchor');
    });

    it('should support IPv4 host', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: '23.71.254.72',
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://23.71.254.72/');
    });

    it('should support IPv6 host', () => {
      const toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: '::ffff:192.168.1.26',
        port: null,
        path: '',
        query: null,
        fragment: null,
      };

      expect(recomposeURI(toRecompose)).toBe('foo://[::ffff:192.168.1.26]/');
    });

    it('should return the recomposed uri', () => {
      let toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: '',
        query: null,
        fragment: null,
      };
      expect(recomposeURI(toRecompose)).toBe('foo:');

      toRecompose = {
        scheme: 'foo',
        userinfo: null,
        host: null,
        port: null,
        path: 'bar:baz',
        query: 'a=b',
        fragment: 'anchor',
      };
      expect(recomposeURI(toRecompose)).toBe('foo:bar:baz?a=b#anchor');

      toRecompose = {
        scheme: 'foo',
        userinfo: 'user:pass',
        host: 'bar.com',
        port: 8080,
        path: '/over/there',
        query: 'a=b',
        fragment: 'anchor',
      };
      expect(recomposeURI(toRecompose)).toBe('foo://user:pass@bar.com:8080/over/there?a=b#anchor');
    });
  });
});
