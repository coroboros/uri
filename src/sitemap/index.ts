/**
 * sitemap
 *
 * Percent encodings, entities and escape codes.
 *
 * - specialChars
 * - specialCharsKeys
 * - pencodings
 * - pencodingsKeys
 * - entities
 * - entitiesKeys
 * - escapeCodes
 * - escapeCodesKeys
 * - escapeCodesKeysLen
 */

// special chars and their percent encodings
const specialChars: Record<string, string> = {
  '*': '%2A',
};

// special chars keys
const specialCharsKeys = Object.keys(specialChars);

// inversed special chars (percent encodings)
const pencodings: Record<string, string> = {};
specialCharsKeys.forEach((char) => {
  pencodings[specialChars[char] as string] = char;
});

const pencodingsKeys = Object.keys(pencodings);

// sitemap entities to be escaped in URLs
const entities: Record<string, string> = {
  '&': '&amp;',
  "'": '&apos;',
};

// entities keys
const entitiesKeys = Object.keys(entities);

// inversed entities keys (escape codes)
const escapeCodes: Record<string, string> = {};
entitiesKeys.forEach((entity) => {
  escapeCodes[entities[entity] as string] = entity;
});

// escape codes keys and length
const escapeCodesKeys = Object.keys(escapeCodes);
const escapeCodesKeysLen = escapeCodesKeys.length;

export {
  entities,
  entitiesKeys,
  escapeCodes,
  escapeCodesKeys,
  escapeCodesKeysLen,
  pencodings,
  pencodingsKeys,
  specialChars,
  specialCharsKeys,
};
