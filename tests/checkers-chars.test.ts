import { describe, expect, it } from 'vitest';
import {
  isDomainChar,
  isPathChar,
  isPercentEncodingChar,
  isQueryOrFragmentChar,
  isSchemeChar,
  isSitemapPathChar,
  isSitemapQueryOrFragmentChar,
  isSitemapUserinfoChar,
  isUserinfoChar,
} from '../src/checkers/chars.js';
import {
  allowedDomainChars,
  allowedPathChars,
  allowedPathCharsToEncode,
  allowedPercentEncodingChars,
  allowedQueryOrFragmentChars,
  allowedQueryOrFragmentCharsToEncode,
  allowedSchemeChars,
  allowedSitemapPathChars,
  allowedSitemapPathCharsToEncode,
  allowedSitemapQueryOrFragmentChars,
  allowedSitemapQueryOrFragmentCharsToEncode,
  allowedSitemapUserinfoChars,
  allowedSitemapUserinfoCharsToEncode,
  allowedUserinfoChars,
  allowedUserinfoCharsToEncode,
  az,
  digits,
  disallowedDomainChars,
  disallowedOtherChars,
  disallowedPathChars,
  disallowedPathCharsToEncode,
  disallowedPercentEncodingChars,
  disallowedQueryOrFragmentChars,
  disallowedQueryOrFragmentCharsToEncode,
  disallowedSchemeChars,
  disallowedSitemapPathChars,
  disallowedSitemapPathCharsToEncode,
  disallowedSitemapQueryOrFragmentChars,
  disallowedSitemapQueryOrFragmentCharsToEncode,
  disallowedSitemapUserinfoChars,
  disallowedSitemapUserinfoCharsToEncode,
  disallowedUserinfoChars,
  disallowedUserinfoCharsToEncode,
} from './fixtures/chars.js';

describe('#checkers chars', () => {
  describe('when using isSchemeChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedSchemeChars.length; i += 1) {
        expect(isSchemeChar(allowedSchemeChars[i])).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isSchemeChar()).toBe(false);
      expect(isSchemeChar(undefined)).toBe(false);
      expect(isSchemeChar(null)).toBe(false);
      expect(isSchemeChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isSchemeChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isSchemeChar([])).toBe(false);
      expect(isSchemeChar({})).toBe(false);
      expect(isSchemeChar(new Error('error'))).toBe(false);
      expect(isSchemeChar(5)).toBe(false);
      expect(isSchemeChar(true)).toBe(false);
      expect(isSchemeChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedSchemeChars.length; i += 1) {
        expect(isSchemeChar(disallowedSchemeChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSchemeChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should start with a letter', () => {
      for (let i = 0; i < az.length; i += 1) {
        expect(isSchemeChar(az[i])).toBe(true);
        expect(isSchemeChar(az[i], { start: true })).toBe(true);
      }
      for (let i = 0; i < digits.length; i += 1) {
        expect(isSchemeChar(digits[i])).toBe(true);
        expect(isSchemeChar(digits[i], { start: true })).toBe(false);
      }
    });
  });

  describe('when using isUserinfoChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedUserinfoChars.length; i += 1) {
        expect(isUserinfoChar(allowedUserinfoChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedUserinfoCharsToEncode.length; i += 1) {
        expect(isUserinfoChar(allowedUserinfoCharsToEncode[i], true)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isUserinfoChar()).toBe(false);
      expect(isUserinfoChar(undefined)).toBe(false);
      expect(isUserinfoChar(null)).toBe(false);
      expect(isUserinfoChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isUserinfoChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isUserinfoChar([])).toBe(false);
      expect(isUserinfoChar({})).toBe(false);
      expect(isUserinfoChar(new Error('error'))).toBe(false);
      expect(isUserinfoChar(5)).toBe(false);
      expect(isUserinfoChar(true)).toBe(false);
      expect(isUserinfoChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedUserinfoChars.length; i += 1) {
        expect(isUserinfoChar(disallowedUserinfoChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isUserinfoChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedUserinfoCharsToEncode.length; i += 1) {
        expect(isUserinfoChar(disallowedUserinfoCharsToEncode[i], true)).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isUserinfoChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isSitemapUserinfoChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedSitemapUserinfoChars.length; i += 1) {
        expect(isSitemapUserinfoChar(allowedSitemapUserinfoChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedSitemapUserinfoCharsToEncode.length; i += 1) {
        expect(isSitemapUserinfoChar(allowedSitemapUserinfoCharsToEncode[i], true)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isSitemapUserinfoChar()).toBe(false);
      expect(isSitemapUserinfoChar(undefined)).toBe(false);
      expect(isSitemapUserinfoChar(null)).toBe(false);
      expect(isSitemapUserinfoChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isSitemapUserinfoChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isSitemapUserinfoChar([])).toBe(false);
      expect(isSitemapUserinfoChar({})).toBe(false);
      expect(isSitemapUserinfoChar(new Error('error'))).toBe(false);
      expect(isSitemapUserinfoChar(5)).toBe(false);
      expect(isSitemapUserinfoChar(true)).toBe(false);
      expect(isSitemapUserinfoChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedSitemapUserinfoChars.length; i += 1) {
        expect(isSitemapUserinfoChar(disallowedSitemapUserinfoChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapUserinfoChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedSitemapUserinfoCharsToEncode.length; i += 1) {
        expect(isSitemapUserinfoChar(disallowedSitemapUserinfoCharsToEncode[i], true)).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapUserinfoChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isDomainChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedDomainChars.length; i += 1) {
        expect(isDomainChar(allowedDomainChars[i])).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isDomainChar()).toBe(false);
      expect(isDomainChar(undefined)).toBe(false);
      expect(isDomainChar(null)).toBe(false);
      expect(isDomainChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isDomainChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isDomainChar([])).toBe(false);
      expect(isDomainChar({})).toBe(false);
      expect(isDomainChar(new Error('error'))).toBe(false);
      expect(isDomainChar(5)).toBe(false);
      expect(isDomainChar(true)).toBe(false);
      expect(isDomainChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedDomainChars.length; i += 1) {
        expect(isDomainChar(disallowedDomainChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isDomainChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should not start or end with a hyphen', () => {
      for (let i = 0; i < az.length; i += 1) {
        expect(isDomainChar(az[i])).toBe(true);
        expect(isDomainChar(az[i], { start: true, end: true })).toBe(true);
        expect(isDomainChar(az[i], { start: false, end: true })).toBe(true);
        expect(isDomainChar(az[i], { start: true, end: false })).toBe(true);
        expect(isDomainChar(az[i], { start: false, end: false })).toBe(true);
      }
      for (let i = 0; i < digits.length; i += 1) {
        expect(isDomainChar(digits[i])).toBe(true);
        expect(isDomainChar(digits[i], { start: true, end: true })).toBe(true);
        expect(isDomainChar(digits[i], { start: false, end: true })).toBe(true);
        expect(isDomainChar(digits[i], { start: true, end: false })).toBe(true);
        expect(isDomainChar(digits[i], { start: false, end: false })).toBe(true);
      }
      expect(isDomainChar('-', { start: true, end: true })).toBe(false);
      expect(isDomainChar('-', { start: false, end: true })).toBe(false);
      expect(isDomainChar('-', { start: true, end: false })).toBe(false);
      expect(isDomainChar('-', { start: false, end: false })).toBe(true);
    });
  });

  describe('when using isPathChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedPathChars.length; i += 1) {
        expect(isPathChar(allowedPathChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedPathCharsToEncode.length; i += 1) {
        expect(isPathChar(allowedPathCharsToEncode[i], true)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isPathChar()).toBe(false);
      expect(isPathChar(undefined)).toBe(false);
      expect(isPathChar(null)).toBe(false);
      expect(isPathChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isPathChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isPathChar([])).toBe(false);
      expect(isPathChar({})).toBe(false);
      expect(isPathChar(new Error('error'))).toBe(false);
      expect(isPathChar(5)).toBe(false);
      expect(isPathChar(true)).toBe(false);
      expect(isPathChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedPathChars.length; i += 1) {
        expect(isPathChar(disallowedPathChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isPathChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedPathCharsToEncode.length; i += 1) {
        expect(isPathChar(disallowedPathCharsToEncode[i], true)).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isPathChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isSitemapPathChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedSitemapPathChars.length; i += 1) {
        expect(isSitemapPathChar(allowedSitemapPathChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedSitemapPathCharsToEncode.length; i += 1) {
        expect(isSitemapPathChar(allowedSitemapPathCharsToEncode[i], true)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isSitemapPathChar()).toBe(false);
      expect(isSitemapPathChar(undefined)).toBe(false);
      expect(isSitemapPathChar(null)).toBe(false);
      expect(isSitemapPathChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isSitemapPathChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isSitemapPathChar([])).toBe(false);
      expect(isSitemapPathChar({})).toBe(false);
      expect(isSitemapPathChar(new Error('error'))).toBe(false);
      expect(isSitemapPathChar(5)).toBe(false);
      expect(isSitemapPathChar(true)).toBe(false);
      expect(isSitemapPathChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedSitemapPathChars.length; i += 1) {
        expect(isSitemapPathChar(disallowedSitemapPathChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapPathChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedSitemapPathCharsToEncode.length; i += 1) {
        expect(isSitemapPathChar(disallowedSitemapPathCharsToEncode[i], true)).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapPathChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isQueryOrFragmentChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedQueryOrFragmentChars.length; i += 1) {
        expect(isQueryOrFragmentChar(allowedQueryOrFragmentChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedQueryOrFragmentCharsToEncode.length; i += 1) {
        expect(isQueryOrFragmentChar(allowedQueryOrFragmentCharsToEncode[i], true)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isQueryOrFragmentChar()).toBe(false);
      expect(isQueryOrFragmentChar(undefined)).toBe(false);
      expect(isQueryOrFragmentChar(null)).toBe(false);
      expect(isQueryOrFragmentChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isQueryOrFragmentChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isQueryOrFragmentChar([])).toBe(false);
      expect(isQueryOrFragmentChar({})).toBe(false);
      expect(isQueryOrFragmentChar(new Error('error'))).toBe(false);
      expect(isQueryOrFragmentChar(5)).toBe(false);
      expect(isQueryOrFragmentChar(true)).toBe(false);
      expect(isQueryOrFragmentChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedQueryOrFragmentChars.length; i += 1) {
        expect(isQueryOrFragmentChar(disallowedQueryOrFragmentChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isQueryOrFragmentChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedQueryOrFragmentCharsToEncode.length; i += 1) {
        expect(isQueryOrFragmentChar(disallowedQueryOrFragmentCharsToEncode[i], true)).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isQueryOrFragmentChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isSitemapQueryOrFragmentChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedSitemapQueryOrFragmentChars.length; i += 1) {
        expect(isSitemapQueryOrFragmentChar(allowedSitemapQueryOrFragmentChars[i])).toBe(true);
      }
    });

    it('should return true if a char to encode is valid', () => {
      for (let i = 0; i < allowedSitemapQueryOrFragmentCharsToEncode.length; i += 1) {
        expect(
          isSitemapQueryOrFragmentChar(allowedSitemapQueryOrFragmentCharsToEncode[i], true),
        ).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isSitemapQueryOrFragmentChar()).toBe(false);
      expect(isSitemapQueryOrFragmentChar(undefined)).toBe(false);
      expect(isSitemapQueryOrFragmentChar(null)).toBe(false);
      expect(isSitemapQueryOrFragmentChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isSitemapQueryOrFragmentChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isSitemapQueryOrFragmentChar([])).toBe(false);
      expect(isSitemapQueryOrFragmentChar({})).toBe(false);
      expect(isSitemapQueryOrFragmentChar(new Error('error'))).toBe(false);
      expect(isSitemapQueryOrFragmentChar(5)).toBe(false);
      expect(isSitemapQueryOrFragmentChar(true)).toBe(false);
      expect(isSitemapQueryOrFragmentChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedSitemapQueryOrFragmentChars.length; i += 1) {
        expect(isSitemapQueryOrFragmentChar(disallowedSitemapQueryOrFragmentChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapQueryOrFragmentChar(disallowedOtherChars[i])).toBe(false);
      }
    });

    it('should return false if a char to encode is not allowed', () => {
      for (let i = 0; i < disallowedSitemapQueryOrFragmentCharsToEncode.length; i += 1) {
        expect(
          isSitemapQueryOrFragmentChar(disallowedSitemapQueryOrFragmentCharsToEncode[i], true),
        ).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isSitemapQueryOrFragmentChar(disallowedOtherChars[i], true)).toBe(false);
      }
    });
  });

  describe('when using isPercentEncodingChar', () => {
    it('should return true if a char is valid', () => {
      for (let i = 0; i < allowedPercentEncodingChars.length; i += 1) {
        expect(isPercentEncodingChar(allowedPercentEncodingChars[i])).toBe(true);
      }
    });

    // RFC-3986 §2.1 / §6.2.2.1: HEXDIG is case-insensitive (%3a ≡ %3A).
    // A validator MUST accept lowercase a-f; rejecting them rejects valid input.
    it('should accept lowercase hex digits a-f (RFC-3986 §6.2.2.1)', () => {
      for (const char of 'abcdef') {
        expect(isPercentEncodingChar(char)).toBe(true);
      }
      for (const char of 'ABCDEF0123456789') {
        expect(isPercentEncodingChar(char)).toBe(true);
      }
    });

    it('should return false if a char does not exist', () => {
      expect(isPercentEncodingChar()).toBe(false);
      expect(isPercentEncodingChar(undefined)).toBe(false);
      expect(isPercentEncodingChar(null)).toBe(false);
      expect(isPercentEncodingChar(NaN)).toBe(false);
    });

    it('should return false if a char is empty', () => {
      expect(isPercentEncodingChar('')).toBe(false);
    });

    it('should return false if a char is not a string', () => {
      expect(isPercentEncodingChar([])).toBe(false);
      expect(isPercentEncodingChar({})).toBe(false);
      expect(isPercentEncodingChar(new Error('error'))).toBe(false);
      expect(isPercentEncodingChar(5)).toBe(false);
      expect(isPercentEncodingChar(true)).toBe(false);
      expect(isPercentEncodingChar(false)).toBe(false);
    });

    it('should return false if a char is not allowed', () => {
      for (let i = 0; i < disallowedPercentEncodingChars.length; i += 1) {
        expect(isPercentEncodingChar(disallowedPercentEncodingChars[i])).toBe(false);
      }
      for (let i = 0; i < disallowedOtherChars.length; i += 1) {
        expect(isPercentEncodingChar(disallowedOtherChars[i])).toBe(false);
      }
    });
  });
});
