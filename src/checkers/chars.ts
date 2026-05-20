/**
 * chars checkers
 *
 * - isSchemeChar(char, { start } = {}) -> Boolean
 * - isUserinfoChar(char, encode) -> Boolean
 * - isSitemapUserinfoChar(char, encode) -> Boolean
 * - isDomainChar(char, { start, end } = {}) -> Boolean
 * - isPathChar(char, encode) -> Boolean
 * - isSitemapPathChar(char, encode) -> Boolean
 * - isQueryOrFragmentChar(char, encode) -> Boolean
 * - isSitemapQueryOrFragmentChar(char, encode) -> Boolean
 * - isPercentEncodingChar(char) -> Boolean
 */
import { is } from '../helpers/object.js';

/**
 * @func isSchemeChar
 *
 * Check scheme legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.1.
 *
 * Scheme must start with a letter and be followed by any combination of
 * letters, digits, plus ("+"), period ("."), or hyphen ("-").
 *
 * Letters must be in lowercase.
 *
 * 43             +
 * 45             -
 * 46             .
 * 48 to 57       0-9
 * 97 to 122      a-z
 */
const isSchemeChar = function isSchemeChar(
  char: string,
  { start }: { start?: boolean } = {},
): boolean {
  if (!is(String, char)) {
    return false;
  }

  const code = char.charCodeAt(0);

  if (start) {
    return code >= 97 && code <= 122;
  }

  return (
    (code >= 48 && code <= 57) ||
    (code >= 97 && code <= 122) ||
    code === 43 ||
    code === 45 ||
    code === 46
  );
};

/**
 * @func isUserinfoChar
 *
 * Check userinfo legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.2.1.
 *
 * 33             !
 * 36             $
 * 37             % (not allowed when encoding)
 * 38 to 46       &'()*+,-.
 * 48 to 57       0-9
 * 58             :
 * 59             ;
 * 61             =
 * 65 to 90       A-Z
 * 95             _
 * 97 to 122      a-z
 * 126            ~
 */
const isUserinfoChar = function isUserinfoChar(char: string, encode?: boolean): boolean {
  if (!is(String, char)) {
    return false;
  }

  // false by default
  const encoding = encode === true;
  const code = char.charCodeAt(0);

  // % is not allowed when encoding
  if (code === 37) {
    return !encoding;
  }

  return (
    (code >= 38 && code <= 46) ||
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    code === 33 ||
    code === 36 ||
    code === 58 ||
    code === 59 ||
    code === 61 ||
    code === 95 ||
    code === 126
  );
};

/**
 * @func isSitemapUserinfoChar
 *
 * Check sitemap userinfo legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.2.1;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 *
 * Removed AZ ' and *
 *
 * 33             !
 * 36             $
 * 37             % (not allowed when encoding)
 * 38             & (allowed but must be a proper escape code)
 * 40 to 41       ()
 * 43 to 46       +,-.
 * 48 to 57       0-9
 * 58             :
 * 59             ;
 * 61             =
 * 95             _
 * 97 to 122      a-z
 * 126            ~
 */
const isSitemapUserinfoChar = function isSitemapUserinfoChar(
  char: string,
  encode?: boolean,
): boolean {
  if (!is(String, char)) {
    return false;
  }

  // false by default
  const encoding = encode === true;
  const code = char.charCodeAt(0);

  // % is not allowed when encoding
  if (code === 37) {
    return !encoding;
  }

  return (
    (code >= 40 && code <= 41) ||
    (code >= 43 && code <= 46) ||
    (code >= 48 && code <= 57) ||
    (code >= 97 && code <= 122) ||
    code === 33 ||
    code === 36 ||
    code === 38 ||
    code === 58 ||
    code === 59 ||
    code === 61 ||
    code === 95 ||
    code === 126
  );
};

/**
 * @func isDomainChar
 *
 * Check domain legal codes according to
 * - RFC-1034 https://www.ietf.org/rfc/rfc1034.txt.
 *
 * 45             -
 * 48 to 57       0-9
 * 97 to 122      a-z
 */
const isDomainChar = function isDomainChar(
  char: string,
  { start, end }: { start?: boolean; end?: boolean } = {},
): boolean {
  if (!is(String, char)) {
    return false;
  }

  const code = char.charCodeAt(0);

  if ((start === true || end === true) && code === 45) {
    return false;
  }

  return (code >= 48 && code <= 57) || (code >= 97 && code <= 122) || code === 45;
};

/**
 * @func isPathChar
 *
 * Check path legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.3.
 *
 * 33             !
 * 36 to 59       $%&'()*+,-./0-9:;
 * 61             =
 * 64 to 90       @A-Z
 * 95             _
 * 97 to 122      a-z
 * 126            ~
 */
const isPathChar = function isPathChar(char: string, encode?: boolean): boolean {
  if (!is(String, char)) {
    return false;
  }

  // false by default
  const encoding = encode === true;
  const code = char.charCodeAt(0);

  // % is not allowed when encoding
  if (code === 37) {
    return !encoding;
  }

  return (
    (code >= 36 && code <= 59) ||
    (code >= 64 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    code === 33 ||
    code === 61 ||
    code === 95 ||
    code === 126
  );
};

/**
 * @func isSitemapPathChar
 *
 * Check path legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.3.
 *
 * Removed AZ ' and *
 *
 * 33             !
 * 36 to 38       $%& (& allowed but must be a proper escape code)
 * 40 to 41       ()
 * 43 to 59       +,-./0-9:;
 * 61             =
 * 64             @
 * 95             _
 * 97 to 122      a-z
 * 126            ~
 */
const isSitemapPathChar = function isSitemapPathChar(char: string, encode?: boolean): boolean {
  if (!is(String, char)) {
    return false;
  }

  // false by default
  const encoding = encode === true;
  const code = char.charCodeAt(0);

  // % is not allowed when encoding
  if (code === 37) {
    return !encoding;
  }

  return (
    (code >= 36 && code <= 38) ||
    (code >= 40 && code <= 41) ||
    (code >= 43 && code <= 59) ||
    (code >= 97 && code <= 122) ||
    code === 33 ||
    code === 61 ||
    code === 64 ||
    code === 95 ||
    code === 126
  );
};

/**
 * @func isQueryOrFragmentChar
 *
 * Check query/fragment legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.4;
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.5.
 *
 * path char
 * 63             ?
 */
const isQueryOrFragmentChar = function isQueryOrFragmentChar(
  char: string,
  encode?: boolean,
): boolean {
  if (isPathChar(char, encode)) {
    return true;
  }

  return is(String, char) && char.charCodeAt(0) === 63;
};

/**
 * @func isSitemapQueryOrFragmentChar
 *
 * Check query/fragment legal ascii codes according to
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.4;
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.5.
 *
 * sitemap path char
 * 63             ?
 */
const isSitemapQueryOrFragmentChar = function isSitemapQueryOrFragmentChar(
  char: string,
  encode?: boolean,
): boolean {
  if (isSitemapPathChar(char, encode)) {
    return true;
  }

  return is(String, char) && char.charCodeAt(0) === 63;
};

/**
 * @func isPercentEncodingChar
 *
 * Check percent encoding legal ascii codes according to RFC-3986 https://tools.ietf.org/html/rfc3986#section-2.1.
 *
 * HEXDIG is case-insensitive: %3a and %3A are equivalent
 * (RFC-3986 https://tools.ietf.org/html/rfc3986#section-6.2.2.1).
 *
 * 48 to 57       0-9
 * 65 to 70       A-F
 * 97 to 102      a-f
 */
const isPercentEncodingChar = function isPercentEncodingChar(char: string): boolean {
  if (!is(String, char)) {
    return false;
  }

  const code = char.charCodeAt(0);

  return (code >= 48 && code <= 57) || (code >= 65 && code <= 70) || (code >= 97 && code <= 102);
};

export {
  isDomainChar,
  isPathChar,
  isPercentEncodingChar,
  isQueryOrFragmentChar,
  isSchemeChar,
  isSitemapPathChar,
  isSitemapQueryOrFragmentChar,
  isSitemapUserinfoChar,
  isUserinfoChar,
};
