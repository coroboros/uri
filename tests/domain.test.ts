import { describe, expect, it } from 'vitest';
import { isDomain, isDomainLabel } from '../src/domain/index.js';

describe('#domain', () => {
  describe('when using isDomainLabel', () => {
    it('should return true if a label is minimum 1 character and maximum 63', () => {
      expect(isDomainLabel('a')).toBe(true);
      expect(isDomainLabel('a'.repeat(63))).toBe(true);
    });

    it('should return false if a label is less than 1 character and more than 63', () => {
      expect(isDomainLabel('')).toBe(false);
      expect(isDomainLabel('a'.repeat(64))).toBe(false);
    });

    it('should return false if a label is not defined', () => {
      expect(isDomainLabel()).toBe(false);
      expect(isDomainLabel(null)).toBe(false);
      expect(isDomainLabel(undefined)).toBe(false);
      expect(isDomainLabel(NaN)).toBe(false);
    });

    it('should return false if a label is not a string', () => {
      expect(isDomainLabel({})).toBe(false);
      expect(isDomainLabel([])).toBe(false);
      expect(isDomainLabel(new Error('error'))).toBe(false);
      expect(isDomainLabel(true)).toBe(false);
      expect(isDomainLabel(5)).toBe(false);
    });

    it('should return true if a label has lowercase letters, digits or hyphens, start or end with a digit', () => {
      expect(isDomainLabel('a')).toBe(true);
      expect(isDomainLabel('a2')).toBe(true);
      expect(isDomainLabel('2a2')).toBe(true);
      expect(isDomainLabel('aaaaa')).toBe(true);
      expect(isDomainLabel('1')).toBe(true);
      expect(isDomainLabel('a9999')).toBe(true);
      expect(isDomainLabel('9999a')).toBe(true);
      expect(isDomainLabel('a99-99')).toBe(true);
      expect(isDomainLabel('9-9-9-9-a')).toBe(true);
    });

    it('should return false if a label has other characters than lowercase letters, digits or hyphens', () => {
      expect(isDomainLabel('a$')).toBe(false);
      expect(isDomainLabel('a.2')).toBe(false);
      expect(isDomainLabel('2a"2')).toBe(false);
      expect(isDomainLabel('aa!aaa')).toBe(false);
      expect(isDomainLabel('11111*11111')).toBe(false);
      expect(isDomainLabel('a99.99')).toBe(false);
      expect(isDomainLabel('aùéè9')).toBe(false);
      expect(isDomainLabel('LABEL')).toBe(false);
    });

    it('should return false if a label start or end with a hyphen', () => {
      expect(isDomainLabel('-a')).toBe(false);
      expect(isDomainLabel('-')).toBe(false);
      expect(isDomainLabel('2a2-')).toBe(false);
      expect(isDomainLabel('-aa-aaa-')).toBe(false);
      expect(isDomainLabel('-11-111-11-111')).toBe(false);
      expect(isDomainLabel('a99-99-')).toBe(false);
      expect(isDomainLabel('-9')).toBe(false);
    });

    it('should return false if a label has consecutive hyphens', () => {
      expect(isDomainLabel('a-b-c--d')).toBe(false);
      expect(isDomainLabel('--')).toBe(false);
      expect(isDomainLabel('2--a')).toBe(false);
      expect(isDomainLabel('a--a--a')).toBe(false);
      expect(isDomainLabel('11--111-11-111')).toBe(false);
      expect(isDomainLabel('a--9999')).toBe(false);
    });
  });

  describe('when using isDomain', () => {
    it('should return true if a domain name is localhost', () => {
      expect(isDomain('localhost')).toBe(true);
    });

    it('should return true if a domain name has minimum 2 labels and is maximum 255 characters', () => {
      expect(isDomain('g.com')).toBe(true);
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}`),
      ).toBe(true);
    });

    it('should return true if a domain name ends with . as a root label', () => {
      expect(isDomain('example.com.')).toBe(true);
      expect(isDomain('a.com.')).toBe(true);
      expect(isDomain('b.com.')).toBe(true);
      expect(isDomain('a.b.c.d.')).toBe(true);
    });

    it('should return true if a domain label starts with xn-- to support IDN', () => {
      expect(isDomain('xn--fiq228c.com')).toBe(true);
      expect(isDomain('xn--espaol-zwa.com')).toBe(true);
      expect(isDomain('xn--fiq228c.xn--espaol-zwa.com')).toBe(true);
    });

    it('should return false if a domain label starts with xn-- but has invalid label characters', () => {
      expect(isDomain("xn--'-6xd.com")).toBe(false);
      expect(isDomain('xn--/-6xd.com')).toBe(false);
      expect(isDomain('xn--6xd=.com')).toBe(false);
      expect(isDomain('xn--6xéd.com')).toBe(false);
      expect(isDomain('xn--6*xd.com')).toBe(false);
    });

    it('should return true if a domain name has non ASCII characters to support IDN', () => {
      expect(isDomain('中文.com')).toBe(true);
      expect(isDomain('español.com')).toBe(true);
      expect(isDomain('中文.español.com')).toBe(true);
    });

    it('should return false if a domain name is not defined', () => {
      expect(isDomain()).toBe(false);
      expect(isDomain(null)).toBe(false);
      expect(isDomain(undefined)).toBe(false);
      expect(isDomain(NaN)).toBe(false);
    });

    it('should return false if a domain name is not a string', () => {
      expect(isDomain({})).toBe(false);
      expect(isDomain([])).toBe(false);
      expect(isDomain(new Error('error'))).toBe(false);
      expect(isDomain(true)).toBe(false);
      expect(isDomain(5)).toBe(false);
    });

    it('should return false if a domain label does not start with xn--', () => {
      expect(isDomain('xnn--fiq228c.com')).toBe(false);
      expect(isDomain('an--espaol-zwa.com')).toBe(false);
      expect(isDomain('xn--fiq228c.an--espaol-zwa.com')).toBe(false);
    });

    it('should return false if a domain name has no label', () => {
      expect(isDomain('')).toBe(false);
    });

    it('should return false if a domain name is more than 255 characters', () => {
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.com`),
      ).toBe(false);
    });

    it('should return false if a domain name has labels more than 63 characters', () => {
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(64)}.${'c'.repeat(62)}.${'d'.repeat(63)}`),
      ).toBe(false);
    });

    it('should return false if a domain name has only 1 label or an empty label', () => {
      expect(isDomain('g')).toBe(false);
      expect(isDomain(' ')).toBe(false);
      expect(isDomain('     ')).toBe(false);
    });

    it('should return false if a domain name is less than 1 character and more than 63', () => {
      expect(isDomain('')).toBe(false);
      expect(isDomain(`${'a'.repeat(64)}.com`)).toBe(false);
    });

    it('should return false if a domain name has some identical labels', () => {
      expect(isDomain('a.a.a')).toBe(false);
      expect(isDomain('a.b.b')).toBe(false);
      expect(isDomain('example.com.com')).toBe(false);
      expect(isDomain('game.develop.game')).toBe(false);
      expect(isDomain('中文.xn--fiq228c.com')).toBe(false);
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'a'.repeat(63)}`),
      ).toBe(false);
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'b'.repeat(63)}.${'d'.repeat(63)}`),
      ).toBe(false);
      expect(
        isDomain(`${'a'.repeat(63)}.${'a'.repeat(63)}.${'b'.repeat(63)}.${'d'.repeat(63)}`),
      ).toBe(false);
      expect(
        isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'c'.repeat(63)}`),
      ).toBe(false);
    });
  });
});
