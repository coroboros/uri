/**
 * error helper
 *
 * - fail(code, message, cause?) -> never (throws a coded URIError)
 */

type URIErrorWithCode = URIError & { code: string };

/**
 * @func fail
 *
 * Throw a URIError carrying a stable `code` string (and an optional
 * `Error.cause`). The thrown value is always `instanceof URIError`.
 */
const fail = function fail(code: string, message: string, cause?: unknown): never {
  const error = (
    cause === undefined ? new URIError(message) : new URIError(message, { cause })
  ) as URIErrorWithCode;

  error.code = code;

  throw error;
};

export { fail, type URIErrorWithCode };
