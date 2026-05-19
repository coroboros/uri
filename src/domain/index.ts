/**
 * domain
 *
 * - isDomainLabel(label) -> Boolean
 * - isDomain(name) -> Boolean
 */
import { isDomainChar } from '../checkers/chars.js';
import { is } from '../helpers/object.js';
import { punycode } from '../punycode/index.js';

/**
 * @func isDomainLabel
 *
 * Test a label is a valid domain label according to RFC-1034.
 *
 * "Note that while upper and lower case letters are allowed in domain names,
 * no significance is attached to the case.  That is, two names with the same
 * spelling but different case are to be treated as if identical."
 *
 * By convention uppercased domain label will be considered invalid.
 *
 * Rules:
 * 1. "Labels must be 63 characters or less.";
 * 2. can be minimum one character;
 * 3. must only use lowercase letters, digits or hyphens;
 * 4. must not start or end with a hyphen;
 * 5. must not have consecutive hyphens;
 * 6. can start or end with a digit.
 *
 * Based on:
 * - RFC-1034 https://www.ietf.org/rfc/rfc1034.txt.
 */
const isDomainLabel = function isDomainLabel(label: string): boolean {
  // 1) and 2) rules
  if (!is(String, label)) {
    return false;
  }

  const len = label.length;

  if (len < 1 || len > 63) {
    return false;
  }

  // check each character
  for (let i = 0; i < len; i += 1) {
    if (!isDomainChar(label.charAt(i), { start: i === 0, end: i === len - 1 })) {
      return false;
    }

    // check consecutive hyphens
    if (label.charAt(i) === '-' && i + 1 < len && label.charAt(i + 1) === '-') {
      return false;
    }
  }

  return true;
};

/**
 * @func isDomain
 *
 * Test a name is a valid domain according to RFC-1034.
 *
 * Supports Fully-Qualified Domain Name (FQDN) and Internationalized Domain Name (IDN).
 *
 * Rules:
 * 1. labels rules apply;
 * 2. "[...] the total number of octets that represent a domain name
 *   (i.e., the sum of all label octets and label lengths) is limited to 255.";
 * 3. labels are separated by dots (".");
 * 4. must have at least one extension label;
 * 5. must have labels different from each other;
 * 6. last label can be empty (root label ".");
 * 7. labels can start with `xn--` for IDNs if the ASCII serialization is a valid Punycode;
 * 8. check also Punycodes as ॐ gives xn--'-6xd where ' is not valid.
 *
 * Based on:
 * - RFC-1034 https://www.ietf.org/rfc/rfc1034.txt.
 */
const isDomain = function isDomain(name: string): boolean {
  if (!is(String, name)) {
    return false;
  }

  // if a domain has an invalid label, its punycode value will be ''
  // eg. 'a.xn--hf.com'
  const domain = punycode(name);

  if (domain === 'localhost') {
    return true;
  }

  const len = domain.length;

  // "To simplify implementations, the total number of octets that represent a
  // domain name (i.e., the sum of all label octets and label lengths) is
  // limited to 255."
  if (len <= 0 || len > 255) {
    return false;
  }

  // "[...] the labels are separated by dots ("."). Since a complete
  // domain name ends with the root label, this leads to a printed form which
  // ends in a dot."
  // google.com./ is valid
  const labels = domain.split('.');
  const labelsLen = labels.length;

  // no label extension
  if (labelsLen <= 1) {
    return false;
  }

  // labels:
  // a) must be different from each other
  // b) last label can be empty (root label '.')
  // c) label can start with 'xn--' for IDNs if the Punycode is valid
  const occurences: Record<string, number> = {};

  for (const [i, current] of labels.entries()) {
    // ignore root label if ''
    if (!(i === labelsLen - 1 && current === '')) {
      const label = current.startsWith('xn--') ? current.slice(4) : current;

      // also check punycoded label as i.e. ॐ gives xn--'-6xd where ' is not valid
      if (!isDomainLabel(label)) {
        return false;
      }

      occurences[current] = (occurences[current] || 0) + 1;

      if (occurences[current] > 1) {
        return false;
      }
    }
  }

  return true;
};

export { isDomain, isDomainLabel };
