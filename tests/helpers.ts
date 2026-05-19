import { expect } from 'vitest';

/**
 * Faithful equivalent of chai's `.to.throw(URIError).with.property('code', code)`:
 * asserts the call throws, the thrown value is a `URIError`, and its `code`
 * property equals `code`.
 */
export const expectThrowWithCode = (fn: () => unknown, code: string): void => {
  let thrown: unknown;
  let didThrow = false;
  try {
    fn();
  } catch (err) {
    didThrow = true;
    thrown = err;
  }
  expect(didThrow).toBe(true);
  expect(thrown).toBeInstanceOf(URIError);
  expect((thrown as { code?: string }).code).toBe(code);
};
