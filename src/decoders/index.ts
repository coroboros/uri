/**
 * decoders
 *
 * - decodeURIComponentString(component, { sitemap, lowercase } = {}) -> String
 * - decodeURIString(uri, { sitemap, lowercase } = {}) -> String throws URIError
 * - decodeWebURL(uri, { lowercase } = {}) -> String
 * - decodeSitemapURL(uri, { lowercase } = {}) -> String
 */
import { checkSchemeChars, checkURISyntax } from '../checkers/index.js';
import { maxLengthURL, maxPortInteger, minPortInteger } from '../config/index.js';
import { isDomain } from '../domain/index.js';
import { int, isPort } from '../helpers/cast.js';
import { exists, is } from '../helpers/object.js';
import { isIP } from '../ip/index.js';
import { recomposeURI } from '../parser/index.js';
import { escapeCodes, escapeCodesKeys, pencodings, pencodingsKeys } from '../sitemap/index.js';

type URIErrorWithCode = URIError & { code: string };

/**
 * @func decodeURIComponentString
 *
 * Decode an URI component string with Sitemap's escape codes support.
 *
 * Native function decodeURIComponent could throw and to be consistent with
 * encodeURIComponentString the empty string is returned if unable to decode.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const decodeURIComponentString = function decodeURIComponentString(
  component: string,
  { sitemap, lowercase }: { sitemap?: boolean; lowercase?: boolean } = {},
): string {
  if (!is(String, component)) {
    return '';
  }

  const componentToDecode = lowercase === true ? component.toLowerCase() : component;

  if (sitemap === true) {
    const regexp = new RegExp(escapeCodesKeys.concat(pencodingsKeys).join('|'), 'g');
    const uriToDecode = componentToDecode.replace(
      regexp,
      (match) => escapeCodes[match] || pencodings[match] || '',
    );

    try {
      return decodeURIComponent(uriToDecode);
    } catch {
      return '';
    }
  }

  try {
    return decodeURIComponent(componentToDecode);
  } catch {
    return '';
  }
};

/**
 * @func decodeURIString
 *
 * Decode an URI string according to RFC-3986 with basic checking.
 *
 * Checked:
 * - scheme is required;
 * - path is required, can be empty;
 * - port, if any, must be an integer in a specific range;
 * - host must be a valid ip or domain name;
 * - maximum size once encoded for URLs.
 *
 * Support:
 * - IDNs: returns URI with its Punydecoded host (Unicode serialization of the domain), if any;
 * - lower and upper case.
 *
 * Note:
 * - if one of userinfo, path, query or fragment component cannot be decoded, it will be ignored;
 * - native function decodeURI does not support IDNs and cannot properly work
 *   with encodeURI since the function is based on an outdated standard;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase;
 * - to only use with encodeURIString.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const decodeURIString = function decodeURIString(
  uri: string,
  { web, sitemap, lowercase }: { web?: boolean; sitemap?: boolean; lowercase?: boolean } = {},
): string {
  const uriToDecode = is(String, uri) && lowercase === true ? uri.toLowerCase() : uri;
  const webURL = web === true || sitemap === true;

  // check uri type and syntax
  const {
    scheme,
    authority,
    userinfo,
    host,
    hostPunydecoded,
    port,
    path,
    query,
    fragment,
    schemeLen,
  } = checkURISyntax(uriToDecode);

  // scheme must be http or https for web/sitemap or with valid chars, always in lowercase
  if (webURL) {
    if (scheme !== 'http' && scheme !== 'https') {
      const error = new URIError(
        `scheme must be http or https, got '${scheme}'`,
      ) as URIErrorWithCode;
      error.code = 'URI_INVALID_SCHEME';
      throw error;
    }
  } else {
    // check scheme characters, it is not intended to decode a scheme
    checkSchemeChars(scheme as string, schemeLen);
  }

  // authority is required and must be a valid host for web/sitemap
  if (webURL && !is(String, authority)) {
    const error = new URIError('authority is required') as URIErrorWithCode;
    error.code = 'URI_MISSING_AUTHORITY';
    throw error;
  }

  // check host is a valid ip first (RFC-3986) or a domain name
  if (exists(host) && !isIP(host) && !isDomain(host)) {
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

  // userinfo
  // pass lowercase to false option since whole uri has been lowercased if true
  const userinfoDecoded = decodeURIComponentString(userinfo ?? '', { sitemap, lowercase: false });

  // path
  const pathDecoded = decodeURIComponentString(path ?? '', { sitemap, lowercase: false });

  // query
  const queryDecoded = decodeURIComponentString(query ?? '', { sitemap, lowercase: false });

  // fragment
  const fragmentDecoded = decodeURIComponentString(fragment ?? '', { sitemap, lowercase: false });

  const uridecoded = recomposeURI({
    scheme,
    port,
    host: hostPunydecoded,
    userinfo: userinfoDecoded,
    path: pathDecoded,
    query: queryDecoded,
    fragment: fragmentDecoded,
  });

  if (webURL && uridecoded.length > maxLengthURL) {
    const error = new URIError(
      `max URL length of ${maxLengthURL} reached: ${uridecoded.length}`,
    ) as URIErrorWithCode;
    error.code = 'URI_MAX_LENGTH_URL';
    throw error;
  }

  return uridecoded;
};

/**
 * @func decodeWebURL
 *
 * Decode an URI string with basic checking based on RFC-3986 standard applied
 * to HTTP and HTTPS URLs.
 *
 * Uses a fixed decodeURI function to be RFC-3986 compliant.
 *
 * Checked:
 * - scheme must be http/HTTP or https/HTTPS;
 * - path is required, can be empty;
 * - authority is required;
 * - port, if any, must be an integer in a specific range;
 * - parseURI prechecked host, will be null if invalid and so does authority.
 *
 * Support:
 * - IDNs: returns URI with its Punydecoded host
 *   (Unicode serialization of the domain), if any;
 * - lower and upper case.
 *
 * Note:
 * - native function decodeURI does not support IDNs and cannot properly work
 *   with encodeURI since the function is based on an outdated standard;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase;
 * - to use only with encodeWebURL.
 */
const decodeWebURL = function decodeWebURL(
  uri: string,
  { lowercase }: { lowercase?: boolean } = {},
): string {
  return decodeURIString(uri, { lowercase, web: true });
};

/**
 * @func decodeSitemapURL
 *
 * Decode an URI string with basic checking based on RFC-3986 standard applied
 * to HTTP and HTTPS URLs and sitemap requirements regarding escape codes to decode.
 *
 * Checked:
 * - scheme must be http/HTTP or https/HTTPS;
 * - path is required, can be empty;
 * - authority is required;
 * - port, if any, must be an integer in a specific range;
 * - parseURI prechecked host, will be null if invalid and so does authority.
 *
 * Support:
 * - Sitemap's escape codes;
 * - IDNs: returns URI with its Punydecoded host
 *   (Unicode serialization of the domain), if any;
 * - lower and upper case.
 *
 * Note:
 * - native function decodeURI does not support IDNs and cannot properly work
 *   with encodeURI since the function is based on an outdated standard;
 * - to stay fully RFC-3986 compliant, scheme and host are put in lowercase;
 * - to use only with encodeSitemapURL.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986;
 * - https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190.
 */
const decodeSitemapURL = function decodeSitemapURL(
  uri: string,
  { lowercase }: { lowercase?: boolean } = {},
): string {
  return decodeURIString(uri, { lowercase, sitemap: true });
};

export { decodeSitemapURL, decodeURIComponentString, decodeURIString, decodeWebURL };
