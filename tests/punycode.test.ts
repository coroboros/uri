import { describe, expect, it } from 'vitest';
import { punycode, punydecode } from '../src/punycode/index.js';

describe('#punycode', () => {
  describe('when using punycode', () => {
    it('should return an empty string if no domain is provided', () => {
      expect(punycode()).toBe('');
      expect(punycode(null)).toBe('');
      expect(punycode(undefined)).toBe('');
      expect(punycode(NaN)).toBe('');
      expect(punycode('')).toBe('');
    });

    it('should return an empty string if domain is not a string', () => {
      expect(punycode({})).toBe('');
      expect(punycode([])).toBe('');
      expect(punycode(new Error('error'))).toBe('');
      expect(punycode(255)).toBe('');
      expect(punycode(true)).toBe('');
    });

    it('should return an empty string if domain is not valid', () => {
      expect(punycode('xn--iñvalid.com')).toBe('');
      expect(punycode('http://www.host.com')).toBe('');
      expect(punycode('http://www')).toBe('');
      expect(punycode(':-')).toBe('');
    });

    it('should return a punycode ASCII serialization of the domain if domain is a valid IDN', () => {
      expect(punycode('español.com')).toBe('xn--espaol-zwa.com');
      expect(punycode('中文.com')).toBe('xn--fiq228c.com');
      expect(punycode('中文.español.com')).toBe('xn--fiq228c.xn--espaol-zwa.com');
    });

    it('should return a punycode ASCII serialization of the domain if domain is a valid ASCII FQDN', () => {
      expect(punycode('example.com.')).toBe('example.com.');
      expect(punycode('a.b.c.d.e.fg')).toBe('a.b.c.d.e.fg');
      expect(punycode('localhost')).toBe('localhost');
    });

    it('should return the exact same IP if IPv4', () => {
      expect(punycode('18.101.25.153')).toBe('18.101.25.153');
      expect(punycode('0.0.0.0')).toBe('0.0.0.0');
    });

    it('should return the exact same IP if IPv6', () => {
      expect(punycode('::')).toBe('::');
      expect(punycode('fe80::7:8%eth0')).toBe('fe80::7:8%eth0');
    });
  });

  describe('when using punydecode', () => {
    it('should return an empty string if no domain is provided', () => {
      expect(punydecode()).toBe('');
      expect(punydecode(null)).toBe('');
      expect(punydecode(undefined)).toBe('');
      expect(punydecode(NaN)).toBe('');
      expect(punydecode('')).toBe('');
    });

    it('should return an empty string if domain is not a string', () => {
      expect(punydecode({})).toBe('');
      expect(punydecode([])).toBe('');
      expect(punydecode(new Error('error'))).toBe('');
      expect(punydecode(255)).toBe('');
      expect(punydecode(true)).toBe('');
    });

    it('should return an empty string if domain is not valid', () => {
      expect(punydecode('xn--iñvalid.com')).toBe('');
      expect(punydecode('http://www.host.com')).toBe('');
      expect(punydecode('http://www')).toBe('');
      expect(punydecode(':-')).toBe('');
    });

    it('should return a Unicode serialization of the domain if domain is a valid IDN serialized', () => {
      expect(punydecode('xn--espaol-zwa.com')).toBe('español.com');
      expect(punydecode('xn--fiq228c.com')).toBe('中文.com');
      expect(punydecode('xn--fiq228c.xn--espaol-zwa.com')).toBe('中文.español.com');
    });

    it('should return a Unicode serialization of the domain if domain is a valid ASCII FQDN', () => {
      expect(punydecode('example.com.')).toBe('example.com.');
      expect(punydecode('a.b.c.d.e.fg')).toBe('a.b.c.d.e.fg');
      expect(punydecode('localhost')).toBe('localhost');
    });

    it('should return the exact same IP if IPv4', () => {
      expect(punydecode('18.101.25.153')).toBe('18.101.25.153');
      expect(punydecode('0.0.0.0')).toBe('0.0.0.0');
    });

    it('should return the exact same IP if IPv6', () => {
      expect(punydecode('::')).toBe('::');
      expect(punydecode('fe80::7:8%eth0')).toBe('fe80::7:8%eth0');
    });
  });
});
