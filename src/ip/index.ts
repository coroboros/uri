/**
 * IP validator
 *
 * - isIP(ip) -> Boolean
 * - isIPv4(ip) -> Boolean
 * - isIPv6(ip) -> Boolean
 */
import { is } from '../helpers/object.js';

// ip regexps, credits: https://github.com/sindresorhus/ip-regex/blob/master/index.js
const v4 =
  '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`
  .replace(/\s*\/\/.*$/gm, '')
  .replace(/\n/g, '')
  .trim();

/**
 * @func isIP
 *
 * Test a string is a valid IP.
 */
const isIP = function isIP(ip: string): boolean {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`(?:^${v4}$)|(?:^${v6}$)`).test(ip);
};

/**
 * @func isIPv4
 *
 * Test a string is a valid IPv4.
 */
const isIPv4 = function isIPv4(ip: string): boolean {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`^${v4}$`).test(ip);
};

/**
 * @func isIPv6
 *
 * Test a string is a valid IPv6.
 */
const isIPv6 = function isIPv6(ip: string): boolean {
  if (!is(String, ip)) {
    return false;
  }

  return new RegExp(`^${v6}$`).test(ip);
};

export { isIP, isIPv4, isIPv6 };
