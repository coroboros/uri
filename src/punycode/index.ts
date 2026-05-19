/**
 * punycode and punydecode
 *
 * - punycode(domain) -> String
 * - punydecode(domain) -> String
 */
import { domainToASCII, domainToUnicode } from 'node:url';
import { is } from '../helpers/object.js';
import { isIPv6 } from '../ip/index.js';

/**
 * @func punycode
 *
 * Returns the Punycode ASCII serialization of the domain.
 * If domain is an invalid domain, the empty string is returned.
 *
 * Note:
 * - native function url.domainToASCII does not support IPv6 only IPv4;
 * - native function url.domainToASCII throws if no domain is provided or returns
 *   `null`, `undefined`, `nan` for `null`, `undefined` or `NaN` values which is
 *   not what to be expected.
 */
const punycode = function punycode(domain: string): string {
  if (isIPv6(domain)) {
    return domain;
  }

  return is(String, domain) ? domainToASCII(domain) : '';
};

/**
 * @func punydecode
 *
 * Returns the Unicode serialization of the domain.
 * If domain is an invalid domain, the empty string is returned.
 *
 * Note:
 * - native function url.domainToUnicode does not support IPv6 only IPv4;
 * - native function url.domainToUnicode throws if no domain is provided or returns
 *   `null`, `undefined`, `nan` for `null`, `undefined` or `NaN` values which is
 *   not what to be expected.
 */
const punydecode = function punydecode(domain: string): string {
  if (isIPv6(domain)) {
    return domain;
  }

  return is(String, domain) ? domainToUnicode(domain) : '';
};

export { punycode, punydecode };
