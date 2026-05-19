<div align="center">

<img src="assets/logo.png" width="288" height="288" alt="@coroboros/uri"/>

<!-- omit in toc -->
# @coroboros/uri

**RFC-3986 compliant, zero-dependency URI toolkit for Node.js.**

Parses any URI per RFC-3986, including IDNs via Punycode. Validates IPs, domains, URIs, HTTP(S) URLs, and Sitemap URLs. Encodes and decodes URI strings and components.

[![npm](https://img.shields.io/npm/v/@coroboros/uri?style=flat-square&color=000000)](https://www.npmjs.com/package/@coroboros/uri)
[![branch](https://img.shields.io/badge/branch-stable-000000?style=flat-square)](https://github.com/coroboros/uri)
[![license](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](https://opensource.org/licenses/MIT)
[![stars](https://img.shields.io/github/stars/coroboros/uri?style=flat-square&label=stars&color=000000)](https://github.com/coroboros/uri)
[![coroboros.com](https://img.shields.io/badge/coroboros.com-000000?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMiAxMmgyME0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjwvc3ZnPg==)](https://coroboros.com)

</div>

<!-- omit in toc -->
## Contents

- [Requirements](#requirements)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Errors](#errors)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js `>=22` LTS. Use [fnm](https://github.com/Schniz/fnm) for version management — Rust-based, faster than nvm.
- Any of the following package managers: `pnpm`, `npm`, `yarn`, `bun`.

## Install

```bash
pnpm add @coroboros/uri
```
```bash
npm install @coroboros/uri
```
```bash
yarn add @coroboros/uri
```
```bash
bun add @coroboros/uri
```

## Usage

```ts
// ESM (recommended)
import { parseURI, checkHttpsURL, encodeWebURL } from '@coroboros/uri';

parseURI('foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
checkHttpsURL('https://example.com/path?q=1#x');
encodeWebURL('https://www.中文.com./Over There?a=B#Anchôr');
```

```js
// CommonJS
const { parseURI } = require('@coroboros/uri');
```

## API

### punycode(domain)

Returns the Punycode ASCII serialization of the domain. If domain is an invalid domain, the empty string is returned.

**Note**:

- native function `url.domainToASCII` does not support IPv6 only IPv4;
- native function `url.domainToASCII` throws if no domain is provided or returns `null`, `undefined`, `nan` for `null`, `undefined` or `NaN` values which is not what to be expected.

<br/>

- `domain` **<String\>**
- Returns: **<String\>**

<br/>

**Examples**:

```javascript
punycode(); // ''
punycode('a.b.c.d.e.fg'); // 'a.b.c.d.e.fg'
punycode('xn--iñvalid.com'); // ''
punycode('中文.com'); // 'xn--fiq228c.com'
punycode('xn--fiq228c.com'); // 'xn--fiq228c.com'
punycode('2001:db8:85a3:8d3:1319:8a2e:370:7348'); // '2001:db8:85a3:8d3:1319:8a2e:370:7348'
punycode('127.0.0.1'); // '127.0.0.1'
punycode(undefined|null|NaN); // ''
```

### punydecode(domain)

Returns the Unicode serialization of the domain. If domain is an invalid domain, the empty string is returned.

**Note**:

- native function `url.domainToUnicode` does not support IPv6 only IPv4;
- native function `url.domainToUnicode` throws if no domain is provided or returns `null`, `undefined`, `nan` for `null`, `undefined` or `NaN` values which is not what to be expected.

<br/>

- `domain` **<String\>**
- Returns: **<String\>**

<br/>

**Examples**:

```javascript
punydecode(); // ''
punydecode('a.b.c.d.e.fg'); // 'a.b.c.d.e.fg'
punydecode('xn--iñvalid.com'); // ''
punydecode('xn--fiq228c.com'); // '中文.com'
punydecode('中文.com'); // '中文.com'
punydecode('2001:db8:85a3:8d3:1319:8a2e:370:7348'); // '2001:db8:85a3:8d3:1319:8a2e:370:7348'
punydecode('127.0.0.1'); // '127.0.0.1'
punydecode(undefined|null|NaN); // ''
```

### parseURI(uri)

Parse a string to get URI components.

**Support**:

- IPv4 and IPv6 hosts;
- Internationalized Domain Name (IDN).

**Note**:

- RegExp from __<a href="https://tools.ietf.org/html/rfc3986#appendix-B" target="_blank">RFC-3986</a>__;
- scheme and host strings will always be put in lowercase once parsed, as specified in **RFC-3986**;
- authority and its components will be put at null values if authority parsed is missing or empty;
- **prefer using [checkURI](#checkuriuri) to parse and fully check an URI**.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Example URIs**:

![RFC-3986](assets/rfc-3986.png "RFC-3986")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- Returns: **<Object\>**
  - `scheme` **<String\>** The URI scheme. *Default*: `null`
  - `authority` **<String\>** The URI authority with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `authorityPunydecoded` **<String\>** The URI authority with the Unicode serialization of the domain. *Default*: `null`
  - `userinfo` **<String\>** The URI userinfo. *Default*: `null`
  - `host` **<String\>** The URI authority's host with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `hostPunydecoded` **<String\>** The URI authority's host with the Unicode serialization of the domain. *Default*: `null`
  - `port` **<Number\>** || **<String\>** The URI authority's port. A string if not able to be parsed in an integer. *Default*: `null`
  - `path` **<String\>** The URI path. *Default*: `null`
  - `pathqf` **<String\>** The URI path, query and fragment. *Default*: `null`
  - `query` **<String\>** The URI query. *Default*: `null`
  - `fragment` **<String\>** The URI fragment. *Default*: `null`
  - `href` **<String\>** The URI recomposed. See __[recomposeURI](#recomposeuricomponents)__. *Default*: `null`

<br/>

**Examples**:

```javascript
parseURI();
// {
//   scheme: null,
//   authority: null,
//   authorityPunydecoded: null,
//   userinfo: null,
//   host: null,
//   hostPunydecoded: null,
//   port: null,
//   path: null,
//   pathqf: null,
//   query: null,
//   fragment: null,
//   href: null,
// }

parseURI('foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// {
//   scheme: 'foo',
//   authority: 'user:pass@xn--fiq228c.com:8042',
//   authorityPunydecoded: 'user:pass@中文.com:8042',
//   userinfo: 'user:pass',
//   host: 'xn--fiq228c.com',
//   hostPunydecoded: '中文.com',
//   port: 8042,
//   path: '/over/there',
//   pathqf: '/over/there?name=ferret#nose',
//   query: 'name=ferret',
//   fragment: 'nose',
//   href: 'foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose',
// }

parseURI('foo://user:pass@中文.com:80g42/over/there?name=ferret#nose');
// {
//   scheme: 'foo',
//   authority: 'user:pass@xn--fiq228c.com:80g42',
//   authorityPunydecoded: 'user:pass@中文.com:80g42',
//   userinfo: 'user:pass',
//   host: 'xn--fiq228c.com',
//   hostPunydecoded: '中文.com',
//   port: '80g42',
//   path: '/over/there',
//   pathqf: '/over/there?name=ferret#nose',
//   query: 'name=ferret',
//   fragment: 'nose',
//   href: 'foo://user:pass@xn--fiq228c.com:80g42/over/there?name=ferret#nose',
// }

parseURI('urn:isbn:0-486-27557-4');
// {
//   scheme: 'urn',
//   authority: null,
//   authorityPunydecoded: null,
//   userinfo: null,
//   host: null,
//   hostPunydecoded: null,
//   port: null,
//   path: 'isbn:0-486-27557-4',
//   pathqf: 'isbn:0-486-27557-4',
//   query: null,
//   fragment: null
//   href: 'urn:isbn:0-486-27557-4',
// }

parseURI('http://user:pass@[fe80::7:8%eth0]:8080');
// {
//   scheme: 'http',
//   authority: 'user:pass@[fe80::7:8%eth0]:8080',
//   authorityPunydecoded: 'user:pass@[fe80::7:8%eth0]:8080',
//   userinfo: 'user:pass',
//   host: 'fe80::7:8%eth0',
//   hostPunydecoded: 'fe80::7:8%eth0',
//   port: 8080,
//   path: '',
//   pathqf: '',
//   query: null,
//   fragment: null,
//   href: 'http://user:pass@[fe80::7:8%eth0]:8080/'
// }
```

### recomposeURI(components)

Recompose an URI from its components with basic URI checking.

The empty string is returned if unable to recompose the URI.

**Rules**:

1. scheme is required and must be at least 1 character;
2. path is required and can be empty;
3. if host is present path must be empty or start with `/`;
4. if host is not present path must not start with `//`;
5. host, if any, must be at least 3 characters;
6. userinfo will be ignored if empty;
7. port will be ignored if unable to parse it into an integer between 0 - 65535;
8. query will be ignored if empty;
9. fragment will be ignored if empty.

**Support**:

- IPv4 and IPv6.

**Note**:

- `/` is added to any URI with a host and an empty path.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `components` **<Object\>**:
  - `scheme`* **<String\>** The URI scheme.
  - `userinfo` **<String\>** The URI userinfo.
  - `host` **<String\>** The URI authority's host.
  - `port` **<Number\>** The URI authority's port.
  - `path`* **<String\>** The URI path.
  - `query` **<String\>** The URI query.
  - `fragment` **<String\>** The URI fragment.
- Returns: **<String\>**

<br/>

**Examples**:

```javascript
recomposeURI(); // ''

recomposeURI({
  scheme: null,
  userinfo: 'user:pass',
  host: 'example.com',
  port: 8080,
  path: null,
  query: 'a=b',
  fragment: 'anchor',
}); // ''

recomposeURI({
  scheme: 'foo',
  userinfo: null,
  host: null,
  port: null,
  path: '',
  query: null,
  fragment: null,
}); // 'foo:'

recomposeURI({
  scheme: 'foo',
  userinfo: 'user:pass',
  host: 'bar.com',
  port: 8080,
  path: '/over/there',
  query: 'a=b',
  fragment: 'anchor',
}); // 'foo://user:pass@bar.com:8080/over/there?a=b#anchor'

recomposeURI({
  scheme: 'foo',
  userinfo: 'user:pass',
  host: 'fe80::7:8%eth0',
  port: '8080',
  path: '/over/there',
  query: 'a=b',
  fragment: 'anchor',
}); // 'foo://user:pass@[fe80::7:8%eth0]:8080/over/there?a=b#anchor'

recomposeURI({
  scheme: 'foo',
  userinfo: '',
  host: 'fe80::7:8%eth0',
  port: '55g55',
  path: '/over/there',
  query: '',
  fragment: '',
}); // 'foo://[fe80::7:8%eth0]/over/there'
```

### isDomainLabel(label)

Test a label is a valid domain label according to **RFC-1034**.

> "Note that while upper and lower case letters are allowed in domain names, no significance is attached to the case.  That is, two names with the same spelling but different case are to be treated as if identical."

By convention uppercased domain label will be considered invalid.

**Rules**:

1. "*Labels must be 63 characters or less.*";
2. can be minimum one character;
3. must only use lowercase letters, digits or hyphens;
4. must not start or end with a hyphen;
5. must not have consecutive hyphens;
6. can start or end with a digit.

<br/>

**Based on**:

- __<a href="https://www.ietf.org/rfc/rfc1034.txt" target="_blank">RFC-1034</a>__.

<br/>

- `label` **<String\>**
- Returns: **<Boolean\>**

<br/>

**Examples**:

```javascript
isDomainLabel('a'); // true
isDomainLabel('1a3'); // true
isDomainLabel('1-3'); // true
isDomainLabel('1-y'); // true

isDomainLabel(); // false
isDomainLabel('a'.repeat(64)); // false
isDomainLabel('A'); // false
isDomainLabel('-a'); // false
isDomainLabel('a-'); // false
isDomainLabel('-a'); // false
isDomainLabel('la--bel'); // false
isDomainLabel(undefined|null|NaN); // false
```

### isDomain(name)

Test a name is a valid domain according to **RFC-1034**.

Supports Fully-Qualified Domain Name (FQDN) and Internationalized Domain Name (IDN).

**Rules**:

1. __[labels rules apply](#isdomainlabellabel)__;
2. "*[...] the total number of octets that represent a domain name (i.e., the sum of all label octets and label lengths) is limited to 255.*";
3. labels are separated by dots (".");
4. must have at least one extension label;
5. must have labels different from each other;
6. last label can be empty (root label ".");
7. labels can start with `xn--` for IDNs if the ASCII serialization is a valid Punycode **and has valid characters**.

<br/>

**Based on**:

- __<a href="https://www.ietf.org/rfc/rfc1034.txt" target="_blank">RFC-1034</a>__.

<br/>

- `name` **<String\>**
- Returns: **<Boolean\>**

<br/>

**Examples**:

```javascript
isDomain('a.b'); // true
isDomain('a.b.'); // true
isDomain('中文.com'); // true
isDomain('xn--fiq228c.com'); // true
isDomain('www.中文.com'); // true
isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}`); // true

isDomain(); // false
isDomain('a'); // false
isDomain('a.a'); // false
isDomain('a.b.a'); // false
isDomain('a.b.a'); // false
isDomain('中文.xn--fiq228c.com'); // false
isDomain('www.xn--hf.com'); // false
isDomain(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.`); // false
isDomain('xn--\'-6xd.com') // false even though xn--'-6xd is a valid Punycode for ॐ but has an invalid character
```

### isIP(ip)

Test a string is a valid IP.

Supports IPv4 and IPv6.

<br/>

- `ip` **<String\>**
- Returns: **<Boolean\>**

<br/>

**Examples**:

```javascript
isIP('23.71.254.72'); // true
isIP('1:2:3:4::6:7:8'); // true

isIP(); // false
isIP('100..100.100.100.'); // false
isIP('3ffe:b00::1::a'); // false
```

### isIPv4(ip)

Test a string is a valid IPv4.

<br/>

- `ip` **<String\>**
- Returns: **<Boolean\>**

<br/>

**Examples**:

```javascript
isIPv4('8.8.8.8'); // true
isIPv4('1:2::8'); // false
isIPv4(); // false
```

### isIPv6(ip)

Test a string is a valid IPv6.

<br/>

- `ip` **<String\>**
- Returns: **<Boolean\>**

<br/>

**Examples**:

```javascript
isIPv6('2001:0000:1234:0000:0000:C1C0:ABCD:0876'); // true
isIPv6('212.58.241.131'); // false
isIPv6(); // false
```

### checkURI(uri)

Check an URI is valid according to **RFC-3986**.

**Rules**:

1. scheme is required and cannot be empty;
2. path is required and can be empty;
3. if authority is present path must be empty or start with `/`;
4. if authority is not present path must not start with `//`;
5. __<a href="https://tools.ietf.org/html/rfc3986#section-3.1" target="_blank">scheme can only have specific characters</a>__;
6. if authority is present:

- host must be a valid IP or domain name;
- __<a href="https://tools.ietf.org/html/rfc3986#section-3.2.1" target="_blank">userinfo, if any, can only have specific characters</a>__;
- port, if any, must be an integer between 0 - 65535.

7. __<a href="https://tools.ietf.org/html/rfc3986#section-3.3" target="_blank">path, query and fragment can only have specific characters</a>__.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- Returns: **<Object\>**
  - `scheme` **<String\>** The URI scheme.
  - `authority` **<String\>** The URI authority with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `authorityPunydecoded` **<String\>** The URI authority with the Unicode serialization of the domain. *Default*: `null`
  - `userinfo` **<String\>** The URI userinfo. *Default*: `null`
  - `host` **<String\>** The URI authority's host with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `hostPunydecoded` **<String\>** The URI authority's host with the Unicode serialization of the domain. *Default*: `null`
  - `port` **<Number\>** || **<String\>** The URI authority's port. A string if not able to be parsed in an integer. *Default*: `null`
  - `path` **<String\>** The URI path.
  - `pathqf` **<String\>** The URI path, query and fragment.
  - `query` **<String\>** The URI query. *Default*: `null`
  - `fragment` **<String\>** The URI fragment. *Default*: `null`
  - `href` **<String\>** The URI recomposed. *Default*: `null`
  - `valid` **<Boolean\>** Whether the URI is valid. *Default*: `false`
- Throws: **<URIError\>** If no error is thrown then the URI is valid. Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME_CHAR`
  - `URI_INVALID_USERINFO_CHAR`
  - `URI_INVALID_PORT`
  - `URI_INVALID_PATH_CHAR`
  - `URI_INVALID_QUERY_CHAR`
  - `URI_INVALID_FRAGMENT_CHAR`
  - `URI_INVALID_PERCENT_ENCODING`

<br/>

**Examples**:

```javascript
checkURI(); // throws URIError with code URI_INVALID_TYPE
checkURI('://example.com'); // throws URIError with code URI_MISSING_SCHEME
checkURI('foo:////bar'); // throws URIError with code URI_INVALID_PATH
checkURI('foo://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
checkURI('fôo:bar'); // throws URIError with code URI_INVALID_SCHEME_CHAR
checkURI('foo://üser:pass@bar.com'); // throws URIError with code URI_INVALID_USERINFO_CHAR
checkURI('foo://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
checkURI('foo://bar.com/°'); // throws URIError with code URI_INVALID_PATH_CHAR
checkURI('foo://bar.com/over/there?quêry=5'); // throws URIError with code URI_INVALID_QUERY_CHAR
checkURI('foo://bar.com/over/there?query=5#anch#r'); // throws URIError with code URI_INVALID_FRAGMENT_CHAR
checkURI('http://www.bar.baz/foo%2') // throws URIError with code URI_INVALID_PERCENT_ENCODING

checkURI('foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// {
//   scheme: 'foo',
//   authority: 'user:pass@xn--fiq228c.com:8042',
//   authorityPunydecoded: 'user:pass@中文.com:8042',
//   userinfo: 'user:pass',
//   host: 'xn--fiq228c.com',
//   hostPunydecoded: '中文.com',
//   port: 8042,
//   path: '/over/there',
//   pathqf: '/over/there?name=ferret#nose',
//   query: 'name=ferret',
//   fragment: 'nose',
//   href: 'foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose',
//   valid: true
// }
```

### checkHttpURL(uri)

Check an URI is a valid HTTP URL.

**Rules**:

1. __[must be a valid URI](#checkuriuri)__;
1. scheme must be `http` or `HTTP`;
2. authority is required;
3. URL must be less than 2048 characters.

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- Returns: **<Object\>**
  - `scheme` **<String\>** The URL scheme.
  - `authority` **<String\>** The URL authority with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `authorityPunydecoded` **<String\>** The URL authority with the Unicode serialization of the domain. *Default*: `null`
  - `userinfo` **<String\>** The URL userinfo. *Default*: `null`
  - `host` **<String\>** The URL authority's host with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `hostPunydecoded` **<String\>** The URL authority's host with the Unicode serialization of the domain. *Default*: `null`
  - `port` **<Number\>** || **<String\>** The URL authority's port. A string if not able to be parsed in an integer. *Default*: `null`
  - `path` **<String\>** The URL path.
  - `pathqf` **<String\>** The URI path, query and fragment.
  - `query` **<String\>** The URL query. *Default*: `null`
  - `fragment` **<String\>** The URL fragment. *Default*: `null`
  - `href` **<String\>** The URL recomposed. *Default*: `null`
  - `valid` **<Boolean\>** Whether the URL is valid. *Default*: `false`
- Throws: **<URIError\>** If no error is thrown then the URL is valid. Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_USERINFO_CHAR`
  - `URI_INVALID_PORT`
  - `URI_INVALID_PATH_CHAR`
  - `URI_INVALID_QUERY_CHAR`
  - `URI_INVALID_FRAGMENT_CHAR`
  - `URI_INVALID_PERCENT_ENCODING`
  - `URI_INVALID_SCHEME`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
checkHttpURL(); // throws URIError with code URI_INVALID_TYPE
checkHttpURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
checkHttpURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
checkHttpURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
checkHttpURL('http://üser:pass@bar.com'); // throws URIError with code URI_INVALID_USERINFO_CHAR
checkHttpURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
checkHttpURL('http://bar.com/°'); // throws URIError with code URI_INVALID_PATH_CHAR
checkHttpURL('http://bar.com/over/there?quêry=5'); // throws URIError with code URI_INVALID_QUERY_CHAR
checkHttpURL('http://bar.com/over/there?query=5#anch#r'); // throws URIError with code URI_INVALID_FRAGMENT_CHAR
checkHttpURL('http://www.bar.baz/foo%2') // throws URIError with code URI_INVALID_PERCENT_ENCODING
checkHttpURL('httê://bar.com:8080'); // throws URIError with code URI_INVALID_SCHEME
checkHttpURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
checkHttpURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

checkHttpURL('http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// {
//   scheme: 'http',
//   authority: 'user:pass@xn--fiq228c.com:8042',
//   authorityPunydecoded: 'user:pass@中文.com:8042',
//   userinfo: 'user:pass',
//   host: 'xn--fiq228c.com',
//   hostPunydecoded: '中文.com',
//   port: 8042,
//   path: '/over/there',
//   pathqf: '/over/there?name=ferret#nose',
//   query: 'name=ferret',
//   fragment: 'nose',
//   href: 'http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose',
//   valid: true
// }
```

### checkHttpsURL(uri)

Check an URI is a valid HTTPS URL. Same behavior than __[checkHttpURL](#checkhttpurluri)__ except scheme must be `https` or `HTTPS`.

### checkHttpSitemapURL(uri)

Check an URI is a valid HTTP URL to be used in an XML sitemap file.

For text sitemap please refer to __[checkHttpURL](#checkhttpurluri)__ as there is no need to escape entities **but URL must be in lowercase**.

**Rules**:

1. __[must be a valid URL](#checkhttpurluri)__;
1. scheme must be `http`;
2. authority is required;
3. specific characters must be escaped;
4. can only contain lowercase characters (prechecked);
5. URL must be less than 2048 characters.

**Valid URI characters to be escaped or percent-encoded in a sitemap URL**:

| Character    | Value | Escape Code |
| :----------- |:-----:| :---------: |
| Ampersand    | `&`   | `&amp;`     |
| Single Quote | `'`   | `&apos;`    |
| Asterisk     | `*`   | `%2A`       |

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__;
- __<a href="https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190" target="_blank">Google: Build and submit a sitemap</a>__.

<br/>

- `uri` **<String\>**
- Returns: **<Object\>**
  - `scheme` **<String\>** The URL scheme.
  - `authority` **<String\>** The URL authority with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `authorityPunydecoded` **<String\>** The URL authority with the Unicode serialization of the domain. *Default*: `null`
  - `userinfo` **<String\>** The URL userinfo. *Default*: `null`
  - `host` **<String\>** The URL authority's host with the Punycode ASCII serialization of the domain. *Default*: `null`
  - `hostPunydecoded` **<String\>** The URL authority's host with the Unicode serialization of the domain. *Default*: `null`
  - `port` **<Number\>** || **<String\>** The URL authority's port. A string if not able to be parsed in an integer. *Default*: `null`
  - `path` **<String\>** The URL path.
  - `pathqf` **<String\>** The URI path, query and fragment.
  - `query` **<String\>** The URL query. *Default*: `null`
  - `fragment` **<String\>** The URL fragment. *Default*: `null`
  - `href` **<String\>** The URL recomposed. *Default*: `null`
  - `valid` **<Boolean\>** Whether the URL is valid. *Default*: `false`
- Throws: **<URIError\>** If no error is thrown then the URL is valid. Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_USERINFO_CHAR`
  - `URI_INVALID_PORT`
  - `URI_INVALID_CHAR`
  - `URI_INVALID_PATH_CHAR`
  - `URI_INVALID_QUERY_CHAR`
  - `URI_INVALID_FRAGMENT_CHAR`
  - `URI_INVALID_PERCENT_ENCODING`
  - `URI_INVALID_SITEMAP_ENCODING`
  - `URI_INVALID_SCHEME`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
checkHttpSitemapURL(); // throws URIError with code URI_INVALID_TYPE
checkHttpSitemapURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
checkHttpSitemapURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
checkHttpSitemapURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
checkHttpSitemapURL('http://*ser:pass@bar.com'); // throws URIError with code URI_INVALID_USERINFO_CHAR
checkHttpSitemapURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
checkHttpSitemapURL('hTtp://bar.com/Path'); // throws URIError with code URI_INVALID_CHAR
checkHttpSitemapURL('http://bAr.com/Path'); // throws URIError with code URI_INVALID_CHAR
checkHttpSitemapURL('http://bar.com/Path'); // throws URIError with code URI_INVALID_CHAR
checkHttpSitemapURL('http://bar.com/path\''); // throws URIError with code URI_INVALID_PATH_CHAR
checkHttpSitemapURL('http://bar.com/over/there?a=5&b=9'); // throws URIError with code URI_INVALID_QUERY_CHAR
checkHttpSitemapURL('http://bar.com/over/there?a=5#anch*r'); // throws URIError with code URI_INVALID_FRAGMENT_CHAR
checkHttpSitemapURL('http://www.bar.baz/foo%2') // throws URIError with code URI_INVALID_PERCENT_ENCODING
checkHttpSitemapURL('http://www.bar.baz/foo?a=5&am;b=9') // throws URIError with code URI_INVALID_SITEMAP_ENCODING
checkHttpSitemapURL('hêtp://bar.com:8080'); // throws URIError with code URI_INVALID_SCHEME
checkHttpSitemapURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
checkHttpSitemapURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

checkHttpSitemapURL('http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret&amp;catch=rabbits#nose');
// {
//   scheme: 'http',
//   authority: 'user:pass@xn--fiq228c.com:8042',
//   authorityPunydecoded: 'user:pass@中文.com:8042',
//   userinfo: 'user:pass',
//   host: 'xn--fiq228c.com',
//   hostPunydecoded: '中文.com',
//   port: 8042,
//   path: '/over/there',
//   pathqf: '/over/there?name=ferret&amp;catch=rabbits#nose',
//   query: 'name=ferret&amp;catch=rabbits',
//   fragment: 'nose',
//   href: 'http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret&amp;catch=rabbits#nose',
//   valid: true
// }
```

### checkHttpsSitemapURL(uri)

Check an URI is a valid HTTPS URL to be used in an XML sitemap file. Same behavior than __[checkHttpSitemapURL](#checkhttpsitemapurluri)__ except scheme must be `https`.

### checkWebURL(uri)

Check an URI is a valid HTTP or HTTPS URL. Same behavior than __[checkHttpURL](#checkhttpurluri)__ except scheme can be `http`/`HTTP` or `https`/`HTTPS`.

### checkSitemapURL(uri)

Check an URI is a valid HTTP or HTTPS URL to be used in an XML sitemap file. Same behavior than __[checkHttpSitemapURL](#checkhttpsitemapurluri)__ except scheme can be `http` or `https`.

### encodeURIComponentString(component, options)

Encode an URI component according to **RFC-3986**.

**Support**:

- Sitemap's special characters, see __[checkHttpSitemapURL](#checkhttpsitemapurluri)__;
- lower and upper case.

**Note**:

- only `userinfo`, `path`, `query` and `fragment` components can be encoded with specific rules for each type regarding valid characters (**RFC-3986**);
- `scheme` and `authority` (host and port) can never have escaped or percent-encoded characters;
- the empty string is returned if unable to encode;
- __[sitemap characters](#checkhttpsitemapurluri)__ must be in lowercase and escaped for XML sitemap URLs.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__;
- __<a href="https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190" target="_blank">Google: Build and submit a sitemap</a>__.

<br/>

- `component` **<String\>**
- `options` **<Object\>**:
  - `type` **<String\>** The component type. If no type is provided native function *encodeURIComponent* will be used to encode each character. *Default*: `none` One of:
    - `userinfo`
    - `path`
    - `query`
    - `fragment`
  - `lowercase` **<Boolean\>** Whether the component should be returned in lowercase. *Default*: `false`
  - `sitemap` **<Boolean\>** Whether to escape Sitemap's special characters. See __[checkHttpSitemapURL](#checkhttpsitemapurluri)__.
- Returns: **<String\>**

<br/>

**Examples**:

```javascript
encodeURIComponentString(); // ''
encodeURIComponentString(''); // ''
encodeURIComponentString('cômpön€nt'); // 'c%C3%B4mp%C3%B6n%E2%82%ACnt'
encodeURIComponentString('AbC'); // 'AbC'
encodeURIComponentString('AbC', { lowercase: true }); // 'abc'
encodeURIComponentString('*'); // '*'
encodeURIComponentString('*', { sitemap: true }); // '%2A'

// it is highly recommended to use a component type
encodeURIComponentString('A#/?@[]&\'*'); // 'A%23%2F%3F%40%5B%5D%26\'*' (native function, outdated standard)
encodeURIComponentString('A#/?@[]&\'*', { type: 'userinfo' }); // 'A%23%2F%3F%40%5B%5D&\'*' (RFC-3986 characters in userinfo)
encodeURIComponentString('A#/?@[]&\'*', { type: 'path' }); // 'A%23/%3F@%5B%5D&\'*'
encodeURIComponentString('A#/?@[]&\'*', { type: 'query' }); // 'A%23/?@%5B%5D&\'*'
encodeURIComponentString('A#/?@[]&\'*', { type: 'fragment' }); // 'A%23/?@%5B%5D&\'*'
encodeURIComponentString('A#/?@[]&\'*', { type: 'fragment', sitemap: true }); // 'a%23/?@%5B%5D&amp;&apos;%2A'
```

### encodeURIString(uri, options)

Encode an URI string according to **RFC-3986** with basic checking.

**Checked**:

- scheme is required;
- path is required, can be empty;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name.

**Support**:

- IDNs: returns URI with its Punycode host, if any;
- lower and upper case.

**Note**:

- only `userinfo`, `path`, `query` and `fragment` can be percent-encoded;
- native function `encodeURI` encodes string according to **RFC-2396** which is outdated;
- native function `encodeURI` also encodes scheme and host that cannot have
  percend-encoded characters;
- characters that should not be percent-encoded in **RFC-3986** are `[]` to represent IPv6 host;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the uri should be returned in lowercase. *Default*: `false`
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME_CHAR`
  - `URI_INVALID_PORT`

<br/>

**Examples**:

```javascript
encodeURIString(); // throws URIError with code URI_INVALID_TYPE
encodeURIString('://example.com'); // throws URIError with code URI_MISSING_SCHEME
encodeURIString('http:////bar'); // throws URIError with code URI_INVALID_PATH
encodeURIString('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
encodeURIString('hôtp:bar'); // throws URIError with code URI_INVALID_SCHEME_CHAR
encodeURIString('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT

encodeURIString('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor'); // 'https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor'
encodeURIString('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor', { lowercase: true }); // 'https://www.xn--fiq228c.com./over/there?a=b&b=c#anchor'
encodeURIString('foo://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr'); // 'foo://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'
```

### encodeWebURL(uri, options)

Encode an URI string with basic checking based on **RFC-3986** standard applied to HTTP and HTTPS URLs.

Uses __[a fixed encodeURI function](#encodeuristringuri-options)__ to be **RFC-3986** compliant.

**Checked**:

- scheme must be `http`/`HTTP` or `https`/`HTTPS`;
- path is required, can be empty;
- authority is required;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name;
- URL must be less than 2048 characters.

**Support**:

- IDNs: returns URL with its Punycode host, if any;
- lower and upper case.

**Note**:

- only `userinfo`, `path`, `query` and `fragment` can be percent-encoded;
- native function `encodeURI` encodes string according to **RFC-2396** which is outdated;
- native function `encodeURI` also encodes scheme and host that cannot have
  percend-encoded characters;
- characters that should not be percent-encoded in **RFC-3986** are `[]` to represent IPv6 host;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the uri should be returned in lowercase. *Default*: `false`
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME`
  - `URI_INVALID_PORT`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
encodeWebURL(); // throws URIError with code URI_INVALID_TYPE
encodeWebURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
encodeWebURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
encodeWebURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
encodeWebURL('ftp://bar.baz'); // throws URIError with code URI_INVALID_SCHEME
encodeWebURL('hôtp://bar.baz'); // throws URIError with code URI_INVALID_SCHEME
encodeWebURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
encodeWebURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
encodeWebURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

encodeWebURL('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor'); // 'https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor'
encodeWebURL('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor', { lowercase: true }); // 'https://www.xn--fiq228c.com./over/there?a=b&b=c#anchor'
encodeWebURL('http://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr'); // 'http://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'
```

### encodeSitemapURL(uri)

Encode an URI string with basic checking based on **RFC-3986** standard applied to HTTP and HTTPS URLs and sitemap requirements regarding special characters to escape.

Uses __[a fixed encodeURI function](#encodeuristringuri-options)__ to be **RFC-3986** compliant.

**Checked**:

- scheme must be `http`/`HTTP` or `https`/`HTTPS`;
- path is required, can be empty;
- authority is required;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name;
- URL must be less than 2048 characters.

**Support**:

- Sitemap's special characters, see __[checkHttpSitemapURL](#checkhttpsitemapurluri)__;
- IDNs: returns URI with its Punycode host, if any;
- **characters are automatically put in lowercase**.

**Note**:

- only `userinfo`, `path`, `query` and `fragment` can be percent-encoded;
- native function `encodeURI` encodes string according to **RFC-2396** which is outdated;
- native function `encodeURI` also encodes scheme and host that cannot have
  percend-encoded characters;
- characters that should not be percent-encoded in **RFC-3986** are `[]` to represent IPv6 host;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase.

<br/>

**Generic syntax**:

![URI Syntax](assets/uri-syntax.png "URI Syntax")

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__;
- __<a href="https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190" target="_blank">Google: Build and submit a sitemap</a>__.

<br/>

- `uri` **<String\>**
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME`
  - `URI_INVALID_PORT`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
encodeSitemapURL(); // throws URIError with code URI_INVALID_TYPE
encodeSitemapURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
encodeSitemapURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
encodeSitemapURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
encodeSitemapURL('ftp://bar.baz'); // throws URIError with code URI_INVALID_SCHEME
encodeSitemapURL('hôtp://bar.baz'); // throws URIError with code URI_INVALID_SCHEME
encodeSitemapURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
encodeSitemapURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
encodeSitemapURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

encodeSitemapURL('http://user:p\'âss@bar.baz/it\'s *ver/there?a=b&b=c#anch*r'); // 'http://user:p&apos;%C3%A2ss@bar.baz/it&apos;s%20%2Aver/there?a=b&amp;b=c#anch%2Ar'
```

### decodeURIComponentString(component, options)

Decode an URI component string.

Native function `decodeURIComponent` could throw and to be consistent with [encodeURIComponentString](#encodeuricomponentstringcomponent-options) the empty string is returned if unable to decode.

**Support**:

- Sitemap's escape codes, see __[checkHttpSitemapURL](#checkhttpsitemapurluri)__;
- lower and upper case.

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__;
- __<a href="https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190" target="_blank">Google: Build and submit a sitemap</a>__.

<br/>

- `component` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the component should be returned in lowercase. *Default*: `false`
  - `sitemap` **<Boolean\>** Whether to decode Sitemap's escape codes. See __[checkHttpSitemapURL](#checkhttpsitemapurluri)__.
- Returns: **<String\>**

<br/>

**Examples**:

```javascript
decodeURIComponentString(); // ''
decodeURIComponentString(''); // ''
decodeURIComponentString('AbC'); // 'AbC'
decodeURIComponentString('AbC', { lowercase: true }); // 'abc'
decodeURIComponentString('%2A'); // '*'
decodeURIComponentString('&apos;&amp;%2A', { sitemap: true }); // '\'&*'
decodeURIComponentString('SITE&amp;maP', { sitemap: true, lowercase: true }); // 'site&map'
```

### decodeURIString(uri, options)

Decode an URI string according to **RFC-3986** with basic checking.

**Checked**:

- scheme is required;
- path is required, can be empty;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name.

**Support**:

- IDNs: returns URI with its Punydecoded host (Unicode serialization of the domain), if any;
- lower and upper case.

**Note**:

- if one of `userinfo`, `path`, `query` or `fragment` component cannot be decoded, it will be ignored;
- native function `decodeURI` does not support IDNs and cannot properly work with `encodeURI` since the function is based on an outdated standard;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase;
- to only use with [encodeURIString](#encodeuristringuri-options).

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the uri should be returned in lowercase. *Default*: `false`
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME_CHAR`
  - `URI_INVALID_PORT`

<br/>

**Examples**:

```javascript
decodeURIString(); // throws URIError with code URI_INVALID_TYPE
decodeURIString('://example.com'); // throws URIError with code URI_MISSING_SCHEME
decodeURIString('http:////bar'); // throws URIError with code URI_INVALID_PATH
decodeURIString('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
decodeURIString('hôtp:bar'); // throws URIError with code URI_INVALID_SCHEME_CHAR
decodeURIString('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT

decodeURIString('http://user%:pass@xn--fiq228c.com/%?query=%E0%A5%90#anch#or'); // 'http://中文.com/?query=ॐ'
decodeURIString('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor'); // 'https://www.中文.com./Over/There?a=B&b=c#Anchor'
decodeURIString('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor', { lowercase: true }); // 'https://www.中文.com./over/there?a=b&b=c#anchor'
decodeURIString('foo://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'); // 'foo://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr'
```

### decodeWebURL(uri, options)

Decode an URI string with basic checking based on **RFC-3986** standard applied to HTTP and HTTPS URLs.

Uses __[a fixed decodeURI function](#decodeuristringuri-options)__ to be **RFC-3986** compliant.

**Checked**:

- scheme must be `http`/`HTTP` or `https`/`HTTPS`;
- path is required, can be empty;
- authority is required;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name;
- URL must be less than 2048 characters.

**Support**:

- IDNs: returns URI with its Punydecoded host (Unicode serialization of the domain), if any;
- lower and upper case.

**Note**:

- if one of `userinfo`, `path`, `query` or `fragment` component cannot be decoded, it will be ignored;
- native function `decodeURI` does not support IDNs and cannot properly work with `encodeURI` since the function is based on an outdated standard;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase;
- to only use with [encodeWebURL](#encodeweburluri-options).

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__.

<br/>

- `uri` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the uri should be returned in lowercase. *Default*: `false`
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME`
  - `URI_INVALID_PORT`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
decodeWebURL(); // throws URIError with code URI_INVALID_TYPE
decodeWebURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
decodeWebURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
decodeWebURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
decodeWebURL('ftp://bar.com'); // throws URIError with code URI_INVALID_SCHEME
decodeWebURL('hôtp://bar.com'); // throws URIError with code URI_INVALID_SCHEME
decodeWebURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
decodeWebURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
decodeWebURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

decodeWebURL('http://user%:pass@xn--fiq228c.com/%?query=%E0%A5%90#anch#or'); // 'http://中文.com/?query=ॐ'
decodeWebURL('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor'); // 'https://www.中文.com./Over/There?a=B&b=c#Anchor'
decodeWebURL('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor', { lowercase: true }); // 'https://www.中文.com./over/there?a=b&b=c#anchor'
decodeWebURL('http://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'); // 'http://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr'
```

### decodeSitemapURL(uri, options)

Decode an URI string with basic checking based on **RFC-3986** standard applied to HTTP and HTTPS URLs and sitemap requirements regarding escape codes to decode.

Uses __[a fixed decodeURI function](#decodeuristringuri-options)__ to be **RFC-3986** compliant.

**Checked**:

- scheme must be `http`/`HTTP` or `https`/`HTTPS`;
- path is required, can be empty;
- authority is required;
- port, if any, must be an integer between 0 - 65535;
- host must be a valid IP or domain name;
- URL must be less than 2048 characters.

**Support**:

- Sitemap's escape codes, see __[checkHttpSitemapURL](#checkhttpsitemapurluri)__;
- IDNs: returns URI with its Punydecoded host (Unicode serialization of the domain), if any;
- lower and upper case.

**Note**:

- if one of `userinfo`, `path`, `query` or `fragment` component cannot be decoded, it will be ignored;
- native function `decodeURI` does not support IDNs and cannot properly work with `encodeURI` since the function is based on an outdated standard;
- to stay fully **RFC-3986** compliant, scheme and host are put in lowercase;
- to only use with [encodeSitemapURL](#encodesitemapurluri).

<br/>

**Based on**:

- __<a href="https://tools.ietf.org/html/rfc3986" target="_blank">RFC-3986</a>__;
- __<a href="https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190" target="_blank">Google: Build and submit a sitemap</a>__.

<br/>

- `uri` **<String\>**
- `options` **<Object\>**:
  - `lowercase` **<Boolean\>** Whether the uri should be returned in lowercase. *Default*: `false`
- Returns: **<String\>**
- Throws: **<URIError\>** Error codes:
  - `URI_INVALID_TYPE`
  - `URI_MISSING_SCHEME`
  - `URI_EMPTY_SCHEME`
  - `URI_MISSING_PATH`
  - `URI_INVALID_PATH`
  - `URI_INVALID_HOST`
  - `URI_INVALID_SCHEME`
  - `URI_INVALID_PORT`
  - `URI_MISSING_AUTHORITY`
  - `URI_MAX_LENGTH_URL`

<br/>

**Examples**:

```javascript
decodeSitemapURL(); // throws URIError with code URI_INVALID_TYPE
decodeSitemapURL('://example.com'); // throws URIError with code URI_MISSING_SCHEME
decodeSitemapURL('http:////bar'); // throws URIError with code URI_INVALID_PATH
decodeSitemapURL('http://xn--iñvalid.com'); // throws URIError with code URI_INVALID_HOST
decodeSitemapURL('ftp://bar.com'); // throws URIError with code URI_INVALID_SCHEME
decodeSitemapURL('hôtp://bar.com'); // throws URIError with code URI_INVALID_SCHEME
decodeSitemapURL('http://bar.com:80g80'); // throws URIError with code URI_INVALID_PORT
decodeSitemapURL('http:isbn:0-486-27557-4'); // throws URIError with code URI_MISSING_AUTHORITY
decodeSitemapURL(`http://example.com/${'path'.repeat(2040)}`); // throws URIError with code URI_MAX_LENGTH_URL

decodeSitemapURL('http://user%:pass@xn--fiq228c.com/%?query=%E0%A5%90#anch#or'); // 'http://中文.com/?query=ॐ'
decodeSitemapURL('HTTP://bar.BAZ/IT&apos;S%20OVER%2Athere%2A?a=b&amp;c=d'); // 'http://bar.baz/IT\'S OVER*there*?a=b&c=d'
decodeSitemapURL('http://bar.baz/IT&apos;S%20OVER%2Athere%2A?A=b&amp;c=D', { lowercase: true }); // 'http://bar.baz/it\'s over*there*?a=b&c=d'
```


## Errors

### Object structure

Errors emitted by *@coroboros/uri* are native URIError with an additional *code* property:

```javascript
{
  name,
  code,
  message,
  stack,
}
```

### Codes

<table style="text-align: left; vertical-align: center">
  <tr>
    <th style="text-align: center;">name</th>
    <th style="text-align: center;">code</th>
    <th style="text-align: center;">description</th>
    <th style="text-align: center;">module</th>
  </tr>

  <tr>
    <td rowspan="19"><i>URIError</i></td>
  </tr>

  <tr>
    <td>URI_INVALID_TYPE</td>
    <td>URI variable type is not valid</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_MISSING_SCHEME</td>
    <td>URI scheme is missing</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_EMPTY_SCHEME</td>
    <td>URI scheme is empty</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_SCHEME</td>
    <td>URI scheme is not valid</td>
    <td><code>src/checkers</code><br/><code>src/decoders</code><br/><code>src/encoders</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_SCHEME_CHAR</td>
    <td>URI scheme contains an invalid character</td>
    <td><code>src/checkers</code><br/><code>src/decoders</code><br/><code>src/encoders</code></td>
  </tr>

  <tr>
    <td>URI_MISSING_PATH</td>
    <td>URI path is missing</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_PATH</td>
    <td>URI path is not valid based on RFC-3986</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_MISSING_AUTHORITY</td>
    <td>URI authority is missing</td>
    <td><code>src/checkers</code><br/><code>src/decoders</code><br/><code>src/encoders</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_HOST</td>
    <td>URI host is not valid IP or domain</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_PORT</td>
    <td>URI port is not a number</td>
    <td><code>src/checkers</code><br/><code>src/decoders</code><br/><code>src/encoders</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_CHAR</td>
    <td>URI contains an invalid character</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_USERINFO_CHAR</td>
    <td>URI userinfo contains an invalid character</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_PATH_CHAR</td>
    <td>URI path contains an invalid character</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_QUERY_CHAR</td>
    <td>URI query contains an invalid character</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_FRAGMENT_CHAR</td>
    <td>URI fragment contains an invalid character</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_PERCENT_ENCODING</td>
    <td>A percent-encoding character is not valid</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_INVALID_SITEMAP_ENCODING</td>
    <td>URI contains an invalid sitemap escape code</td>
    <td><code>src/checkers</code></td>
  </tr>

  <tr>
    <td>URI_MAX_LENGTH_URL</td>
    <td>Maximum URL allowed length of 2048 characters has been reached</td>
    <td><code>src/checkers</code></td>
  </tr>

</table>

## Contributing

Bug reports and PRs welcome.

- Open an issue before submitting non-trivial PRs.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.
- Target the `main` branch.

## License

[MIT](LICENSE.md)
