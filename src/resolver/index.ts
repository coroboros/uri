/**
 * reference resolution
 *
 * - removeDotSegments(path) -> String
 * - resolveURI(base, reference) -> String
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-5.
 */
import { is } from '../helpers/object.js';

// RFC-3986 Appendix B reference-parsing regexp. Unlike parseURI this keeps
// relative references (no scheme / no authority) so §5.2.2 can resolve them.
const referenceRegexp = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

interface Reference {
  scheme: string | null;
  authority: string | null;
  path: string;
  query: string | null;
  fragment: string | null;
}

/**
 * @func parseReference
 *
 * Split a URI-reference into its five RFC-3986 components. A component is
 * null when the delimiter is absent and '' when present but empty, so the
 * defined/undefined distinction §5.2.2 relies on is preserved.
 */
const parseReference = function parseReference(reference: string): Reference {
  const [, scheme, authority, path, query, fragment] = reference.match(referenceRegexp) ?? [];

  return {
    scheme: scheme ?? null,
    authority: authority ?? null,
    path: path ?? '',
    query: query ?? null,
    fragment: fragment ?? null,
  };
};

/**
 * @func removeDotSegments
 *
 * Remove the special "." and ".." complete path segments from a path,
 * implementing the RFC-3986 §5.2.4 ordered loop verbatim.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-5.2.4.
 */
const removeDotSegments = function removeDotSegments(path: string): string {
  if (!is(String, path)) {
    return '';
  }

  let input = path;
  let output = '';

  while (input.length > 0) {
    // 2A
    if (input.startsWith('../')) {
      input = input.slice(3);
    } else if (input.startsWith('./')) {
      input = input.slice(2);
      // 2B
    } else if (input.startsWith('/./')) {
      input = `/${input.slice(3)}`;
    } else if (input === '/.') {
      input = '/';
      // 2C
    } else if (input.startsWith('/../')) {
      input = `/${input.slice(4)}`;
      output = output.slice(0, Math.max(0, output.lastIndexOf('/')));
    } else if (input === '/..') {
      input = '/';
      output = output.slice(0, Math.max(0, output.lastIndexOf('/')));
      // 2D
    } else if (input === '.' || input === '..') {
      input = '';
      // 2E
    } else {
      const start = input.startsWith('/') ? 1 : 0;
      const next = input.indexOf('/', start);

      if (next === -1) {
        output += input;
        input = '';
      } else {
        output += input.slice(0, next);
        input = input.slice(next);
      }
    }
  }

  return output;
};

/**
 * @func merge
 *
 * Merge a relative reference's path with the base path, per RFC-3986 §5.2.3.
 */
const merge = function merge(base: Reference, refPath: string): string {
  if (is(String, base.authority) && base.path === '') {
    return `/${refPath}`;
  }

  const lastSlash = base.path.lastIndexOf('/');

  return lastSlash === -1 ? refPath : base.path.slice(0, lastSlash + 1) + refPath;
};

/**
 * @func recompose
 *
 * Recompose a resolved target from its components, per RFC-3986 §5.3.
 * A component is emitted whenever it is defined (non-null), including ''.
 */
const recompose = function recompose(target: Reference): string {
  let result = '';

  if (is(String, target.scheme)) {
    result += `${target.scheme}:`;
  }

  if (is(String, target.authority)) {
    result += `//${target.authority}`;
  }

  result += target.path;

  if (is(String, target.query)) {
    result += `?${target.query}`;
  }

  if (is(String, target.fragment)) {
    result += `#${target.fragment}`;
  }

  return result;
};

/**
 * @func resolveURI
 *
 * Resolve a URI reference against a base URI, implementing the RFC-3986
 * §5.2.2 strict transform (with §5.2.3 merge and §5.2.4 remove_dot_segments)
 * and recomposing per §5.3.
 *
 * The base must be an absolute URI (a scheme is required, RFC-3986 §5.2.1);
 * the empty string is returned if base or reference is invalid.
 *
 * Based on:
 * - RFC-3986 https://tools.ietf.org/html/rfc3986#section-5.2.
 */
const resolveURI = function resolveURI(base: string, reference: string): string {
  if (!(is(String, base) && is(String, reference))) {
    return '';
  }

  const baseRef = parseReference(base);

  // RFC-3986 §5.2.1: the base URI MUST be an absolute URI
  if (!is(String, baseRef.scheme)) {
    return '';
  }

  const r = parseReference(reference);
  const t: Reference = {
    scheme: null,
    authority: null,
    path: '',
    query: null,
    fragment: null,
  };

  // RFC-3986 §5.2.2 (strict mode)
  if (is(String, r.scheme)) {
    t.scheme = r.scheme;
    t.authority = r.authority;
    t.path = removeDotSegments(r.path);
    t.query = r.query;
  } else {
    if (is(String, r.authority)) {
      t.authority = r.authority;
      t.path = removeDotSegments(r.path);
      t.query = r.query;
    } else {
      if (r.path === '') {
        t.path = baseRef.path;
        t.query = is(String, r.query) ? r.query : baseRef.query;
      } else {
        t.path = r.path.startsWith('/')
          ? removeDotSegments(r.path)
          : removeDotSegments(merge(baseRef, r.path));
        t.query = r.query;
      }

      t.authority = baseRef.authority;
    }

    t.scheme = baseRef.scheme;
  }

  t.fragment = r.fragment;

  return recompose(t);
};

export { removeDotSegments, resolveURI };
