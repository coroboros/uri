/**
 * error helper
 *
 * - fail(code, message) -> never (throws a coded URIError)
 */

type URIErrorWithCode = URIError & { code: string };

/**
 * @func fail
 *
 * Throw a URIError carrying a stable `code` string. The thrown value is
 * always `instanceof URIError`.
 */
const fail = function fail(code: string, message: string): never {
  const error = new URIError(message) as URIErrorWithCode;

  error.code = code;

  throw error;
};

export { fail, type URIErrorWithCode };
