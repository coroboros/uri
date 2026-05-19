/**
 * parser
 *
 * - hostToURI(host) -> String
 * - recomposeURI({ scheme, userinfo, host port, path, query, fragment } = {}) -> String
 * - parseURI(uri) -> Object
 */
import { maxPortInteger, minPortInteger } from '../config/index.js';
import { int, isPort } from '../helpers/cast.js';
import { exists, is } from '../helpers/object.js';
import { isIPv6 } from '../ip/index.js';
import { punycode, punydecode } from '../punycode/index.js';

export interface ParsedURI {
  scheme: string | null;
  authority: string | null;
  authorityPunydecoded: string | null;
  userinfo: string | null;
  host: string | null;
  hostPunydecoded: string | null;
  port: number | string | null;
  path: string | null;
  pathqf: string | null;
  query: string | null;
  fragment: string | null;
  href: string | null;
}

export interface URIComponents {
  scheme?: string | null;
  userinfo?: string | null;
  host?: string | null;
  port?: number | string | null;
  path?: string | null;
  query?: string | null;
  fragment?: string | null;
}

// regexp parsing uri from RFC-3986 https://tools.ietf.org/html/rfc3986#appendix-B
// adding ?: to disable capturing some groups
const uriRegexp = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

// detect IPv6 (regex based on RFC-3986 one): [ipv6]:port
const ipv6Regexp = /^(?:\[([^\]]+)\]:?)([0-9]+)?$/;

/**
 * @func hostToURI
 *
 * Format host with special [] for IPv6. The empty string is returned if host
 * is not a string.
 */
const hostToURI = function hostToURI(host: string): string {
  if (!is(String, host)) {
    return '';
  }

  return isIPv6(host) ? `[${host}]` : host;
};

/**
 * @func recomposeURI
 *
 * Recompose an URI from its components with basic URI checking.
 *
 * The empty string is returned if unable to recompose the URI.
 *
 * Rules:
 * 1. scheme is required and must be at least 1 character;
 * 2. path is required and can be empty;
 * 3. if host is present path must be empty or start with /;
 * 4. if host is not present path must not start with //;
 * 5. host, if any, must be at least 3 characters;
 * 6. userinfo will be ignored if empty;
 * 7. port will be ignored if empty or not an integer;
 * 8. query is emitted when defined (a string, including ''); a null
 *    or undefined query is omitted (RFC-3986 §5.3);
 * 9. fragment is emitted when defined (a string, including ''); a null
 *    or undefined fragment is omitted (RFC-3986 §5.3).
 *
 * Support:
 * - IPv4 and IPv6.
 *
 * Note:
 * / is added to any URI with a host and an empty path.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986.
 */
const recomposeURI = function recomposeURI(components?: URIComponents): string {
  const cpts = components || {};
  const defaultReturnValue = '';
  const { scheme, userinfo, host, port, path, query, fragment } = cpts;

  if (!(is(String, scheme) && scheme.length > 0) || !is(String, path)) {
    return defaultReturnValue;
  }

  let uri = scheme;

  if (is(String, host)) {
    if (!(path === '' || path.startsWith('/'))) {
      return defaultReturnValue;
    }

    if (host.length <= 2) {
      return defaultReturnValue;
    }

    uri += '://';

    if (is(String, userinfo) && userinfo.length > 0) {
      uri += `${userinfo}@`;
    }

    uri += hostToURI(host);

    if (
      exists(port) &&
      isPort(port) &&
      int(port, { ge: minPortInteger, le: maxPortInteger }) !== undefined
    ) {
      uri += `:${port}`;
    }
  } else {
    if (path.startsWith('//')) {
      return defaultReturnValue;
    }

    uri += ':';
  }

  // add / if any host but path is empty and query/fragment is not
  if (path === '' && is(String, host)) {
    uri += '/';
  } else {
    uri += path;
  }

  // RFC-3986 §5.3: emit the delimiter whenever the component is defined,
  // including the empty string (a defined-empty query/fragment)
  if (is(String, query)) {
    uri += `?${query}`;
  }

  if (is(String, fragment)) {
    uri += `#${fragment}`;
  }

  return uri;
};

/**
 * @func parseURI
 *
 * Parse a string to get URI components.
 *
 * Support:
 * - IPv4 and IPv6 hosts;
 * - Internationalized Domain Name (IDN).
 *
 * Note:
 * - RegExp from RFC-3986 https://tools.ietf.org/html/rfc3986#appendix-B;
 * - scheme and host strings will always be put in lowercase once parsed,
 *   as specified in RFC-3986;
 * - authority and its components will be put at null values if authority
 *   parsed is missing or empty.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986.
 */
const parseURI = function parseURI(uri: string): ParsedURI {
  const parsed: ParsedURI = {
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

  // return an object with null attributes if uri is not a string or an empty string
  if (!(is(String, uri) && uri.length > 0)) {
    return parsed;
  }

  // extract uri components from RegExp
  const [, scheme, authorityParsed, path, queryParsed, fragmentParsed] = uri.match(uriRegexp) ?? [];

  // scheme is required and must be a not empty string or this is not an uri
  if (!(is(String, scheme) && scheme.length > 0)) {
    return parsed;
  }

  let authority: string | null = null;
  let authorityPunydecoded: string | null = null;
  let userinfo: string | null = null;
  let host: string | null = null;
  let hostPunydecoded: string | null = null;
  let port: number | string | null = null;

  // parse authority components, if any
  if (is(String, authorityParsed)) {
    let hostAndPort: string | null = null;

    // RFC-3986 §3.2.1: userinfo is delimited by the last '@' before the host
    const userinfoEnd = authorityParsed.lastIndexOf('@');

    if (userinfoEnd === -1) {
      hostAndPort = authorityParsed;
    } else {
      userinfo = authorityParsed.slice(0, userinfoEnd);
      hostAndPort = authorityParsed.slice(userinfoEnd + 1);
    }

    // try to extract host and port only if any
    if (is(String, hostAndPort)) {
      // detect IPv6 here first
      const ipv6Match = hostAndPort.match(ipv6Regexp);
      let hostParsed: string | null = null;
      let portToCast: string | null = null;

      // if an array then it's constructed as an ipv6
      if (Array.isArray(ipv6Match)) {
        [, hostParsed = null, portToCast = null] = ipv6Match;
      } else {
        // not an ipv6 — RFC-3986 §3.2.2/§3.2.3: port follows the last ':'
        const portStart = hostAndPort.lastIndexOf(':');

        if (portStart === -1) {
          hostParsed = hostAndPort;
        } else {
          hostParsed = hostAndPort.slice(0, portStart);
          portToCast = hostAndPort.slice(portStart + 1);
        }
      }

      // hostPunydecoded should be the host in Unicode, host its Punycode value
      const hostLowerCase = is(String, hostParsed) ? hostParsed.toLowerCase() : null;
      const toASCII = punycode(hostLowerCase ?? '');
      const toUnicode = punydecode(hostLowerCase ?? '');

      // host parsed was in Unicode
      if (hostLowerCase !== toASCII) {
        host = toASCII;
        hostPunydecoded = hostLowerCase;
      } else if (hostLowerCase !== toUnicode) {
        // host parsed was punycoded
        host = hostLowerCase;
        hostPunydecoded = toUnicode;
      } else {
        host = hostLowerCase;
        hostPunydecoded = hostLowerCase;
      }

      // we only keep original authority/host parsed so using parseURI allows to
      // see issues with provided host
      if (host === '' || hostPunydecoded === '') {
        host = null;
      }

      // necessary to handle possible port errors when checking uri
      // port is a valid integer or we keep its initial value to be aware of the error
      // here we also don't check wrong range for the same reason
      // RFC-3986 §3.2.3: a non-digit port (0x1F, 1e3, ...) is kept raw, not
      // coerced by Number(), so checkURI can flag it as URI_INVALID_PORT
      port =
        is(String, portToCast) && portToCast.length > 0 && !isPort(portToCast)
          ? portToCast
          : int(portToCast) || portToCast;

      // recompose authority with punycode ASCII and Unicode serialization of the host
      // userinfo@host:port
      // we still want to know the original host and authority provided
      // to check possible uri errors: a null host with a hostPunydecoded filled
      // means uri parsed had an invalid host name
      if (exists(hostPunydecoded)) {
        authorityPunydecoded = '';

        // recompose authorityPunydecoded, order matters
        if (exists(userinfo)) {
          authorityPunydecoded += `${userinfo}@`;
        }

        authorityPunydecoded += hostToURI(hostPunydecoded);

        if (exists(port)) {
          authorityPunydecoded += `:${port}`;
        }
      }

      // as punycode returns '' for invalid host, we already know if the host is basically valid
      // and there cannot be userinfo or a port with a null host parsed
      if (exists(host)) {
        authority = '';

        // recompose authority, order matters
        if (exists(userinfo)) {
          authority += `${userinfo}@`;
        }

        authority += hostToURI(host);

        if (exists(port)) {
          authority += `:${port}`;
        }
      } else {
        userinfo = null;
        port = null;
      }
    }
  }

  // format query and fragment
  // RFC-3986 §5.3: a present-but-empty query/fragment ('' from a bare '?'
  // or '#') is distinct from an absent one (null) and must round-trip
  const query = is(String, queryParsed) ? queryParsed : null;
  const fragment = is(String, fragmentParsed) ? fragmentParsed : null;

  // pathqf: recompose path + query + fragment if any
  // using valueOf to avoid potential String objects mutation with parsed.path
  parsed.pathqf = is(String, path) ? path.valueOf() : null;

  if (is(String, parsed.pathqf)) {
    if (is(String, query)) {
      parsed.pathqf += `?${query}`;
    }

    if (is(String, fragment)) {
      parsed.pathqf += `#${fragment}`;
    }
  }

  // we checked scheme is a string
  parsed.scheme = scheme.toLowerCase();
  parsed.authority = authority;
  parsed.authorityPunydecoded = authorityPunydecoded;
  parsed.userinfo = userinfo;
  parsed.host = host;
  parsed.hostPunydecoded = hostPunydecoded;
  parsed.port = port;
  parsed.path = path ?? null;
  parsed.query = query;
  parsed.fragment = fragment;

  const recomposedURI = recomposeURI({
    scheme: parsed.scheme,
    userinfo: parsed.userinfo,
    host: parsed.host,
    port: parsed.port,
    path: parsed.path,
    query: parsed.query,
    fragment: parsed.fragment,
  });

  parsed.href = recomposedURI !== '' ? recomposedURI : null;

  return parsed;
};

export { hostToURI, parseURI, recomposeURI };
