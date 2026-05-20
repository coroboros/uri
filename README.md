<div align="center">

<img src="assets/logo.png" width="288" height="288" alt="@coroboros/uri"/>

<!-- omit in toc -->
# @coroboros/uri

**RFC-3986 URI toolkit for Node.js. IDN (RFC-3987), IPv6 zone identifiers (RFC 6874), Sitemap protocol. Zero dependencies.**

Parses URIs per **RFC-3986 Appendix B**. Recomposes per §5.3. Resolves references per §5.2. Validates IPs, domains (**RFC 1034 / 1123**), HTTP(S) URLs, and Sitemap URLs. Encodes and decodes URI strings and components.

[![npm](https://img.shields.io/npm/v/@coroboros/uri?style=flat-square&color=000000)](https://www.npmjs.com/package/@coroboros/uri)
[![ci](https://img.shields.io/github/actions/workflow/status/coroboros/uri/ci.yml?branch=main&style=flat-square&label=ci&color=000000)](https://github.com/coroboros/uri/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](https://opensource.org/licenses/MIT)
[![stars](https://img.shields.io/github/stars/coroboros/uri?style=flat-square&label=stars&color=000000)](https://github.com/coroboros/uri)
[![coroboros.com](https://img.shields.io/badge/coroboros.com-000000?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMiAxMmgyME0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjwvc3ZnPg==)](https://coroboros.com)

</div>

<!-- omit in toc -->
## Contents

- [Requirements](#requirements)
- [Install](#install)
- [Usage](#usage)
- [Compliance](#compliance)
- [API](#api)
- [Errors](#errors)
- [Limitations](#limitations)
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
```

```js
// CommonJS
const { parseURI, checkHttpsURL, encodeWebURL } = require('@coroboros/uri');
```

```ts
import { parseURI, checkHttpsURL, encodeWebURL } from '@coroboros/uri';

// Parse — get every RFC-3986 component
parseURI('foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// { scheme: 'foo', host: 'xn--fiq228c.com', hostPunydecoded: '中文.com', port: 8042, … }

// Validate strictly — throws URIError with a stable code on invalid input
try {
  const url = checkHttpsURL('https://example.com/path?q=1#x');
  url.valid; // true
} catch (err) {
  // err.code is one of the documented codes (see [Errors](#errors))
}

// Encode — RFC-3986 compliant, IDN-aware, sub-2048-char HTTP(S)
encodeWebURL('https://www.中文.com./Over There?a=B#Anchôr');
// 'https://www.xn--fiq228c.com./Over%20There?a=B#Anch%C3%B4r'
```

## Compliance

`@coroboros/uri` implements:

- **RFC-3986** — generic URI syntax: parse (Appendix B), recompose (§5.3), reference resolution (§5.2), percent-encoding (§2.1, §6.2.2.1), and character validation (§3.1–§3.5).
- **RFC-3987** — Internationalized Domain Names via Punycode, through Node's `node:url` (`domainToASCII` / `domainToUnicode`).
- **RFC 6874 §2** — IPv6 zone identifiers inside a URI: the `%25` delimiter and `ZoneID = 1*( unreserved / pct-encoded )` grammar.
- **RFC 1034 / RFC 1123** — domain-name rules: label length, character set, label separation.
- **sitemaps.org** — the Sitemap protocol: required XML-entity escaping and the 2,048-character URL ceiling.

See [`bench/baseline.md`](bench/baseline.md) for performance numbers vs native `URL` / `URL.canParse`. The toolkit trades raw speed for RFC-3986 fidelity — full per-character validation, IDN handling, RFC 6874 zone identifiers, and explicit coded errors.

**Generic URI syntax**

![URI Syntax](assets/uri-syntax.png "URI Syntax")

**Example URIs**

![RFC-3986](assets/rfc-3986.png "RFC-3986")

## API

### Types

<details>
<summary><em>ParsedURI</em></summary>

<br>

Return shape of [`parseURI`](#parsing).

```ts
interface ParsedURI {
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
```

Fields default to `null` when the corresponding URI part is missing. `port` is a `number` when parseable as an integer, a `string` otherwise.

</details>

<details>
<summary><em>URIComponents</em></summary>

<br>

Input shape of [`recomposeURI`](#parsing). Every field is optional; `scheme` and `path` are required at runtime.

```ts
interface URIComponents {
  scheme?: string | null;
  userinfo?: string | null;
  host?: string | null;
  port?: number | string | null;
  path?: string | null;
  query?: string | null;
  fragment?: string | null;
}
```

</details>

<details>
<summary><em>CheckedURI</em></summary>

<br>

Return shape of every [`check*`](#checkers) function on success — `ParsedURI` extended with a `valid: true` discriminant.

```ts
interface CheckedURI extends ParsedURI {
  valid: true;
}
```

</details>

### Punycode

<details>
<summary><em>punycode(domain)</em></summary>

<br>

Returns the Punycode ASCII serialization of a domain. Returns the empty string when the input is not a valid domain.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `domain` | `string` | *(required)* | The domain to serialize. |

**Returns** — `string`. The ASCII form (or `''` on invalid input).

**Notes**

- Wraps Node's `url.domainToASCII` and normalizes the error case: the native function throws when called without an argument and returns `'null'` / `'undefined'` / `'nan'` for the corresponding non-domain inputs.
- IPv6 literals are passed through unchanged (the native function rejects them).

**Examples**

```ts
punycode();                                       // ''
punycode('a.b.c.d.e.fg');                         // 'a.b.c.d.e.fg'
punycode('xn--iñvalid.com');                      // ''
punycode('中文.com');                              // 'xn--fiq228c.com'
punycode('xn--fiq228c.com');                      // 'xn--fiq228c.com'
punycode('2001:db8:85a3:8d3:1319:8a2e:370:7348'); // '2001:db8:85a3:8d3:1319:8a2e:370:7348'
punycode('127.0.0.1');                            // '127.0.0.1'
```

</details>

<details>
<summary><em>punydecode(domain)</em></summary>

<br>

Returns the Unicode serialization of a domain. Returns the empty string when the input is not a valid domain.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `domain` | `string` | *(required)* | The domain to deserialize. |

**Returns** — `string`. The Unicode form (or `''` on invalid input).

**Notes**

- Wraps Node's `url.domainToUnicode` and normalizes the same error edges as [`punycode`](#punycodedomain).

**Examples**

```ts
punydecode();                                       // ''
punydecode('xn--fiq228c.com');                      // '中文.com'
punydecode('中文.com');                              // '中文.com'
punydecode('xn--iñvalid.com');                      // ''
punydecode('2001:db8:85a3:8d3:1319:8a2e:370:7348'); // '2001:db8:85a3:8d3:1319:8a2e:370:7348'
punydecode('127.0.0.1');                            // '127.0.0.1'
```

</details>

### Parsing

<details>
<summary><em>parseURI(uri)</em></summary>

<br>

Parses a URI into its **RFC-3986 Appendix B** components, with IPv4/IPv6 host support and IDN (Punycode) awareness.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `uri` | `string` | *(required)* | The URI string to parse. |

**Returns** — [`ParsedURI`](#types).

**Notes**

- Scheme and host are lowercased per **RFC-3986 §6.2.2.1**.
- Authority and its components are `null` when the authority is absent or empty.
- A present-but-empty query or fragment (`?` or `#` with nothing after) is preserved as `''`, distinct from a missing one (`null`).
- For strict validation, prefer [`checkURI`](#checkers).

**Examples**

```ts
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

parseURI('urn:isbn:0-486-27557-4');
// { scheme: 'urn', authority: null, path: 'isbn:0-486-27557-4', href: 'urn:isbn:0-486-27557-4', … }

parseURI('http://user:pass@[fe80::7:8%eth0]:8080');
// { scheme: 'http', host: 'fe80::7:8%eth0', port: 8080, path: '', href: 'http://user:pass@[fe80::7:8%eth0]:8080/', … }
```

</details>

<details>
<summary><em>recomposeURI(components)</em></summary>

<br>

Recomposes a URI from its components per **RFC-3986 §5.3**, with basic validity checking. Returns the empty string when the rules below are not met.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `components` | [`URIComponents`](#types) | *(required)* | The components to recompose. |

**Returns** — `string`. The recomposed URI (or `''` on invalid input).

**Notes**

- `scheme` is required and must be at least one character.
- `path` is required and may be empty.
- If `host` is present, `path` must be empty or start with `/`.
- If `host` is absent, `path` must not start with `//`.
- `host`, if present, must be at least three characters.
- `userinfo` is ignored when empty.
- `port` is ignored when not parseable as an integer in `0–65535`.
- `query` and `fragment` are ignored when empty.
- A trailing `/` is added to any URI with a host and an empty path.

**Examples**

```ts
recomposeURI({
  scheme: 'foo',
  userinfo: 'user:pass',
  host: 'bar.com',
  port: 8080,
  path: '/over/there',
  query: 'a=b',
  fragment: 'anchor',
}); // 'foo://user:pass@bar.com:8080/over/there?a=b#anchor'

recomposeURI({ scheme: 'foo', path: '' });
// 'foo:'

recomposeURI({
  scheme: 'foo',
  userinfo: 'user:pass',
  host: 'fe80::7:8%eth0',
  port: '8080',
  path: '/over/there',
  query: 'a=b',
  fragment: 'anchor',
}); // 'foo://user:pass@[fe80::7:8%eth0]:8080/over/there?a=b#anchor'
```

</details>

### Reference resolution

<details>
<summary><em>resolveURI(base, reference)</em></summary>

<br>

Resolves a URI reference against an absolute base URI per **RFC-3986 §5.2**: the §5.2.2 strict transform, the §5.2.3 merge, the §5.2.4 `remove_dot_segments`, then recomposes per §5.3.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `base` | `string` | *(required)* | The absolute base URI. |
| `reference` | `string` | *(required)* | The URI reference to resolve. |

**Returns** — `string`. The resolved URI, or `''` when the base is not absolute or an argument is not a string.

**Notes**

- The strict algorithm is used: a reference scheme equal to the base scheme is not ignored.
- A fragment on the base is stripped before resolution per **RFC-3986 §5.1**.

**Examples**

```ts
resolveURI('http://a/b/c/d;p?q', '../../g');     // 'http://a/g'
resolveURI('https://example.com/a/b', './c?x#y'); // 'https://example.com/a/c?x#y'
resolveURI('/not-absolute', 'g');                 // '' — base is not absolute
```

</details>

<details>
<summary><em>removeDotSegments(path)</em></summary>

<br>

Removes the `.` and `..` complete path segments from a path per **RFC-3986 §5.2.4** verbatim.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | *(required)* | The path to normalize. |

**Returns** — `string`. The normalized path.

**Examples**

```ts
removeDotSegments('/a/b/c/./../../g');   // '/a/g'
removeDotSegments('mid/content=5/../6'); // 'mid/6'
```

</details>

### Validators

<details>
<summary><em>isDomainLabel(label)</em></summary>

<br>

Tests whether a label is a valid domain label per **RFC 1034**. By convention, an uppercased label is considered invalid (`DNS names are case-insensitive, but Coroboros normalizes on lowercase`).

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | *(required)* | The label to test. |

**Returns** — `boolean`.

**Notes**

- Length is one to 63 characters.
- Allowed characters: lowercase letters, digits, hyphen.
- Cannot start or end with a hyphen.
- No consecutive hyphens.
- Can start or end with a digit.

**Examples**

```ts
isDomainLabel('a');           // true
isDomainLabel('1a3');         // true
isDomainLabel('a'.repeat(64)); // false
isDomainLabel('A');           // false
isDomainLabel('-a');          // false
isDomainLabel('la--bel');     // false
```

</details>

<details>
<summary><em>isDomain(name)</em></summary>

<br>

Tests whether a name is a valid domain per **RFC 1034**, with FQDN and IDN support.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | The domain to test. |

**Returns** — `boolean`.

**Notes**

- [`isDomainLabel`](#validators) rules apply to each label.
- Total length is at most 255 octets including label-length octets.
- Labels are separated by `.`.
- Must have at least one extension label.
- All labels must differ.
- The last label can be empty (root label `.`).
- Labels starting with `xn--` are valid only when the ASCII serialization is a valid Punycode and the decoded form has valid characters.

**Examples**

```ts
isDomain('a.b');                 // true
isDomain('a.b.');                // true
isDomain('中文.com');             // true
isDomain('xn--fiq228c.com');     // true
isDomain('www.中文.com');         // true

isDomain('a');                   // false
isDomain('a.a');                 // false
isDomain('中文.xn--fiq228c.com'); // false
isDomain('xn--\'-6xd.com');      // false — valid Punycode for ॐ, but ॐ is not a valid character
```

</details>

<details>
<summary><em>isIP(ip)</em></summary>

<br>

Tests whether a string is a valid IPv4 or IPv6 address.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `ip` | `string` | *(required)* | The address to test. |

**Returns** — `boolean`.

**Examples**

```ts
isIP('23.71.254.72');     // true
isIP('1:2:3:4::6:7:8');   // true
isIP('100..100.100.100'); // false
isIP('3ffe:b00::1::a');   // false
```

</details>

<details>
<summary><em>isIPv4(ip)</em></summary>

<br>

Tests whether a string is a valid IPv4 address. Returns `false` for IPv6.

```ts
isIPv4('8.8.8.8'); // true
isIPv4('1:2::8');  // false
```

</details>

<details>
<summary><em>isIPv6(ip)</em></summary>

<br>

Tests whether a string is a valid IPv6 address. Returns `false` for IPv4. The standalone validator is lenient regarding zone identifiers — see [`checkURI`](#checkers) for the strict **RFC 6874** form expected inside a URI.

```ts
isIPv6('2001:0000:1234:0000:0000:C1C0:ABCD:0876'); // true
isIPv6('212.58.241.131');                          // false
```

</details>

### Checkers

<details>
<summary><em>checkURI(uri)</em></summary>

<br>

Strictly validates a URI per **RFC-3986**. Returns the parsed components with `valid: true` on success; throws `URIError` with a stable [error code](#errors) on the first failure.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `uri` | `string` | *(required)* | The URI to validate. |

**Returns** — [`CheckedURI`](#types).

**Throws** — `URIError` with one of: `URI_INVALID_TYPE`, `URI_MISSING_SCHEME`, `URI_EMPTY_SCHEME`, `URI_MISSING_PATH`, `URI_INVALID_PATH`, `URI_INVALID_HOST`, `URI_INVALID_SCHEME_CHAR`, `URI_INVALID_USERINFO_CHAR`, `URI_INVALID_PORT`, `URI_INVALID_PATH_CHAR`, `URI_INVALID_QUERY_CHAR`, `URI_INVALID_FRAGMENT_CHAR`, `URI_INVALID_PERCENT_ENCODING`.

**Notes**

- Scheme is required and non-empty (**RFC-3986 §3.1**).
- Path is required and may be empty.
- If authority is present, path must be empty or start with `/`; otherwise path must not start with `//`.
- Authority components: host must be a valid IP or domain; `userinfo` only allows the characters from **RFC-3986 §3.2.1**; `port` must be an integer in `0–65535`.
- Path, query, and fragment only allow the characters from **RFC-3986 §3.3 / §3.4 / §3.5**.
- IPv6 zone identifiers must use the `%25` delimiter and a non-empty `ZoneID` of `unreserved` / `pct-encoded` characters (**RFC 6874 §2**).

**Examples**

```ts
checkURI('foo://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// { scheme: 'foo', host: 'xn--fiq228c.com', valid: true, … }

checkURI();                                          // throws URIError — URI_INVALID_TYPE
checkURI('://example.com');                          // throws URIError — URI_MISSING_SCHEME
checkURI('foo:////bar');                             // throws URIError — URI_INVALID_PATH
checkURI('foo://xn--iñvalid.com');                   // throws URIError — URI_INVALID_HOST
checkURI('fôo:bar');                                 // throws URIError — URI_INVALID_SCHEME_CHAR
checkURI('foo://üser:pass@bar.com');                 // throws URIError — URI_INVALID_USERINFO_CHAR
checkURI('foo://bar.com:80g80');                     // throws URIError — URI_INVALID_PORT
checkURI('foo://bar.com/°');                         // throws URIError — URI_INVALID_PATH_CHAR
checkURI('foo://bar.com/over/there?quêry=5');        // throws URIError — URI_INVALID_QUERY_CHAR
checkURI('foo://bar.com/over/there?query=5#anch#r'); // throws URIError — URI_INVALID_FRAGMENT_CHAR
checkURI('http://www.bar.baz/foo%2');                // throws URIError — URI_INVALID_PERCENT_ENCODING
```

</details>

<details>
<summary><em>checkHttpURL(uri)</em></summary>

<br>

Validates a URI as an HTTP URL on top of [`checkURI`](#checkers).

**Adds**

- `scheme` must be `http` or `HTTP` — else `URI_INVALID_SCHEME`.
- `authority` is required — else `URI_MISSING_AUTHORITY`.
- URL must be shorter than 2,048 characters — else `URI_MAX_LENGTH_URL`.

**Returns** — [`CheckedURI`](#types). Throws `URIError` with any of `checkURI`'s codes plus the three above.

```ts
checkHttpURL('http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret#nose');
// { scheme: 'http', host: 'xn--fiq228c.com', valid: true, … }
```

</details>

<details>
<summary><em>checkHttpsURL(uri)</em></summary>

<br>

Same as [`checkHttpURL`](#checkers) but `scheme` must be `https` or `HTTPS`.

</details>

<details>
<summary><em>checkWebURL(uri)</em></summary>

<br>

Same as [`checkHttpURL`](#checkers) but `scheme` can be `http` / `HTTP` or `https` / `HTTPS`.

</details>

<details>
<summary><em>checkHttpSitemapURL(uri)</em></summary>

<br>

Validates a URI as an HTTP URL fit for an XML sitemap on top of [`checkHttpURL`](#checkers).

**Adds**

- The URL must be all lowercase (scheme, host, path, query, fragment) — else `URI_INVALID_CHAR`.
- Specific characters must be escaped — the table below lists them.
- Percent-encoded sitemap escapes (`&amp;`, `&apos;`, `&quot;`, `&lt;`, `&gt;`) must be well-formed — else `URI_INVALID_SITEMAP_ENCODING`.

**Sitemap-escaped characters**

| Character    | Value | Escape code |
| :----------- | :---: | :---------: |
| Ampersand    | `&`   | `&amp;`     |
| Single quote | `'`   | `&apos;`    |
| Double quote | `"`   | `&quot;`    |
| Less than    | `<`   | `&lt;`      |
| Greater than | `>`   | `&gt;`      |
| Asterisk     | `*`   | `%2A`       |

For plain-text sitemaps no escaping is required — use [`checkHttpURL`](#checkers) instead, but the URL must still be lowercase.

**Returns** — [`CheckedURI`](#types). Throws `URIError` with the union of `checkHttpURL`'s codes plus `URI_INVALID_CHAR`, `URI_INVALID_SITEMAP_ENCODING`.

```ts
checkHttpSitemapURL('http://user:pass@xn--fiq228c.com:8042/over/there?name=ferret&amp;catch=rabbits#nose');
// { scheme: 'http', host: 'xn--fiq228c.com', valid: true, … }
```

</details>

<details>
<summary><em>checkHttpsSitemapURL(uri)</em></summary>

<br>

Same as [`checkHttpSitemapURL`](#checkers) but `scheme` must be `https`.

</details>

<details>
<summary><em>checkSitemapURL(uri)</em></summary>

<br>

Same as [`checkHttpSitemapURL`](#checkers) but `scheme` can be `http` or `https`.

</details>

### Encoders

<details>
<summary><em>encodeURIComponentString(component, options)</em></summary>

<br>

Encodes a URI component per **RFC-3986**, with per-type rules and an optional Sitemap-aware mode. Returns the empty string when the input is not a string.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `component` | `string` | *(required)* | The component to encode. |
| `options.type` | `'userinfo' \| 'path' \| 'query' \| 'fragment'` | *(none)* | The component type. Without a type, native `encodeURIComponent` is used (RFC-2396, outdated). |
| `options.lowercase` | `boolean` | `false` | Lowercase the component before encoding. |
| `options.sitemap` | `boolean` | `false` | Escape Sitemap's special characters (see [`checkHttpSitemapURL`](#checkers)). |

**Returns** — `string`. The encoded component (or `''` on invalid input).

**Notes**

- Only `userinfo`, `path`, `query`, and `fragment` can be percent-encoded. `scheme` and `authority` (host and port) cannot.
- Pass a component type. Without it, native `encodeURIComponent` over-escapes `!`, `*`, `'`, `(`, `)`, which **RFC-3986** treats as valid sub-delims.

**Examples**

```ts
encodeURIComponentString('cômpön€nt');                     // 'c%C3%B4mp%C3%B6n%E2%82%ACnt'
encodeURIComponentString('AbC', { lowercase: true });      // 'abc'
encodeURIComponentString('*', { sitemap: true });          // '%2A'
encodeURIComponentString("A#/?@[]&'*");                    // 'A%23%2F%3F%40%5B%5D%26\'*' — outdated RFC-2396
encodeURIComponentString("A#/?@[]&'*", { type: 'userinfo' }); // 'A%23%2F%3F%40%5B%5D&\'*'
encodeURIComponentString("A#/?@[]&'*", { type: 'path' });     // 'A%23/%3F@%5B%5D&\'*'
encodeURIComponentString("A#/?@[]&'*", { type: 'fragment', sitemap: true });
// 'a%23/?@%5B%5D&amp;&apos;%2A'
```

</details>

<details>
<summary><em>encodeURIString(uri, options)</em></summary>

<br>

Encodes a URI string per **RFC-3986** with basic validity checking and IDN support. The native `encodeURI` is **RFC-2396**, which is outdated and over-encodes; this function fixes both issues.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `uri` | `string` | *(required)* | The URI to encode. |
| `options.lowercase` | `boolean` | `false` | Lowercase the entire URI including path, query, and fragment. |

**Returns** — `string`. The encoded URI.

**Throws** — `URIError` with one of: `URI_INVALID_TYPE`, `URI_MISSING_SCHEME`, `URI_EMPTY_SCHEME`, `URI_MISSING_PATH`, `URI_INVALID_PATH`, `URI_INVALID_HOST`, `URI_INVALID_SCHEME_CHAR`, `URI_INVALID_PORT`.

**Notes**

- Only `userinfo`, `path`, `query`, and `fragment` can be percent-encoded; `scheme` and `host` cannot.
- IDN hosts are serialized to Punycode.
- `[` and `]` are not percent-encoded — they delimit IPv6 hosts.
- By default only scheme and host are lowercased (**RFC-3986 §6.2.2.1**). Path, query, and fragment are case-sensitive — see [Limitations](#limitations) for the `lowercase` flag's scope.

**Examples**

```ts
encodeURIString('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor');
// 'https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor'

encodeURIString('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor', { lowercase: true });
// 'https://www.xn--fiq228c.com./over/there?a=b&b=c#anchor'

encodeURIString('foo://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr');
// 'foo://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'
```

</details>

<details>
<summary><em>encodeWebURL(uri, options)</em></summary>

<br>

Encodes an HTTP or HTTPS URL per **RFC-3986**, on top of [`encodeURIString`](#encoders). Uses the same fixed-encode logic but enforces the HTTP(S) constraints.

**Adds**

- `scheme` must be `http` / `HTTP` or `https` / `HTTPS` — else `URI_INVALID_SCHEME`.
- `authority` is required — else `URI_MISSING_AUTHORITY`.
- URL must be shorter than 2,048 characters — else `URI_MAX_LENGTH_URL`.

**Parameters and options** — identical to [`encodeURIString`](#encoders).

**Examples**

```ts
encodeWebURL('HTTPS://WWW.中文.COM./Over/There?a=B&b=c#Anchor');
// 'https://www.xn--fiq228c.com./Over/There?a=B&b=c#Anchor'

encodeWebURL('http://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr');
// 'http://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r'
```

</details>

<details>
<summary><em>encodeSitemapURL(uri)</em></summary>

<br>

Encodes an HTTP or HTTPS URL for an XML sitemap on top of [`encodeWebURL`](#encoders) — applies Sitemap escape codes and lowercases the URL.

**Adds**

- Sitemap's special characters are escaped (see [`checkHttpSitemapURL`](#checkers)).
- The output is fully lowercased.

**Examples**

```ts
encodeSitemapURL("http://user:p'âss@bar.baz/it's *ver/there?a=b&b=c#anch*r");
// 'http://user:p&apos;%C3%A2ss@bar.baz/it&apos;s%20%2Aver/there?a=b&amp;b=c#anch%2Ar'
```

</details>

### Decoders

<details>
<summary><em>decodeURIComponentString(component, options)</em></summary>

<br>

Decodes a URI component string. Returns the empty string when the input cannot be decoded (`decodeURIComponent` would throw).

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `component` | `string` | *(required)* | The component to decode. |
| `options.lowercase` | `boolean` | `false` | Lowercase the result. |
| `options.sitemap` | `boolean` | `false` | Decode Sitemap escape codes (see [`checkHttpSitemapURL`](#checkers)). |

**Returns** — `string`. The decoded component (or `''` on invalid input).

**Examples**

```ts
decodeURIComponentString('%2A');                                       // '*'
decodeURIComponentString('&apos;&amp;%2A', { sitemap: true });         // "'&*"
decodeURIComponentString('SITE&amp;maP', { sitemap: true, lowercase: true });
// 'site&map'
```

</details>

<details>
<summary><em>decodeURIString(uri, options)</em></summary>

<br>

Decodes a URI string per **RFC-3986** with basic validity checking and IDN support — the inverse of [`encodeURIString`](#encoders).

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `uri` | `string` | *(required)* | The URI to decode. |
| `options.lowercase` | `boolean` | `false` | Lowercase the entire URI including path, query, and fragment. |

**Returns** — `string`. The decoded URI.

**Throws** — `URIError` with one of: `URI_INVALID_TYPE`, `URI_MISSING_SCHEME`, `URI_EMPTY_SCHEME`, `URI_MISSING_PATH`, `URI_INVALID_PATH`, `URI_INVALID_HOST`, `URI_INVALID_SCHEME_CHAR`, `URI_INVALID_PORT`.

**Notes**

- A component that cannot be decoded is silently passed through (preserves the encoded form).
- IDN hosts are returned in Unicode form (Punydecoded).
- See [Limitations](#limitations) for the `lowercase` flag's scope.

**Examples**

```ts
decodeURIString('http://user%:pass@xn--fiq228c.com/%?query=%E0%A5%90#anch#or');
// 'http://中文.com/?query=ॐ'

decodeURIString('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor');
// 'https://www.中文.com./Over/There?a=B&b=c#Anchor'

decodeURIString('foo://us%C3%ABr:p%C3%A2ss@bar.baz:8080/Ov%C3%ABr%20There?%C3%B9=B&b=c#Anch%C3%B4r');
// 'foo://usër:pâss@bar.baz:8080/Ovër There?ù=B&b=c#Anchôr'
```

</details>

<details>
<summary><em>decodeWebURL(uri, options)</em></summary>

<br>

Decodes an HTTP or HTTPS URL per **RFC-3986** on top of [`decodeURIString`](#decoders) — the inverse of [`encodeWebURL`](#encoders).

**Adds**

- `scheme` must be `http` / `HTTP` or `https` / `HTTPS` — else `URI_INVALID_SCHEME`.
- `authority` is required — else `URI_MISSING_AUTHORITY`.
- URL must be shorter than 2,048 characters — else `URI_MAX_LENGTH_URL`.

**Examples**

```ts
decodeWebURL('HTTPS://WWW.xn--fiq228c.COM./Over/There?a=B&b=c#Anchor');
// 'https://www.中文.com./Over/There?a=B&b=c#Anchor'
```

</details>

<details>
<summary><em>decodeSitemapURL(uri, options)</em></summary>

<br>

Decodes an HTTP or HTTPS URL coming from an XML sitemap — the inverse of [`encodeSitemapURL`](#encoders). Sitemap escape codes are converted back to their characters.

**Examples**

```ts
decodeSitemapURL('HTTP://bar.BAZ/IT&apos;S%20OVER%2Athere%2A?a=b&amp;c=d');
// "http://bar.baz/IT'S OVER*there*?a=b&c=d"

decodeSitemapURL('http://bar.baz/IT&apos;S%20OVER%2Athere%2A?A=b&amp;c=D', { lowercase: true });
// "http://bar.baz/it's over*there*?a=b&c=d"
```

</details>

## Errors

Errors emitted by `@coroboros/uri` are native `URIError` instances with an additional `code` property:

```ts
{
  name: 'URIError',
  code: URIErrorCode,
  message: string,
  stack: string,
}
```

The `code` field is a stable string discriminant safe for runtime branching.

<details>
<summary><em>Error codes</em></summary>

<br>

| Code | Description | Module |
| --- | --- | --- |
| `URI_INVALID_TYPE` | URI variable type is not valid. | `src/checkers` |
| `URI_MISSING_SCHEME` | URI scheme is missing. | `src/checkers` |
| `URI_EMPTY_SCHEME` | URI scheme is empty. | `src/checkers` |
| `URI_INVALID_SCHEME` | URI scheme is not valid. | `src/checkers`, `src/decoders`, `src/encoders` |
| `URI_INVALID_SCHEME_CHAR` | URI scheme contains an invalid character. | `src/checkers`, `src/decoders`, `src/encoders` |
| `URI_MISSING_PATH` | URI path is missing. | `src/checkers` |
| `URI_INVALID_PATH` | URI path is not valid per **RFC-3986**. | `src/checkers` |
| `URI_MISSING_AUTHORITY` | URI authority is missing. | `src/checkers`, `src/decoders`, `src/encoders` |
| `URI_INVALID_HOST` | URI host is not a valid IP or domain. | `src/checkers` |
| `URI_INVALID_PORT` | URI port is not a number. | `src/checkers`, `src/decoders`, `src/encoders` |
| `URI_INVALID_CHAR` | URI contains an invalid character. | `src/checkers` |
| `URI_INVALID_USERINFO_CHAR` | URI userinfo contains an invalid character. | `src/checkers` |
| `URI_INVALID_PATH_CHAR` | URI path contains an invalid character. | `src/checkers` |
| `URI_INVALID_QUERY_CHAR` | URI query contains an invalid character. | `src/checkers` |
| `URI_INVALID_FRAGMENT_CHAR` | URI fragment contains an invalid character. | `src/checkers` |
| `URI_INVALID_PERCENT_ENCODING` | A percent-encoding character is not valid. | `src/checkers` |
| `URI_INVALID_SITEMAP_ENCODING` | URI contains an invalid sitemap escape code. | `src/checkers` |
| `URI_MAX_LENGTH_URL` | Maximum URL length of 2,048 characters has been reached. | `src/checkers` |

</details>

## Limitations

- A present-but-empty query or fragment (a bare `?` or `#`) is preserved and round-trips, distinct from an absent one (**RFC-3986 §5.3**).
- A port must be a string of ASCII digits (**RFC-3986 §3.2.3**) — values like `0x1F` are rejected.
- `userinfo` is delimited by the last `@`, and a non-IPv6 host/port by the last `:` (**RFC-3986 §3.2**).
- Percent-encoding hex is case-insensitive: `%3a` and `%3A` are both accepted (**RFC-3986 §6.2.2.1**).
- Inside a URI, an IPv6 zone identifier must use the `%25` delimiter and a non-empty `ZoneID` of `unreserved` / `pct-encoded` characters (**RFC 6874 §2**). The standalone [`isIPv6`](#validators) validator stays lenient.
- `encodeSitemapURL` escapes all five XML entities `& ' " < >`, and a Sitemap URL must be shorter than 2,048 characters (sitemaps.org). For example, `encodeSitemapURL('http://example.com/a&b<c>d')` returns `'http://example.com/a&amp;b&lt;c&gt;d'`.
- This is a strict **RFC-3986** toolkit, not a WHATWG URL parser — it does not apply WHATWG host/IPv4 leniency.
- IPv6 addresses are not canonicalized to **RFC 5952** form.
- The `lowercase` option lowercases the entire input including path, query, and fragment, which are case-sensitive per **RFC-3986 §6.2.2.1**. Use `lowercase` for Sitemap or convenience, not as RFC normalization. By default only scheme and host are lowercased, which is the RFC-compliant behavior.

## Contributing

Bug reports and PRs welcome.

- Open an issue before submitting non-trivial PRs.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.
- Run `pnpm bench` against `bench/baseline.md` when touching parser, encoders, or decoders — no regression beyond 10 % on any bucket at fixed feature set.
- Target the `main` branch.

## License

[MIT](LICENSE.md)
