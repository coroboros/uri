import { describe, expect, it } from 'vitest';
import {
  checkComponent,
  checkHttpSitemapURL,
  checkHttpsSitemapURL,
  checkHttpsURL,
  checkHttpURL,
  checkLowercase,
  checkPercentEncoding,
  checkSchemeChars,
  checkSitemapEncoding,
  checkSitemapURL,
  checkURI,
  checkURISyntax,
  checkWebURL,
} from '../src/checkers/index.js';
import { maxLengthURL, maxPortInteger, minPortInteger } from '../src/config/index.js';
import {
  AZ,
  allowedPathChars,
  allowedQueryOrFragmentChars,
  allowedSitemapPathChars,
  allowedSitemapQueryOrFragmentChars,
  allowedSitemapUserinfoChars,
  allowedUserinfoChars,
  az,
  disallowed,
  disallowedOtherChars,
  disallowedPathChars,
  disallowedQueryOrFragmentChars,
  disallowedSchemeChars,
  disallowedSitemapPathChars,
  disallowedSitemapQueryOrFragmentChars,
  disallowedSitemapUserinfoChars,
  disallowedUserinfoChars,
} from './fixtures/chars.js';
import {
  http,
  https,
  idn,
  notHttp,
  notHttps,
  notSitemap,
  notUri,
  sitemap,
  uri,
} from './fixtures/uris.js';
import { expectThrowWithCode } from './helpers.js';

describe('#checkers', () => {
  describe('when using checkPercentEncoding', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => checkPercentEncoding(), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding(undefined), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding(null), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding(NaN), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding([]), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(
        () => checkPercentEncoding(new Error('error')),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(() => checkPercentEncoding(5), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding(true), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding(false), 'URI_INVALID_PERCENT_ENCODING');
      expectThrowWithCode(() => checkPercentEncoding({}), 'URI_INVALID_PERCENT_ENCODING');
    });

    it('should return an offset at 0 if a string is empty', () => {
      expect(checkPercentEncoding('')).toBe(0);
    });

    it('should return an offset at 0 if a string is not empty but index is missing', () => {
      expect(checkPercentEncoding('percent%20encoding')).toBe(0);
    });

    it('should return an offset at 0 if a string is not empty but index is not a number', () => {
      expect(checkPercentEncoding('percent%20encoding', {})).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', [])).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', 5)).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', true)).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', 'index')).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', new Error('error'))).toBe(0);
    });

    it('should return an offset at 0 if % character is at a bad index', () => {
      expect(checkPercentEncoding('percent%20encoding', 6)).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', 8)).toBe(0);
    });

    it('should return a correct offset if % character is at the specified index when stringLen is specified', () => {
      expect(checkPercentEncoding('percent%20encoding', 7, 18)).toBe(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 7, 21)).toBe(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 10, 21)).toBe(2);
    });

    it('should return an offset at 0 if % character is at the specified index but stringLen is less than or equal to index', () => {
      expect(checkPercentEncoding('percent%20encoding', 7, 2)).toBe(0);
      expect(checkPercentEncoding('percent%20encoding', 7, 7)).toBe(0);
    });

    it('should throw an uri error if % character is at the specified index but stringLen is misused (index or index + 1 length)', () => {
      expectThrowWithCode(
        () => checkPercentEncoding('percent%20encoding', 7, 8),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%20encoding', 7, 9),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should return a correct offset if % character is at the specified index', () => {
      expect(checkPercentEncoding('percent%20encoding', 7)).toBe(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 7)).toBe(2);
      expect(checkPercentEncoding('percent%C3%BCencoding', 10)).toBe(2);
    });

    it('should throw an uri error when percent encoding is malformed', () => {
      expectThrowWithCode(
        () => checkPercentEncoding('percent%2gncoding', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%2éncoding', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%2%', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%%%', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%2-encoding', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%encoding', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%A', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkPercentEncoding('percent%9', 7),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });
  });

  describe('when using checkSitemapEncoding', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => checkSitemapEncoding(), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding(undefined), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding(null), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding(NaN), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding([]), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(
        () => checkSitemapEncoding(new Error('error')),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(() => checkSitemapEncoding(5), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding(true), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding(false), 'URI_INVALID_SITEMAP_ENCODING');
      expectThrowWithCode(() => checkSitemapEncoding({}), 'URI_INVALID_SITEMAP_ENCODING');
    });

    it('should return an offset at 0 if a string is empty', () => {
      expect(checkSitemapEncoding('')).toBe(0);
    });

    it('should return an offset at 0 if a string is not empty but index is missing', () => {
      expect(checkSitemapEncoding('percent&encoding')).toBe(0);
    });

    it('should return an offset at 0 if a string is not empty but index is not a number', () => {
      expect(checkSitemapEncoding('percent&encoding', {})).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', [])).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', 5)).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', true)).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', 'index')).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', new Error('error'))).toBe(0);
    });

    it('should return an offset at 0 if entity is at a bad index', () => {
      expect(checkSitemapEncoding('percent&encoding', 6)).toBe(0);
      expect(checkSitemapEncoding('percent&encoding', 8)).toBe(0);
    });

    it('should return a correct offset if entity is at the specified index when stringLen is specified', () => {
      expect(checkSitemapEncoding('percent&amp;encoding', 7, 18)).toBe(4);
      expect(checkSitemapEncoding('percent&amp;&apos;encoding', 12, 26)).toBe(5);
    });

    it('should return an offset at 0 if entity is at the specified index but stringLen is less than or equal to index', () => {
      expect(checkSitemapEncoding('percent&amp;encoding', 7, 2)).toBe(0);
      expect(checkSitemapEncoding('percent&amp;encoding', 7, 7)).toBe(0);
    });

    it('should throw an uri error if entity is at the specified index but stringLen is misused (index or index + 1 length)', () => {
      expectThrowWithCode(
        () => checkSitemapEncoding('percent&amp;encoding', 7, 8),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkSitemapEncoding('percent&amp;encoding', 7, 9),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should return a correct offset if entity is at the specified index', () => {
      expect(checkSitemapEncoding('percent&amp;encoding', 7)).toBe(4);
      expect(checkSitemapEncoding('percent&apos;encoding', 7)).toBe(5);
    });

    it('should throw an uri error when sitemap encoding is malformed', () => {
      expectThrowWithCode(
        () => checkSitemapEncoding('percent&ampencoding', 7),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkSitemapEncoding('percent&&', 7),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkSitemapEncoding('percent&apos', 7),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should not throw an uri error when sitemap encoding has invalid characters as isSitemap* funcs are in charge of it', () => {
      expect(() => checkSitemapEncoding('percent*encoding', 7)).not.toThrow();
      expect(() => checkSitemapEncoding("percent'", 7)).not.toThrow();
    });
  });

  describe('when using checkComponent', () => {
    it('should throw an uri error when options is missing or is not an object', () => {
      expectThrowWithCode(() => checkComponent(), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(() => checkComponent(undefined), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(() => checkComponent(NaN), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(() => checkComponent([]), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(
        () => checkComponent(new Error('error')),
        'URI_INVALID_CHECKING_COMPONENT',
      );
      expectThrowWithCode(() => checkComponent(5), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(() => checkComponent(true), 'URI_INVALID_CHECKING_COMPONENT');
      expectThrowWithCode(() => checkComponent(false), 'URI_INVALID_CHECKING_COMPONENT');
    });

    it('should throw an uri error when type is unknown', () => {
      expectThrowWithCode(() => checkComponent({ type: 'type' }), 'URI_INVALID_CHECKING_COMPONENT');
    });

    it('should not throw an uri error when string parameter is not a string or missing', () => {
      expect(() => checkComponent({ type: 'path', string: 5 })).not.toThrow();
      expect(() => checkComponent({ type: 'query', string: [] })).not.toThrow();
      expect(() => checkComponent({ type: 'fragment', string: true })).not.toThrow();
      expect(() => checkComponent({ type: 'path', string: new Error('error') })).not.toThrow();
      expect(() => checkComponent({ type: 'path', string: new Error('error') })).not.toThrow();
      expect(() => checkComponent({ type: 'userinfo', string: new Error('error') })).not.toThrow();
    });

    it('should throw an uri error when type is path and string has invalid char', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowedPathChars }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowedOtherChars }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowed }),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error when type is query and string has invalid char', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: disallowedQueryOrFragmentChars }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: disallowedOtherChars }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: disallowed }),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error when type is fragment and string has invalid char', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: disallowedQueryOrFragmentChars }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: disallowedOtherChars }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: disallowed }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error when type is userinfo and string has invalid char', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: disallowedUserinfoChars }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: disallowedOtherChars }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: disallowed }),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when type is path and string has invalid sitemap char', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowedSitemapPathChars, sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowedOtherChars, sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: disallowed, sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: AZ, sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error when type is query and string has invalid sitemap char', () => {
      expectThrowWithCode(
        () =>
          checkComponent({
            type: 'query',
            string: disallowedSitemapQueryOrFragmentChars,
            sitemap: true,
          }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: disallowedOtherChars, sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: disallowed, sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: AZ, sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error when type is fragment and string has invalid sitemap char', () => {
      expectThrowWithCode(
        () =>
          checkComponent({
            type: 'fragment',
            string: disallowedSitemapQueryOrFragmentChars,
            sitemap: true,
          }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: disallowedOtherChars, sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: disallowed, sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: AZ, sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error when type is userinfo and string has invalid sitemap char', () => {
      expectThrowWithCode(
        () =>
          checkComponent({
            type: 'userinfo',
            string: disallowedSitemapUserinfoChars,
            sitemap: true,
          }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: disallowedOtherChars, sitemap: true }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: disallowed, sitemap: true }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: AZ, sitemap: true }),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when string has invalid percent encoding', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: 'path%2' }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: '%query' }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: 'frag%2ment' }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: 'frag%Cment', sitemap: true }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: 'frag%Pment', sitemap: true }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: 'frag%XYment', sitemap: true }),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: 'frag%XYment', sitemap: true }),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should throw an uri error when string has invalid sitemap encoding if option is true', () => {
      expectThrowWithCode(
        () => checkComponent({ type: 'path', string: "frag'ment", sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'query', string: 'frag*ment', sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: 'frag&ampment', sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'fragment', string: 'frag&aposment', sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkComponent({ type: 'userinfo', string: 'frag&aposment', sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should not throw an uri error when string has invalid sitemap encoding if option is false or missing', () => {
      expect(() => checkComponent({ type: 'path', string: "frag'ment" })).not.toThrow();
      expect(() => checkComponent({ type: 'query', string: 'frag*ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'fragment', string: 'frag&ampment' })).not.toThrow();
      expect(() => checkComponent({ type: 'fragment', string: 'frag&aposment' })).not.toThrow();
      expect(() => checkComponent({ type: 'userinfo', string: 'frag&aposment' })).not.toThrow();

      expect(() =>
        checkComponent({ type: 'path', string: "frag'ment", sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'query', string: 'frag*ment', sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'fragment', string: 'frag&ampment', sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'fragment', string: 'frag&aposment', sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'userinfo', string: 'frag&aposment', sitemap: false }),
      ).not.toThrow();
    });

    it('should not throw an uri error when string has valid sitemap encoding if option is true or false', () => {
      expect(() => checkComponent({ type: 'path', string: 'frag&amp;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'path', string: 'frag&apos;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'query', string: 'frag&amp;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'query', string: 'frag&apos;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'fragment', string: 'frag&amp;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'fragment', string: 'frag&apos;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'userinfo', string: 'frag&amp;ment' })).not.toThrow();
      expect(() => checkComponent({ type: 'userinfo', string: 'frag&apos;ment' })).not.toThrow();

      expect(() =>
        checkComponent({ type: 'path', string: 'frag&amp;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'path', string: 'frag&apos;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'query', string: 'frag&amp;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'query', string: 'frag&apos;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'fragment', string: 'frag&amp;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'fragment', string: 'frag&apos;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'userinfo', string: 'frag&amp;ment', sitemap: true }),
      ).not.toThrow();
      expect(() =>
        checkComponent({ type: 'userinfo', string: 'frag&apos;ment', sitemap: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is path and string has valid chars', () => {
      expect(() =>
        checkComponent({ type: 'path', string: allowedPathChars.replace('%', '') }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is query and string has valid chars', () => {
      expect(() =>
        checkComponent({ type: 'query', string: allowedQueryOrFragmentChars.replace('%', '') }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is fragment and string has valid chars', () => {
      expect(() =>
        checkComponent({ type: 'fragment', string: allowedQueryOrFragmentChars.replace('%', '') }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is userinfo and string has valid chars', () => {
      expect(() =>
        checkComponent({ type: 'userinfo', string: allowedUserinfoChars.replace('%', '') }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is path and string has valid sitemap chars', () => {
      expect(() =>
        checkComponent({
          type: 'path',
          string: allowedSitemapPathChars.replace(/[%&]/g, ''),
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is query and string has valid sitemap chars', () => {
      expect(() =>
        checkComponent({
          type: 'query',
          string: allowedSitemapQueryOrFragmentChars.replace(/[%&]/g, ''),
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error when type is userinfo and string has valid sitemap chars', () => {
      expect(() =>
        checkComponent({
          type: 'userinfo',
          string: allowedSitemapUserinfoChars.replace(/[%&]/g, ''),
          sitemap: true,
        }),
      ).not.toThrow();
    });
  });

  describe('when using checkSchemeChars', () => {
    it('should throw an uri error when scheme is missing or not a string', () => {
      expectThrowWithCode(() => checkSchemeChars(), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(undefined), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(NaN), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars([]), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(new Error('error')), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(5), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(true), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars(false), 'URI_INVALID_SCHEME');
    });

    it('should throw an uri error when scheme is the empty string', () => {
      expectThrowWithCode(() => checkSchemeChars(''), 'URI_INVALID_SCHEME');
      expectThrowWithCode(() => checkSchemeChars('', 0), 'URI_INVALID_SCHEME');
    });

    it('should not throw an uri error when scheme length parameter is 0 and scheme is  not empty', () => {
      expect(() => checkSchemeChars('http', 0)).not.toThrow();
    });

    it('should throw an uri error when scheme has invalid characters', () => {
      expectThrowWithCode(() => checkSchemeChars(disallowedSchemeChars), 'URI_INVALID_SCHEME_CHAR');
    });
  });

  describe('when using checkLowercase', () => {
    it('should throw an uri error when uri is missing or is not a string', () => {
      expectThrowWithCode(() => checkLowercase(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkLowercase(false), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has any uppercase characters', () => {
      expectThrowWithCode(() => checkLowercase('A'), 'URI_INVALID_CHAR');
      expectThrowWithCode(() => checkLowercase('aAa'), 'URI_INVALID_CHAR');
      expectThrowWithCode(() => checkLowercase('aA'), 'URI_INVALID_CHAR');
      expectThrowWithCode(() => checkLowercase('12345See'), 'URI_INVALID_CHAR');
      expectThrowWithCode(() => checkLowercase(AZ), 'URI_INVALID_CHAR');
    });

    it('should not throw an uri error when uri has not any uppercase characters', () => {
      expect(() => checkLowercase(az)).not.toThrow();
      expect(() => checkLowercase('12azlkgdhs9')).not.toThrow();
    });
  });

  describe('when using checkURISyntax', () => {
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => checkURISyntax(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURISyntax({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => checkURISyntax('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkURISyntax('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkURISyntax(':'), 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should not throw an uri error when uri has no path', () => {
      expect(() => checkURISyntax('http:')).not.toThrow();
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', () => {
      expect(() => checkURISyntax('http://example.co.jp//path')).not.toThrow();
      expectThrowWithCode(() => checkURISyntax('http:////path'), 'URI_INVALID_PATH');
    });

    it('should throw an uri error when host was invalid once parsed', () => {
      expectThrowWithCode(() => checkURISyntax('foo://xn--iñvalid.com'), 'URI_INVALID_HOST');
      expectThrowWithCode(() => checkURISyntax('foo://'), 'URI_INVALID_HOST');
    });

    it('should not throw if an uri has at least a scheme and a path', () => {
      expect(() => checkURISyntax('http://example.com')).not.toThrow();
      expect(() => checkURISyntax('http://example.com/path')).not.toThrow();
    });

    it('should not throw when authority is not present and path does not start with //', () => {
      expect(() => checkURISyntax('foo:path')).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkURISyntax('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'foo');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('schemeLen', 3);
      expect(check).toHaveProperty('valid', true);

      check = checkURISyntax('foo://example.com:80g42/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'foo');
      expect(check).toHaveProperty('authority', 'example.com:80g42');
      expect(check).toHaveProperty('authorityPunydecoded', 'example.com:80g42');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', '80g42');
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty('href', 'foo://example.com/over/there?name=ferret#nose');
      expect(check).toHaveProperty('schemeLen', 3);
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkURI that uses checkURISyntax', () => {
    // SAME TESTS FROM checkURISyntax to check consistency
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => checkURI(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkURI({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => checkURI('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkURI('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkURI(':'), 'URI_MISSING_SCHEME');
    });

    // parseURI always returns an empty path, regexp makes it impossible to have a null path

    it('should not throw an uri error when uri has no path', () => {
      expect(() => checkURI('http:')).not.toThrow();
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', () => {
      expect(() => checkURI('http://example.co.jp//path')).not.toThrow();
      expectThrowWithCode(() => checkURI('http:////path'), 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', () => {
      expect(() => checkURI('http://example.com')).not.toThrow();
      expect(() => checkURI('http://example.com/path')).not.toThrow();
    });

    it('should not throw when authority is not present and path does not start with //', () => {
      expect(() => checkURI('foo:path')).not.toThrow();
    });

    // ADDITIONAL TESTS
    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => checkURI('htép://example.com'), 'URI_INVALID_SCHEME_CHAR');
      expectThrowWithCode(() => checkURI('ht°p://example.com'), 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error when uri has invalid percent encodings', () => {
      expectThrowWithCode(
        () => checkURI('http://www.bar.baz/foo%2'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('http://www.bar.baz/foo%2éd'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid characters', () => {
      expectThrowWithCode(
        () => checkURI('foo://usér:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://us€r:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://user:pa[ss@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when userinfo has invalid percent encodings', () => {
      expectThrowWithCode(
        () => checkURI('foo://user%:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://user%20%2z:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://user:%agpass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://user:pass%@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://user:pass%a@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkURI('foo://user&pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkURI('foo://user&amp:pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkURI('foo://user&apos:pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkURI("foo://user'pass@example.com:8042/over/there?name=ferret#nose", {
            sitemap: true,
          }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () =>
          checkURI('foo://user*pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when host is not a valid ip', () => {
      expectThrowWithCode(
        () => checkURI('foo://999.999.999.999:8042/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkURI('foo://[3ffe:b00::1::a]/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
    });

    it('should throw an uri error when host is not a valid domain', () => {
      expectThrowWithCode(
        () => checkURI('foo://aaaaaa:8042/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkURI('foo://com.com/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkURI('foo://example..com/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
    });

    it('should throw an uri error when port is not a number', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:80g42/over/there?name=ferret#nose'),
        'URI_INVALID_PORT',
      );
    });

    // RFC-3986 §3.2.3: port = *DIGIT. JS Number() coerces 0x1F/1e3/0o17 to a
    // finite number; a compliant validator MUST still reject them as ports.
    it('should reject Number()-coercible non-digit ports (RFC-3986 §3.2.3)', () => {
      for (const bad of ['0x1F', '1e3', '0o17', '0b11']) {
        expectThrowWithCode(
          () => checkURI(`foo://example.com:${bad}/over/there?name=ferret#nose`),
          'URI_INVALID_PORT',
        );
      }
    });

    it('should throw an uri error when port is out of range', () => {
      expectThrowWithCode(
        () => checkURI(`foo://example.com:${minPortInteger - 1}/over/there?name=ferret#nose`),
        'URI_INVALID_PORT',
      );
      expectThrowWithCode(
        () => checkURI(`foo://example.com:${maxPortInteger + 1}/over/there?name=ferret#nose`),
        'URI_INVALID_PORT',
      );
    });

    it('should not throw an uri error when port is in range', () => {
      expect(() =>
        checkURI(`foo://example.com:${minPortInteger}/over/there?name=ferret#nose`),
      ).not.toThrow();
      expect(() =>
        checkURI(`foo://example.com:${maxPortInteger}/over/there?name=ferret#nose`),
      ).not.toThrow();
    });

    // RFC-3986 §2.1 / §6.2.2.1: %3a and %3A are equivalent. checkURI MUST NOT
    // reject a URI solely because its percent-encodings use lowercase hex.
    it('should accept lowercase hex percent-encodings (RFC-3986 §6.2.2.1)', () => {
      expect(() => checkURI('foo://example.com:8042/%c3%bcber/%2f?a=%3a#%7e')).not.toThrow();
      expect(() => checkURI('foo://example.com/%3a%2f%3f')).not.toThrow();
    });

    it('should throw an uri error if path has invalid characters', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/thère?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/ôver/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over\\there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/\\over/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over^there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/{over}/the`re?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over|there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over}/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/{there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error if path has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI("foo://example.com:8042/over/th're?name=ferret#nose", { sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/*ver/there?name=ferret#nose', { sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error if path has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/th&ampre?name=ferret#nose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/&apo;ver/there?name=ferret#nose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error if query has invalid characters', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=férret#nose'),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=fe[rret]#nose'),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error if query has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI("foo://example.com:8042/over/thre?n'ame=ferret#nose", { sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?n*me=ferret#nose', { sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error if query has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret&am;#nose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkURI('foo://example.com:8042/over/there?name=fer&apo;ret#nose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error if fragment has invalid characters', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nôse'),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nos[e'),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error if fragment has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI("foo://example.com:8042/over/thre?name=ferret#no'se", { sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?nme=ferret#n*se', { sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error if fragment has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nos&am;e', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkURI('foo://example.com:8042/over/there?name=ferret#n&apo;ose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error when invalid percent encodings are found in path, query or fragment', () => {
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there%2?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there%Ag?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/%2gover/there%20%20?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/%a2over/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/%gover/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/%20over/there%20%20%?name=ferret%#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/%20over/there%20%20%?name=ferret%%#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there%20%20%?name=f%erret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%A'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%eg'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%ag'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%9'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%8g'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkURI('foo://example.com:8042/over/there?name=ferret#nose%az'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should not throw an uri error when unescaped but allowed sitemap characters are found in path, query or fragment if sitemap is false', () => {
      expect(() =>
        checkURI("foo://example.com:8042/it'sover/there?name=ferret#nose", { sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/its%20over/there?nam*e=ferret#nose', { sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/over/there?name=ferret&pseudo=superhero#no*se', {
          sitemap: false,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if an uri is valid', () => {
      expect(() => checkURI('urn:isbn:0-486-27557-4')).not.toThrow();
      expect(() => checkURI('foo://example.com')).not.toThrow();
      expect(() => checkURI('foo://example.co.jp')).not.toThrow();
      expect(() => checkURI('foo://example.co.jp.')).not.toThrow();
      expect(() => checkURI('foo://example.co.jp.')).not.toThrow();
      expect(() => checkURI('foo://example.com.:8042/over/')).not.toThrow();
      expect(() => checkURI('foo://example.com:8042/over/there')).not.toThrow();
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret')).not.toThrow();
      expect(() => checkURI('foo://example.com:8042/over/there?name=ferret#nose')).not.toThrow();
      expect(() =>
        checkURI('foo://user:pass@example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkURI('f://g.h')).not.toThrow();
      expect(() => checkURI('f://g.h.')).not.toThrow();
      expect(() => checkURI('f:')).not.toThrow();
      expect(() => checkURI('urn:')).not.toThrow();
    });

    it('should not throw an uri error if uri has valid sitemap encodings when sitemap is true', () => {
      expect(() =>
        checkURI('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkURI(
          'foo://example.com:8042/it&apos;over/there?name=ferret&amp;pseudo=superhero#nose',
          { sitemap: true },
        ),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/itover/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkURI(
          'foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose&amp;eyes',
          { sitemap: true },
        ),
      ).not.toThrow();
      expect(() =>
        checkURI('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose&apos;', {
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkURI('foo://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'foo');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'foo://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkURI('ftp://user:pass@example.com/');
      expect(check).toHaveProperty('scheme', 'ftp');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'ftp://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkHttpURL that uses checkURI', () => {
    // SAME TESTS FROM checkURISyntax to check consistency
    it('should throw an uri error when uri is not a string', () => {
      expectThrowWithCode(() => checkHttpURL(), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(undefined), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(null), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(NaN), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL([]), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(new Error('error')), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(5), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(true), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL(false), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL({}), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error when uri has no scheme', () => {
      // scheme cannot be an empty string following parseURI behavior
      expectThrowWithCode(() => checkHttpURL('/Users/dir/file.js'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkHttpURL('://example.com'), 'URI_MISSING_SCHEME');
      expectThrowWithCode(() => checkHttpURL(':'), 'URI_MISSING_SCHEME');
    });

    // if authority is present following parseURI behavior path will always be at least empty or start with /

    it('should throw an uri error when authority is not present and path starts with //', () => {
      expect(() => checkHttpURL('http://example.co.jp//path')).not.toThrow();
      expectThrowWithCode(() => checkHttpURL('http:////path'), 'URI_INVALID_PATH');
    });

    it('should not throw if an uri has at least a scheme and a path', () => {
      expect(() => checkHttpURL('http://example.com')).not.toThrow();
      expect(() => checkHttpURL('http://example.com/path')).not.toThrow();
    });

    // SAME TESTS FROM checkURI to check consistency
    it('should throw an uri error when scheme has invalid chars', () => {
      expectThrowWithCode(() => checkHttpURL('htép://example.com'), 'URI_INVALID_SCHEME_CHAR');
      expectThrowWithCode(() => checkHttpURL('ht°p://example.com'), 'URI_INVALID_SCHEME_CHAR');
    });

    it('should throw an uri error when uri has invalid percent encodings', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://www.bar.baz/foo%2'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://www.bar.baz/foo%2éd'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid characters', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://usér:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://us€r:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://user:pa[ss@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when userinfo has invalid percent encodings', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://user%:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://user%20%2z:pass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://user:%agpass@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://user:pass%@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://user:pass%a@example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('http://user&pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://user&amp:pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://user&apos:pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error when userinfo has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL("http://user'pass@example.com:8042/over/there?name=ferret#nose", {
            sitemap: true,
          }),
        'URI_INVALID_USERINFO_CHAR',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://user*pass@example.com:8042/over/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_USERINFO_CHAR',
      );
    });

    it('should throw an uri error when host is not a valid ip', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://999.999.999.999:8042/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://[3ffe:b00::1::a]/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
    });

    it('should throw an uri error when host is not a valid domain', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://aaaaaa:8042/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://com.com/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example..com/over/there?name=ferret#nose'),
        'URI_INVALID_HOST',
      );
    });

    it('should throw an uri error when port is not a number', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:80g42/over/there?name=ferret#nose'),
        'URI_INVALID_PORT',
      );
    });

    it('should throw an uri error if path has invalid characters', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/thère?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/ôver/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over\\there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/\\over/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over^there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/{over}/the`re?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over|there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over}/there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/{there?name=ferret#nose'),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error if path has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL("http://example.com:8042/over/th're?name=ferret#nose", { sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/*ver/there?name=ferret#nose', { sitemap: true }),
        'URI_INVALID_PATH_CHAR',
      );
    });

    it('should throw an uri error if path has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/th&ampre?name=ferret#nose', { sitemap: true }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/&apo;ver/there?name=ferret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error if query has invalid characters', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=férret#nose'),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=fe[rret]#nose'),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error if query has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL("http://example.com:8042/over/thre?n'ame=ferret#nose", { sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?n*me=ferret#nose', { sitemap: true }),
        'URI_INVALID_QUERY_CHAR',
      );
    });

    it('should throw an uri error if query has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret&am;#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=fer&apo;ret#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error if fragment has invalid characters', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nôse'),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nos[e'),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error if fragment has invalid sitemap characters when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL("http://example.com:8042/over/thre?name=ferret#no'se", { sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?nme=ferret#n*se', { sitemap: true }),
        'URI_INVALID_FRAGMENT_CHAR',
      );
    });

    it('should throw an uri error if fragment has invalid sitemap encodings when sitemap is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#nos&am;e', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#n&apo;ose', {
            sitemap: true,
          }),
        'URI_INVALID_SITEMAP_ENCODING',
      );
    });

    it('should throw an uri error when invalid percent encodings are found in path, query or fragment', () => {
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there%2?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there%Ag?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/%2gover/there%20%20?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/%a2over/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/%gover/there%20%20%?name=ferret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/%20over/there%20%20%?name=ferret%#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/%20over/there%20%20%?name=ferret%%#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there%20%20%?name=f%erret#nose'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%A'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%eg'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%ag'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%9'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%8g'),
        'URI_INVALID_PERCENT_ENCODING',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose%az'),
        'URI_INVALID_PERCENT_ENCODING',
      );
    });

    it('should not throw an uri error when unescaped but allowed sitemap characters are found in path, query or fragment if sitemap is false', () => {
      expect(() =>
        checkHttpURL("http://example.com:8042/it'sover/there?name=ferret#nose", { sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/its%20over/there?nam*e=ferret#nose', {
          sitemap: false,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&pseudo=superhero#no*se', {
          sitemap: false,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if an uri is valid', () => {
      expect(() => checkHttpURL('http://example.com')).not.toThrow();
      expect(() => checkHttpURL('http://example.co.jp')).not.toThrow();
      expect(() => checkHttpURL('http://example.co.jp.')).not.toThrow();
      expect(() => checkHttpURL('http://example.co.jp.')).not.toThrow();
      expect(() => checkHttpURL('http://example.com.:8042/over/')).not.toThrow();
      expect(() => checkHttpURL('http://example.com:8042/over/there')).not.toThrow();
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret')).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://user:pass@example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
    });

    it('should not throw an uri error if uri has valid sitemap encodings when sitemap is true', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL(
          'http://example.com:8042/it&apos;over/there?name=ferret&amp;pseudo=superhero#nose',
          { sitemap: true },
        ),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/itover/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL(
          'http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose&amp;eyes',
          { sitemap: true },
        ),
      ).not.toThrow();
      expect(() =>
        checkHttpURL(
          'http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose&apos;',
          { sitemap: true },
        ),
      ).not.toThrow();
    });

    // ADDITIONAL TESTS
    it('should not throw an uri error if a http sitemap uri is valid and sitemap is true', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if a http sitemap uri is valid and sitemap is false', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          sitemap: false,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if a https sitemap uri is valid when https is true and sitemap is false', () => {
      expect(() =>
        checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          https: true,
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          https: true,
          sitemap: false,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if a https sitemap uri is valid when https and sitemap are true', () => {
      expect(() =>
        checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          https: true,
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          https: true,
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should not throw an uri error if a http or https sitemap uri is valid when web is true', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          web: true,
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          web: true,
          sitemap: true,
        }),
      ).not.toThrow();

      expect(() =>
        checkHttpURL('https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
          web: true,
          sitemap: true,
        }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose', {
          web: true,
          sitemap: true,
        }),
      ).not.toThrow();
    });

    it('should throw an uri error if scheme is not http when no option is provided', () => {
      expectThrowWithCode(
        () => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if scheme is not http when no option is provided', () => {
      expectThrowWithCode(
        () => checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpURL('https://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose', {
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL(
            'https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
            {
              sitemap: true,
            },
          ),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if scheme is not http when https and web options are false', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null for http, https and sitemap urls', () => {
      expectThrowWithCode(() => checkHttpURL('http:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: false }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: false, web: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { web: true }),
        'URI_MISSING_AUTHORITY',
      );

      expectThrowWithCode(
        () => checkHttpURL('http:isbn:0-486-27557-4', { sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: false, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: true, web: true, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { https: false, web: true, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkHttpURL('https:isbn:0-486-27557-4', { web: true, sitemap: true }),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should throw an uri error if scheme is not http when https is false and web is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', {
            https: false,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should not throw an uri error when uri is a valid http url', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkHttpURL('http://example.com/')).not.toThrow();
      expect(() =>
        checkHttpURL('http://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com')).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com./')).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com.')).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com:8042/over/there#nose')).not.toThrow();
    });

    it('should throw an uri error if scheme is not https when https is true and web is false', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
          }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: false,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if scheme is not https when https is true and web is true', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
          }),
        'URI_INVALID_SCHEME',
      );

      expectThrowWithCode(
        () =>
          checkHttpURL('foo://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('ftp://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('f://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('c://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', {
            https: true,
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if url is more than the maximal allowed length', () => {
      expectThrowWithCode(
        () =>
          checkHttpURL(
            `http://example.com:8042/${'path'.repeat(maxLengthURL + 1)}?name=ferret#nose`,
          ),
        'URI_MAX_LENGTH_URL',
      );
    });

    // sitemaps.org: a URL must be strictly less than 2,048 characters, so
    // maxLengthURL (2048) is an exclusive bound — exactly 2048 is rejected.
    it('should reject a URL of exactly maxLengthURL and accept maxLengthURL - 1', () => {
      const base = 'http://example.com/';
      const url = (len: number) => base + 'a'.repeat(len - base.length);

      expectThrowWithCode(() => checkHttpURL(url(maxLengthURL)), 'URI_MAX_LENGTH_URL');
      expect(() => checkHttpURL(url(maxLengthURL - 1))).not.toThrow();
    });

    it('should not throw an uri error when uri is a valid https url when https is true', () => {
      expect(() => checkHttpURL('http://example.com:8042/over/there?name=ferret#nose'), {
        https: true,
      }).not.toThrow();
      expect(() => checkHttpURL('https://example.com/', { https: true })).not.toThrow();
      expect(() =>
        checkHttpURL('https://user:pass@example.com:8042/over/there?name=ferret', { https: true }),
      ).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com', { https: true })).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com./', { https: true })).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com.', { https: true })).not.toThrow();
      expect(() =>
        checkHttpURL('https://user:pass@example.com:8042/over/there#nose', { https: true }),
      ).not.toThrow();
    });

    it('should not throw an uri error when uri is a valid http or https url when web is true', () => {
      expect(() =>
        checkHttpURL('http://example.com:8042/over/there?name=ferret#nose', { web: true }),
      ).not.toThrow();
      expect(() => checkHttpURL('http://example.com/', { web: true })).not.toThrow();
      expect(() =>
        checkHttpURL('http://user:pass@example.com:8042/over/there?name=ferret', { web: true }),
      ).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com', { web: true })).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com./', { web: true })).not.toThrow();
      expect(() => checkHttpURL('http://user:pass@example.com.', { web: true })).not.toThrow();
      expect(() =>
        checkHttpURL('http://user:pass@example.com:8042/over/there#nose', { web: true }),
      ).not.toThrow();

      expect(() =>
        checkHttpURL('https://example.com:8042/over/there?name=ferret#nose', { web: true }),
      ).not.toThrow();
      expect(() => checkHttpURL('https://example.com/', { web: true })).not.toThrow();
      expect(() =>
        checkHttpURL('https://user:pass@example.com:8042/over/there?name=ferret', { web: true }),
      ).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com', { web: true })).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com./', { web: true })).not.toThrow();
      expect(() => checkHttpURL('https://user:pass@example.com.', { web: true })).not.toThrow();
      expect(() =>
        checkHttpURL('https://user:pass@example.com:8042/over/there#nose', { web: true }),
      ).not.toThrow();
    });

    it('should throw an uri error if uri is missing or is not a string when sitemap is true', () => {
      expectThrowWithCode(
        () => checkHttpURL(null, { web: true, sitemap: true }),
        'URI_INVALID_TYPE',
      );
      expectThrowWithCode(
        () => checkHttpURL(undefined, { web: true, sitemap: true }),
        'URI_INVALID_TYPE',
      );
      expectThrowWithCode(
        () => checkHttpURL(NaN, { web: true, sitemap: true }),
        'URI_INVALID_TYPE',
      );
      expectThrowWithCode(() => checkHttpURL(5, { web: true, sitemap: true }), 'URI_INVALID_TYPE');
      expectThrowWithCode(
        () => checkHttpURL(true, { web: true, sitemap: true }),
        'URI_INVALID_TYPE',
      );
      expectThrowWithCode(
        () => checkHttpURL(new Error('error'), { web: true, sitemap: true }),
        'URI_INVALID_TYPE',
      );
      expectThrowWithCode(() => checkHttpURL({}, { web: true, sitemap: true }), 'URI_INVALID_TYPE');
      expectThrowWithCode(() => checkHttpURL([], { web: true, sitemap: true }), 'URI_INVALID_TYPE');
    });

    it('should throw an uri error if uri has any uppercase characters when sitemap is true', () => {
      expectThrowWithCode(
        () => checkHttpURL('hTtp://www.domain.com/sitemap', { web: true, sitemap: true }),
        'URI_INVALID_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://wWw.domain.com/sitemap', { web: true, sitemap: true }),
        'URI_INVALID_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://www.domain.com/sItemap', { web: true, sitemap: true }),
        'URI_INVALID_CHAR',
      );
      expectThrowWithCode(
        () => checkHttpURL('http://www.domain.com/sitemap?queRy=5', { web: true, sitemap: true }),
        'URI_INVALID_CHAR',
      );
      expectThrowWithCode(
        () =>
          checkHttpURL('http://www.domain.com/sitemap?query=5#anchoR', {
            web: true,
            sitemap: true,
          }),
        'URI_INVALID_CHAR',
      );
    });

    it('should not throw an uri error if uri has any uppercase characters when sitemap is false', () => {
      expect(() =>
        checkHttpURL('hTtp://www.domain.com/sitemap', { web: true, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://wWw.domain.com/sitemap', { web: true, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://www.domain.com/sItemap', { web: true, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://www.domain.com/sitemap?queRy=5', { web: true, sitemap: false }),
      ).not.toThrow();
      expect(() =>
        checkHttpURL('http://www.domain.com/sitemap?query=5#anchoR', { web: true, sitemap: false }),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkHttpURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'http://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkHttpURL('https://user:pass@example.com/', { https: true });
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);

      check = checkHttpURL('https://user:pass@example.com/', { web: true });
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);

      check = checkHttpURL(
        'https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
        {
          https: true,
          sitemap: true,
        },
      );
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret&amp;pseudo=superhero#nose');
      expect(check).toHaveProperty('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'https://xn--fiq228c.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
      );
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkHttpsURL that uses checkHttpURL', () => {
    it('should throw an uri error if scheme is not https', () => {
      expectThrowWithCode(
        () => checkHttpsURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsURL('http://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(() => checkHttpsURL('https:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
    });

    it('should not throw an uri error when uri is a valid https url', () => {
      expect(() =>
        checkHttpsURL('https://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkHttpsURL('https://example.com/')).not.toThrow();
      expect(() =>
        checkHttpsURL('https://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkHttpsURL('https://user:pass@example.com')).not.toThrow();
      expect(() => checkHttpsURL('https://user:pass@example.com./')).not.toThrow();
      expect(() => checkHttpsURL('https://user:pass@example.com.')).not.toThrow();
      expect(() =>
        checkHttpsURL('https://user:pass@example.com:8042/over/there#nose'),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkHttpsURL('https://user:pass@example.com/');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);

      check = checkHttpsURL(
        'https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
      );
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret&amp;pseudo=superhero#nose');
      expect(check).toHaveProperty('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'https://xn--fiq228c.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
      );
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkHttpSitemapURL that uses checkHttpURL', () => {
    it('should not throw an uri error if a http sitemap uri is valid', () => {
      expect(() =>
        checkHttpSitemapURL(
          'http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
        ),
      ).not.toThrow();
      expect(() =>
        checkHttpSitemapURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose'),
      ).not.toThrow();
    });

    it('should throw an uri error if scheme is not http', () => {
      expectThrowWithCode(
        () => checkHttpSitemapURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpSitemapURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpSitemapURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpSitemapURL('https://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(
        () => checkHttpSitemapURL('http:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error when uri is a valid http url with no characters to escape', () => {
      expect(() =>
        checkHttpSitemapURL('http://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkHttpSitemapURL('http://example.com/')).not.toThrow();
      expect(() =>
        checkHttpSitemapURL('http://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com')).not.toThrow();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com./')).not.toThrow();
      expect(() => checkHttpSitemapURL('http://user:pass@example.com.')).not.toThrow();
      expect(() =>
        checkHttpSitemapURL('http://user:pass@example.com:8042/over/there#nose'),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkHttpSitemapURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'http://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkHttpSitemapURL('http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/there');
      expect(check).toHaveProperty('pathqf', '/there?a=5&amp;b=9');
      expect(check).toHaveProperty('query', 'a=5&amp;b=9');
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkHttpsSitemapURL that uses checkHttpURL', () => {
    it('should not throw an uri error if a https sitemap uri is valid', () => {
      expect(() =>
        checkHttpsSitemapURL(
          'https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
        ),
      ).not.toThrow();
      expect(() =>
        checkHttpsSitemapURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose'),
      ).not.toThrow();
    });

    it('should throw an uri error if scheme is not https', () => {
      expectThrowWithCode(
        () => checkHttpsSitemapURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsSitemapURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsSitemapURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkHttpsSitemapURL('http://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(
        () => checkHttpsSitemapURL('https:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error when uri is a valid https url with no characters to escape', () => {
      expect(() =>
        checkHttpsSitemapURL('https://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkHttpsSitemapURL('https://example.com/')).not.toThrow();
      expect(() =>
        checkHttpsSitemapURL('https://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com')).not.toThrow();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com./')).not.toThrow();
      expect(() => checkHttpsSitemapURL('https://user:pass@example.com.')).not.toThrow();
      expect(() =>
        checkHttpsSitemapURL('https://user:pass@example.com:8042/over/there#nose'),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkHttpsSitemapURL('https://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'https://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkHttpsSitemapURL('https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/there');
      expect(check).toHaveProperty('pathqf', '/there?a=5&amp;b=9');
      expect(check).toHaveProperty('query', 'a=5&amp;b=9');
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkWebURL that uses checkHttpURL', () => {
    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(
        () => checkWebURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkWebURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkWebURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkWebURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null or empty', () => {
      expectThrowWithCode(() => checkWebURL('http:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
      expectThrowWithCode(() => checkWebURL('http:///path', { web: true }), 'URI_INVALID_HOST');
      expectThrowWithCode(() => checkWebURL('https:isbn:0-486-27557-4'), 'URI_MISSING_AUTHORITY');
      expectThrowWithCode(() => checkWebURL('https:///path', { web: true }), 'URI_INVALID_HOST');
    });

    it('should not throw an uri error when uri is a valid http url', () => {
      expect(() =>
        checkWebURL('http://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkWebURL('http://example.com/')).not.toThrow();
      expect(() =>
        checkWebURL('http://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkWebURL('http://user:pass@example.com')).not.toThrow();
      expect(() => checkWebURL('http://user:pass@example.com./')).not.toThrow();
      expect(() => checkWebURL('http://user:pass@example.com.')).not.toThrow();
      expect(() => checkWebURL('http://user:pass@example.com:8042/over/there#nose')).not.toThrow();
    });

    it('should not throw an uri error when uri is a valid https url', () => {
      expect(() => checkWebURL('http://example.com:8042/over/there?name=ferret#nose'), {
        https: true,
      }).not.toThrow();
      expect(() => checkWebURL('https://example.com/', { https: true })).not.toThrow();
      expect(() =>
        checkWebURL('https://user:pass@example.com:8042/over/there?name=ferret', { https: true }),
      ).not.toThrow();
      expect(() => checkWebURL('https://user:pass@example.com', { https: true })).not.toThrow();
      expect(() => checkWebURL('https://user:pass@example.com./', { https: true })).not.toThrow();
      expect(() => checkWebURL('https://user:pass@example.com.', { https: true })).not.toThrow();
      expect(() =>
        checkWebURL('https://user:pass@example.com:8042/over/there#nose', { https: true }),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkWebURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'http://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkWebURL('https://user:pass@example.com/');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);

      check = checkWebURL('http://user:pass@example.com/');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/');
      expect(check).toHaveProperty('pathqf', '/');
      expect(check).toHaveProperty('query', null);
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'http://user:pass@example.com/');
      expect(check).toHaveProperty('valid', true);

      check = checkWebURL('https://中文.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret&amp;pseudo=superhero#nose');
      expect(check).toHaveProperty('query', 'name=ferret&amp;pseudo=superhero');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'https://xn--fiq228c.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
      );
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkSitemapURL that uses checkHttpURL', () => {
    it('should not throw an uri error if a http sitemap uri is valid', () => {
      expect(() =>
        checkSitemapURL('http://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose'),
      ).not.toThrow();
      expect(() =>
        checkSitemapURL('http://example.com:8042/it&apos;sover/there?name=ferret#nose'),
      ).not.toThrow();
    });

    it('should not throw an uri error if a https sitemap uri is valid', () => {
      expect(() =>
        checkHttpsSitemapURL(
          'https://example.com:8042/over/there?name=ferret&amp;pseudo=superhero#nose',
        ),
      ).not.toThrow();
      expect(() =>
        checkHttpsSitemapURL('https://example.com:8042/it&apos;sover/there?name=ferret#nose'),
      ).not.toThrow();
    });

    it('should throw an uri error if scheme is not http or https', () => {
      expectThrowWithCode(
        () => checkSitemapURL('foo://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkSitemapURL('ftp://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkSitemapURL('f://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
      expectThrowWithCode(
        () => checkSitemapURL('c://example.com:8042/over/there?name=ferret#nose'),
        'URI_INVALID_SCHEME',
      );
    });

    it('should throw an uri error if authority is null', () => {
      expectThrowWithCode(
        () => checkSitemapURL('http:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
      expectThrowWithCode(
        () => checkSitemapURL('https:isbn:0-486-27557-4'),
        'URI_MISSING_AUTHORITY',
      );
    });

    it('should not throw an uri error when uri is a valid http or https url with no characters to escape', () => {
      expect(() =>
        checkSitemapURL('http://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkSitemapURL('http://example.com/')).not.toThrow();
      expect(() =>
        checkSitemapURL('http://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkSitemapURL('http://user:pass@example.com')).not.toThrow();
      expect(() => checkSitemapURL('http://user:pass@example.com./')).not.toThrow();
      expect(() => checkSitemapURL('http://user:pass@example.com.')).not.toThrow();
      expect(() =>
        checkSitemapURL('http://user:pass@example.com:8042/over/there#nose'),
      ).not.toThrow();

      expect(() =>
        checkSitemapURL('https://example.com:8042/over/there?name=ferret#nose'),
      ).not.toThrow();
      expect(() => checkSitemapURL('https://example.com/')).not.toThrow();
      expect(() =>
        checkSitemapURL('https://user:pass@example.com:8042/over/there?name=ferret'),
      ).not.toThrow();
      expect(() => checkSitemapURL('https://user:pass@example.com')).not.toThrow();
      expect(() => checkSitemapURL('https://user:pass@example.com./')).not.toThrow();
      expect(() => checkSitemapURL('https://user:pass@example.com.')).not.toThrow();
      expect(() =>
        checkSitemapURL('https://user:pass@example.com:8042/over/there#nose'),
      ).not.toThrow();
    });

    it('should return a specific object if no errors were thrown', () => {
      let check = checkSitemapURL('http://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'http://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkSitemapURL('http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('scheme', 'http');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/there');
      expect(check).toHaveProperty('pathqf', '/there?a=5&amp;b=9');
      expect(check).toHaveProperty('query', 'a=5&amp;b=9');
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'http://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('valid', true);

      check = checkHttpsSitemapURL('https://中文.com:8042/over/there?name=ferret#nose');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'xn--fiq228c.com:8042');
      expect(check).toHaveProperty('authorityPunydecoded', '中文.com:8042');
      expect(check).toHaveProperty('userinfo', null);
      expect(check).toHaveProperty('host', 'xn--fiq228c.com');
      expect(check).toHaveProperty('hostPunydecoded', '中文.com');
      expect(check).toHaveProperty('port', 8042);
      expect(check).toHaveProperty('path', '/over/there');
      expect(check).toHaveProperty('pathqf', '/over/there?name=ferret#nose');
      expect(check).toHaveProperty('query', 'name=ferret');
      expect(check).toHaveProperty('fragment', 'nose');
      expect(check).toHaveProperty(
        'href',
        'https://xn--fiq228c.com:8042/over/there?name=ferret#nose',
      );
      expect(check).toHaveProperty('valid', true);

      check = checkHttpsSitemapURL('https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('scheme', 'https');
      expect(check).toHaveProperty('authority', 'user:pass@example.com');
      expect(check).toHaveProperty('authorityPunydecoded', 'user:pass@example.com');
      expect(check).toHaveProperty('userinfo', 'user:pass');
      expect(check).toHaveProperty('host', 'example.com');
      expect(check).toHaveProperty('hostPunydecoded', 'example.com');
      expect(check).toHaveProperty('port', null);
      expect(check).toHaveProperty('path', '/there');
      expect(check).toHaveProperty('pathqf', '/there?a=5&amp;b=9');
      expect(check).toHaveProperty('query', 'a=5&amp;b=9');
      expect(check).toHaveProperty('fragment', null);
      expect(check).toHaveProperty('href', 'https://user:pass@example.com/there?a=5&amp;b=9');
      expect(check).toHaveProperty('valid', true);
    });
  });

  describe('when using checkURI', () => {
    it('should not throw if the uri is valid', () => {
      uri.forEach((string) => {
        expect(() => checkURI(string)).not.toThrow();
      });
    });

    it('should not throw if the http url is valid', () => {
      http.forEach((string) => {
        expect(() => checkURI(string)).not.toThrow();
      });
    });

    it('should not throw if the https url is valid', () => {
      https.forEach((string) => {
        expect(() => checkURI(string)).not.toThrow();
      });
    });

    it('should not throw if the sitemap url is valid', () => {
      sitemap.forEach((string) => {
        expect(() => checkURI(string)).not.toThrow();
      });
    });

    it('should not throw if the idn url is valid', () => {
      idn.forEach((string) => {
        expect(() => checkURI(string)).not.toThrow();
      });
    });

    it('should throw an uri error if the uri is not valid', () => {
      notUri.forEach((string) => {
        expect(() => checkURI(string)).toThrow(URIError);
      });
    });
  });

  describe('when using checkWebURL', () => {
    it('should not throw if the url is valid', () => {
      http.forEach((string) => {
        expect(() => checkWebURL(string)).not.toThrow();
      });

      https.forEach((string) => {
        expect(() => checkWebURL(string)).not.toThrow();
      });
    });
  });

  describe('when using checkHttpURL', () => {
    it('should not throw if the url is valid', () => {
      http.forEach((string) => {
        expect(() => checkHttpURL(string)).not.toThrow();
      });
    });

    it('should throw an uri error if the url is not valid', () => {
      notHttp.forEach((string) => {
        expect(() => checkHttpURL(string)).toThrow(URIError);
      });
    });
  });

  describe('when using checkHttpsURL', () => {
    it('should not throw if the url is valid', () => {
      https.forEach((string) => {
        expect(() => checkHttpsURL(string)).not.toThrow();
      });
    });

    it('should throw an uri error if the url is not valid', () => {
      notHttps.forEach((string) => {
        expect(() => checkHttpsURL(string)).toThrow(URIError);
      });
    });
  });

  describe('when using checkSitemapURL', () => {
    it('should not throw if the url is valid', () => {
      sitemap.forEach((string) => {
        expect(() => checkSitemapURL(string)).not.toThrow();
      });
    });

    it('should throw an uri error if the url is not valid', () => {
      notSitemap.forEach((string) => {
        expect(() => checkSitemapURL(string)).toThrow(URIError);
      });
    });
  });
});
