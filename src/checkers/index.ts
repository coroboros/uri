/**
 * checkers
 *
 * - checkPercentEncoding(string, index, stringLen) -> Number throws URIError
 * - checkSitemapEncoding(string, index, stringLen) -> Number throws URIError
 * - checkComponent({ type, string, sitemap } = {}) -> Boolean throws URIError
 * - checkSchemeChars(scheme, len) -> Boolean throws URIError
 * - checkLowercase(uri) -> Boolean throws URIError
 * - checkURISyntax(uri) -> Object throws URIError
 * - checkURI(uri, { sitemap } = {}) -> Object throws URIError
 * - checkHttpURL(uri, { https, web, sitemap } = {}) -> Object throws URIError
 * - checkHttpsURL(uri) -> Object throws URIError
 * - checkHttpSitemapURL(uri) -> Object throws URIError
 * - checkHttpsSitemapURL(uri) -> Object throws URIError
 * - checkWebURL(uri) -> Object throws URIError
 * - checkSitemapURL(uri) -> Object throws URIError
 */
import { maxLengthURL, maxPortInteger, minPortInteger } from '../config/index.js';
import { isDomain } from '../domain/index.js';
import { int, isPort } from '../helpers/cast.js';
import { exists, is } from '../helpers/object.js';
import { isIP } from '../ip/index.js';
import { type ParsedURI, parseURI } from '../parser/index.js';
import { escapeCodesKeys, escapeCodesKeysLen } from '../sitemap/index.js';
import {
  isPathChar,
  isPercentEncodingChar,
  isQueryOrFragmentChar,
  isSchemeChar,
  isSitemapPathChar,
  isSitemapQueryOrFragmentChar,
  isSitemapUserinfoChar,
  isUserinfoChar,
} from './chars.js';

type URIErrorWithCode = URIError & { code: string };

export interface CheckedURI extends ParsedURI {
  valid: true;
}

export interface CheckedURISyntax extends ParsedURI {
  schemeLen: number;
  valid: true;
}

type CharChecker = (char: string, encode?: boolean) => boolean;

/**
 * @func checkPercentEncoding
 *
 * Check a % char found from a string at a specific index has a valid
 * percent encoding following this char.
 */
const checkPercentEncoding = function checkPercentEncoding(
  string: string,
  index: number,
  stringLen: number,
): number {
  if (!is(String, string)) {
    const error = new URIError(
      'a string is required when checking for percent encoding',
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_PERCENT_ENCODING';
    throw error;
  }

  const len = is(Number, stringLen) && stringLen >= 0 ? stringLen : string.length;
  const i = is(Number, index) && index < len ? index : 0;
  let offset = 0;

  if (len > 0 && string.charAt(i) === '%') {
    // should be %[A-F0-9]{2}(%[A-F0-9]{2}){0,1}
    // example: %20 or %C3%BC
    if (i + 2 < len) {
      if (!isPercentEncodingChar(string.charAt(i + 1))) {
        const error = new URIError(
          `invalid percent encoding char '${string.charAt(i + 1)}'`,
        ) as URIErrorWithCode;
        error.code = 'URI_INVALID_PERCENT_ENCODING';
        throw error;
      } else if (!isPercentEncodingChar(string.charAt(i + 2))) {
        const error = new URIError(
          `invalid percent encoding char '${string.charAt(i + 2)}'`,
        ) as URIErrorWithCode;
        error.code = 'URI_INVALID_PERCENT_ENCODING';
        throw error;
      } else {
        offset = 2;
      }
    } else {
      const error = new URIError('incomplete percent encoding found') as URIErrorWithCode;
      error.code = 'URI_INVALID_PERCENT_ENCODING';
      throw error;
    }
  }

  return offset;
};

/**
 * @func checkSitemapEncoding
 *
 * Check an entity in an URL at a specific index has a valid
 * sitemap escape encoding following this char.
 */
const checkSitemapEncoding = function checkSitemapEncoding(
  string: string,
  index: number,
  stringLen: number,
): number {
  if (!is(String, string)) {
    const error = new URIError(
      'a string is required when checking for sitemap encoding',
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_SITEMAP_ENCODING';
    throw error;
  }

  const len = is(Number, stringLen) && stringLen >= 0 ? stringLen : string.length;
  const i = is(Number, index) && index < len ? index : 0;
  let offset = 0;

  // check each &... is an expected escape code
  if (len > 0 && string.charAt(i) === '&') {
    let escapeOffset: number | undefined;

    for (let j = 0; j < escapeCodesKeysLen; j += 1) {
      const code = escapeCodesKeys[j];

      if (code === undefined) {
        break;
      }

      const codeLen = code.length;

      if (i + codeLen <= len && code === string.substring(i, i + codeLen)) {
        escapeOffset = codeLen - 1;
        break;
      }
    }

    if (!exists(escapeOffset)) {
      const error = new URIError(
        `entity '${string.charAt(i)}' is not properly escaped`,
      ) as URIErrorWithCode;
      error.code = 'URI_INVALID_SITEMAP_ENCODING';
      throw error;
    } else {
      offset = escapeOffset;
    }
  }

  return offset;
};

/**
 * @func checkComponent
 *
 * Check a string has valid characters regarding userinfo, path, query,
 * or fragment URI component type.
 *
 * NOTE:
 * - check only if string is present as these components are not required;
 * - path is required but is at least empty,
 *   regexp assures that and checkURISyntax verifies that too.
 */
const checkComponent = function checkComponent({
  type,
  string,
  sitemap,
}: {
  type?: string;
  string?: string | null;
  sitemap?: boolean;
} = {}): boolean {
  if (!['userinfo', 'path', 'query', 'fragment'].includes(type as string)) {
    const error = new URIError(
      `unable to check pathqf, got '${type}' component to check`,
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_CHECKING_COMPONENT';
    throw error;
  }

  // path is always at least empty here, userinfo, query and fragment are not required
  if ((type === 'path' && (!exists(string) || string === '')) || !exists(string)) {
    return true;
  }

  const len = string.length;
  const checkSitemap = sitemap === true;
  let checkCharFunc!: CharChecker;

  switch (type) {
    case 'userinfo':
      checkCharFunc = checkSitemap ? isSitemapUserinfoChar : isUserinfoChar;
      break;
    case 'path':
      checkCharFunc = checkSitemap ? isSitemapPathChar : isPathChar;
      break;
    case 'query':
    case 'fragment':
      checkCharFunc = checkSitemap ? isSitemapQueryOrFragmentChar : isQueryOrFragmentChar;
      break;
    default:
  }

  for (let i = 0; i < len; i += 1) {
    // check character is valid
    if (!checkCharFunc(string.charAt(i))) {
      const error = new URIError(`invalid ${type} char '${string.charAt(i)}'`) as URIErrorWithCode;
      error.code = `URI_INVALID_${(type as string).toUpperCase()}_CHAR`;
      throw error;
    }

    // check percent encodings
    // increase i if a percent encoding has been found (0 if not)
    i += checkPercentEncoding(string, i, len);

    // check sitemap encodings
    if (checkSitemap) {
      // increase i if a sitemap encoding has been found (0 if not)
      i += checkSitemapEncoding(string, i, len);
    }
  }

  return true;
};

/**
 * @func checkSchemeChars
 *
 * Check scheme characters are valid.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-3.1.
 */
const checkSchemeChars = function checkSchemeChars(scheme: string, len?: number): boolean {
  if (!is(String, scheme)) {
    const error = new URIError('scheme must be a string') as URIErrorWithCode;
    error.code = 'URI_INVALID_SCHEME';
    throw error;
  }

  const schemeLen = is(Number, len) && len > 0 ? len : scheme.length;

  if (schemeLen <= 0) {
    const error = new URIError('scheme cannot be empty') as URIErrorWithCode;
    error.code = 'URI_INVALID_SCHEME';
    throw error;
  }

  for (let i = 0; i < schemeLen; i += 1) {
    if (!isSchemeChar(scheme.charAt(i), { start: i === 0 })) {
      const error = new URIError(`invalid scheme char '${scheme.charAt(i)}'`) as URIErrorWithCode;
      error.code = 'URI_INVALID_SCHEME_CHAR';
      throw error;
    }
  }

  return true;
};

/**
 * @func checkLowercase
 *
 * Check a string has not any uppercase characters.
 */
const checkLowercase = function checkLowercase(uri: string): boolean {
  if (!is(String, uri)) {
    const error = new URIError('uri must be a string') as URIErrorWithCode;
    error.code = 'URI_INVALID_TYPE';
    throw error;
  }

  if (uri.toLowerCase() !== uri) {
    const error = new URIError('uri cannot contain any uppercase characters') as URIErrorWithCode;
    error.code = 'URI_INVALID_CHAR';
    throw error;
  }

  return true;
};

/**
 * @func checkURISyntax
 *
 * Check an URI syntax is valid according to RFC-3986.
 *
 * Beware this function does not fully check if an URI is valid.
 * Rules:
 * 1. scheme is required and cannot be empty;
 * 2. path is required and can be empty;
 * 3. if authority is present path must be empty or start with /;
 * 4. if authority is not present path must not start with //;
 * 5. check for inconsistent authority (original vs parsed)
 *    which would mean host parsed was actually wrong.
 */
const checkURISyntax = function checkURISyntax(uri: string): CheckedURISyntax {
  if (!is(String, uri)) {
    const error = new URIError('uri must be a string') as URIErrorWithCode;
    error.code = 'URI_INVALID_TYPE';
    throw error;
  }

  // parse uri and check scheme, authority, pathname and slashes
  // NOTE: parseURI automatically convert host to punycode
  // example:
  const {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
  } = parseURI(uri);
  const schemeLen = is(String, scheme) ? scheme.length : 0;

  // scheme (required)
  if (!is(String, scheme)) {
    const error = new URIError('uri scheme is required') as URIErrorWithCode;
    error.code = 'URI_MISSING_SCHEME';
    throw error;
  } else if (schemeLen <= 0) {
    const error = new URIError('uri scheme must not be empty') as URIErrorWithCode;
    error.code = 'URI_EMPTY_SCHEME';
    throw error;
  }

  // path (required), can be an empty string
  if (!is(String, path)) {
    const error = new URIError('uri path is required') as URIErrorWithCode;
    error.code = 'URI_MISSING_PATH';
    throw error;
  }

  // path: if authority is present path must be empty or start with /
  if (is(String, authority) && authority.length > 0) {
    if (!(path === '' || path.startsWith('/'))) {
      const error = new URIError(
        "path must be empty or start with '/' when authority is present",
      ) as URIErrorWithCode;
      error.code = 'URI_INVALID_PATH';
      throw error;
    }
  } else if (path.startsWith('//')) {
    // if authority is not present path must not start with //
    const error = new URIError(
      "path must not start with '//' when authority is not present",
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_PATH';
    throw error;
  }

  // check for inconsistent authority (original vs parsed) which means
  // host parsed was actually wrong
  if (!exists(authority) && exists(authorityPunydecoded)) {
    const error = new URIError(
      `host must be a valid ip or domain name, got '${hostPunydecoded}'`,
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_HOST';
    throw error;
  }

  return {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
    schemeLen,
    valid: true,
  };
};

/**
 * @func checkURI
 *
 * Check an URI is valid according to RFC-3986.
 *
 * Rules:
 * 1. scheme is required and cannot be empty;
 * 2. path is required and can be empty;
 * 3. if authority is present path must be empty or start with /;
 * 4. if authority is not present path must not start with //;
 * 5. scheme can only have specific characters:
 *    https://tools.ietf.org/html/rfc3986#section-3.1;
 * 6. if authority is present:
 *    1. host must be a valid IP or domain name;
 *    2. userinfo, if any, can only have specific characters:
 *       https://tools.ietf.org/html/rfc3986#section-3.2.1;
 *    3. port, if any, must be an integer in a specific range.
 * 7. path, query and fragment can only have specific characters:
 *    https://tools.ietf.org/html/rfc3986#section-3.3.
 */
const checkURI = function checkURI(
  uri: string,
  { sitemap }: { sitemap?: boolean } = {},
): CheckedURI {
  // check uri type and syntax
  const {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
    schemeLen,
  } = checkURISyntax(uri);

  // check scheme characters
  checkSchemeChars(scheme as string, schemeLen);

  // authority (not required)
  if (exists(authority)) {
    // check userinfo
    checkComponent({ sitemap, type: 'userinfo', string: userinfo });

    // check host is a valid ip first (RFC-3986) or a domain name
    if (!isIP(host as string) && !isDomain(host as string)) {
      const error = new URIError(
        `host must be a valid ip or domain name, got '${host}'`,
      ) as URIErrorWithCode;
      error.code = 'URI_INVALID_HOST';
      throw error;
    }

    // check port is a valid RFC-3986 *DIGIT and in range if any
    if (
      exists(port) &&
      (!isPort(port) || int(port, { ge: minPortInteger, le: maxPortInteger }) === undefined)
    ) {
      const error = new URIError(
        `port must be an integer between ${minPortInteger}-${maxPortInteger}, got '${port}'`,
      ) as URIErrorWithCode;
      error.code = 'URI_INVALID_PORT';
      throw error;
    }
  }

  // check path, query and fragment
  checkComponent({ sitemap, type: 'path', string: path });
  checkComponent({ sitemap, type: 'query', string: query });
  checkComponent({ sitemap, type: 'fragment', string: fragment });

  return {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
    valid: true,
  };
};

/**
 * @func checkHttpURL
 *
 * Check an URI is a valid HTTP URL (sitemap URLs supported to create aliases).
 *
 * This function uses checkURI to check URI provided is valid.
 *
 * Rules:
 * 1. scheme must be http or HTTP;
 * 2. authority is required;
 * 3. URL must be less than max length.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const checkHttpURL = function checkHttpURL(
  uri: string,
  { https, web, sitemap }: { https?: boolean; web?: boolean; sitemap?: boolean } = {},
): CheckedURI {
  // precheck case for sitemap only
  if (sitemap === true) {
    checkLowercase(uri);
  }

  const schemesToCheck: string[] = [];

  if (https === true) {
    schemesToCheck.push('https');
  } else if (web === true) {
    schemesToCheck.push('http', 'https');
  } else {
    schemesToCheck.push('http');
  }

  const {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
  } = checkURI(uri, { sitemap });

  // scheme
  if (!schemesToCheck.includes(scheme as string)) {
    const error = new URIError(
      `scheme must be ${schemesToCheck.join(' or ')}, got '${scheme}'`,
    ) as URIErrorWithCode;
    error.code = 'URI_INVALID_SCHEME';
    throw error;
  }

  // authority
  if (!is(String, authority)) {
    const error = new URIError('authority is required') as URIErrorWithCode;
    error.code = 'URI_MISSING_AUTHORITY';
    throw error;
  }

  // max length
  if (is(String, href) && href.length > maxLengthURL) {
    const error = new URIError(
      `max URL length of ${maxLengthURL} reached: ${href.length}`,
    ) as URIErrorWithCode;
    error.code = 'URI_MAX_LENGTH_URL';
    throw error;
  }

  return {
    scheme,
    authority,
    authorityPunydecoded,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    pathqf,
    query,
    fragment,
    href,
    valid: true,
  };
};

/**
 * @func checkHttpsURL
 *
 * Check an URI is a valid HTTPS URL.
 *
 * Same behavior than checkHttpURL except scheme must be https or HTTPS.
 */
const checkHttpsURL = function checkHttpsURL(uri: string): CheckedURI {
  return checkHttpURL(uri, { https: true });
};

/**
 * @func checkHttpSitemapURL
 *
 * Check an URI is a valid HTTP URL to be used in an XML sitemap file.
 *
 * This function uses checkHttpURL to check URI provided is a valid HTTP URL.
 *
 * Rules:
 * 1. scheme must be http;
 * 2. authority is required;
 * 3. specific characters must be escaped;
 * 4. can only contain lowercase characters;
 * 5. URL must be less than max length.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const checkHttpSitemapURL = function checkHttpSitemapURL(uri: string): CheckedURI {
  return checkHttpURL(uri, { sitemap: true });
};

/**
 * @func checkHttpsSitemapURL
 *
 * Check an URI is a valid HTTPS URL to be used in an XML sitemap file.
 * Same behavior than checkHttpSitemapURL except scheme must be https.
 */
const checkHttpsSitemapURL = function checkHttpsSitemapURL(uri: string): CheckedURI {
  return checkHttpURL(uri, { https: true, sitemap: true });
};

/**
 * @func checkWebURL
 *
 * Check an URI is a valid HTTP or HTTPS URL.
 *
 * Same behavior than checkHttpURL except scheme can be http/HTTP or https/HTTPS.
 */
const checkWebURL = function checkWebURL(uri: string): CheckedURI {
  return checkHttpURL(uri, { web: true });
};

/**
 * @func checkSitemapURL
 *
 * Check an URI is a valid HTTP or HTTPS URL to be used in an XML sitemap file.
 *
 * Same behavior than checkHttpSitemapURL except scheme can be http or https.
 */
const checkSitemapURL = function checkSitemapURL(uri: string): CheckedURI {
  return checkHttpURL(uri, { web: true, sitemap: true });
};

export {
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
};
