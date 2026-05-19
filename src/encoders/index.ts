/**
 * encoders
 *
 * - encodeURIComponentString(uri, { sitemap, lowercase } = {}) -> String
 * - encodeURIString(uri, { web, sitemap, lowercase } = {}) -> String throws URIError
 * - encodeWebURL(uri, { lowercase } = {}) -> String
 * - encodeSitemapURL(uri, { lowercase } = {}) -> String
 */

import {
  isPathChar,
  isQueryOrFragmentChar,
  isSitemapPathChar,
  isSitemapQueryOrFragmentChar,
  isSitemapUserinfoChar,
  isUserinfoChar,
} from '../checkers/chars.js';
import { checkSchemeChars, checkURISyntax } from '../checkers/index.js';
import { maxLengthURL, maxPortInteger, minPortInteger } from '../config/index.js';
import { isDomain } from '../domain/index.js';
import { int, isPort } from '../helpers/cast.js';
import { exists, is } from '../helpers/object.js';
import { isIP } from '../ip/index.js';
import { recomposeURI } from '../parser/index.js';
import { entities, specialChars } from '../sitemap/index.js';

/**
 * @func encodeURIComponentString
 *
 * Encode an URI component according to RFC-3986 with Sitemap entities support.
 *
 * Support:
 * - Sitemap's special characters;
 * - lower and upper case.
 *
 * Note:
 * - only userinfo, path, query and fragment components can be encoded;
 * - scheme and authority host+port can never have percent encoded characters;
 * - the empty string is returned if unable to encode;
 * - sitemap characters must be in lowercase and escaped for XML sitemap.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const encodeURIComponentString = function encodeURIComponentString(
  component: string,
  { type, sitemap, lowercase }: { type?: string; sitemap?: boolean; lowercase?: boolean } = {},
): string {
  if (!is(String, component)) {
    return '';
  }

  const componentToEncode =
    lowercase === true || sitemap === true ? component.toLowerCase() : component;
  const componentToEncodeLen = componentToEncode.length;
  let uricomponent = '';

  for (let i = 0; i < componentToEncodeLen; i += 1) {
    const char = componentToEncode.charAt(i);
    let encoded = false;

    // escape entity or special chars if any FIRST
    if (sitemap === true) {
      const entity = entities[char];
      const special = specialChars[char];

      if (exists(entity)) {
        uricomponent += entity;
        encoded = true;
      } else if (exists(special)) {
        uricomponent += special;
        encoded = true;
      }
    }

    if (!encoded) {
      let isChar: boolean;

      switch (type) {
        case 'userinfo':
          isChar =
            (sitemap === true && isSitemapUserinfoChar(char, true)) || isUserinfoChar(char, true);
          break;
        case 'path':
          isChar = (sitemap === true && isSitemapPathChar(char, true)) || isPathChar(char, true);
          break;
        case 'query':
        case 'fragment':
          isChar =
            (sitemap === true && isSitemapQueryOrFragmentChar(char, true)) ||
            isQueryOrFragmentChar(char, true);
          break;
        default:
          isChar = false;
      }

      uricomponent += !isChar ? encodeURIComponent(char) : char;
    }
  }

  return uricomponent;
};

/**
 * @func encodeURIString
 *
 * Encode an URI string according to RFC-3986 with basic checking.
 *
 * Checked:
 * - scheme is required;
 * - path is required, can be empty;
 * - port, if any, must be an integer in a specific range;
 * - host must be a valid ip or domain name;
 * - maximum size once encoded for URLs.
 *
 * Support:
 * - IDNs: returns URI with its Punycode host, if any;
 * - lower and upper case.
 *
 * Note:
 * - only userinfo, path, query and fragment can be percent encoded;
 * - native function encodeURI encodes string according to RFC-2396 which is outdated;
 * - native function encodeURI also encodes scheme and host that cannot have
 *   percend-encoded characters;
 * - characters that should not be percent-encoded in RFC-3986 are [] to represent IPv6 host;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const encodeURIString = function encodeURIString(
  uri: string,
  { web, sitemap, lowercase }: { web?: boolean; sitemap?: boolean; lowercase?: boolean } = {},
): string {
  const uriToEncode = is(String, uri) && lowercase === true ? uri.toLowerCase() : uri;
  const webURL = web === true || sitemap === true;

  // check uri type and syntax
  const { scheme, authority, userinfo, host, port, path, query, fragment, schemeLen } =
    checkURISyntax(uriToEncode);

  // scheme must be http or https for web/sitemap or with valid chars, always in lowercase
  if (webURL) {
    if (scheme !== 'http' && scheme !== 'https') {
      const error = new URIError(`scheme must be http or https, got '${scheme}'`) as URIError & {
        code: string;
      };
      error.code = 'URI_INVALID_SCHEME';
      throw error;
    }
  } else {
    // check scheme characters, it is not intended to encode a scheme
    checkSchemeChars(scheme as string, schemeLen);
  }

  // authority is required and must be a valid host for web/sitemap
  if (webURL && !is(String, authority)) {
    const error = new URIError('authority is required') as URIError & { code: string };
    error.code = 'URI_MISSING_AUTHORITY';
    throw error;
  }

  // check host is a valid ip first (RFC-3986) or a domain name
  if (exists(host) && !isIP(host) && !isDomain(host)) {
    const error = new URIError(
      `host must be a valid ip or domain name, got '${host}'`,
    ) as URIError & { code: string };
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
    ) as URIError & { code: string };
    error.code = 'URI_INVALID_PORT';
    throw error;
  }

  // userinfo
  // pass lowercase to false option since whole uri has been lowercased if true
  const userinfoEncoded = encodeURIComponentString(userinfo ?? '', {
    sitemap,
    type: 'userinfo',
    lowercase: false,
  });

  // path
  const pathEncoded = encodeURIComponentString(path ?? '', {
    sitemap,
    type: 'path',
    lowercase: false,
  });

  // query — RFC-3986 §5.3: keep an absent query (null) absent; only a
  // present query (including '') is encoded and re-emitted with '?'
  const queryEncoded = is(String, query)
    ? encodeURIComponentString(query, { sitemap, type: 'query', lowercase: false })
    : query;

  // fragment — same defined/absent distinction (RFC-3986 §5.3)
  const fragmentEncoded = is(String, fragment)
    ? encodeURIComponentString(fragment, { sitemap, type: 'fragment', lowercase: false })
    : fragment;

  const uriencoded = recomposeURI({
    scheme,
    host,
    port,
    userinfo: userinfoEncoded,
    path: pathEncoded,
    query: queryEncoded,
    fragment: fragmentEncoded,
  });

  if (webURL && uriencoded.length > maxLengthURL) {
    const error = new URIError(
      `max URL length of ${maxLengthURL} reached: ${uriencoded.length}`,
    ) as URIError & { code: string };
    error.code = 'URI_MAX_LENGTH_URL';
    throw error;
  }

  return uriencoded;
};

/**
 * @func encodeWebURL
 *
 * Encode an URI string with basic checking based on RFC-3986 standard applied
 * to HTTP and HTTPS URLs.
 *
 * Uses a fixed encodeURI function to be RFC-3986 compliant.
 *
 * Checked:
 * - scheme must be http/HTTP or https/HTTPS;
 * - path is required, can be empty;
 * - authority is required;
 * - port, if any, must be an integer in a specific range;
 * - host must be a valid IP or domain name;
 * - maximum size once encoded.
 *
 * Support:
 * - IDNs: returns URL with its Punycode host, if any;
 * - lower and upper case.
 *
 * Note:
 * - only userinfo, path, query and fragment can be percent encoded;
 * - native function encodeURI encodes string according to RFC-2396 which is outdated;
 * - native function encodes also scheme and host that cannot have percend encoded characters;
 * - characters that should not be percent-encoded in RFC-3986 are [] to represent IPv6 host;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986.
 */
const encodeWebURL = function encodeWebURL(
  uri: string,
  { lowercase }: { lowercase?: boolean } = {},
): string {
  return encodeURIString(uri, { lowercase, web: true });
};

/**
 * @func encodeSitemapURL
 *
 * Encode an URI string with basic checking based on RFC-3986 standard applied
 * to HTTP and HTTPS URLs and sitemap requirements regarding special entities to escape.
 *
 * Checked:
 * - scheme must be http/HTTP or https/HTTPS;
 * - path is required, can be empty;
 * - authority is required;
 * - port, if any, must be an integer in a specific range;
 * - host must be a valid IP or domain name;
 * - maximum size once encoded.
 *
 * Support:
 * - Sitemap's special characters;
 * - IDNs: returns URI with its Punycode host, if any;
 * - lower case only.
 *
 * Note:
 * - only userinfo, path, query and fragment can be percent encoded;
 * - native function encodeURI encodes string according to RFC-2396 which is outdated;
 * - native function encodes also scheme and host that cannot have percend encoded characters;
 * - characters that should not be percent-encoded in RFC-3986 are [] to represent IPv6 host;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const encodeSitemapURL = function encodeSitemapURL(uri: string): string {
  return encodeURIString(uri, { lowercase: true, sitemap: true });
};

export { encodeSitemapURL, encodeURIComponentString, encodeURIString, encodeWebURL };
