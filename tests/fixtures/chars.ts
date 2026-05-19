/**
 * chars allowed or not
 */

// generic
export const az = 'abcdefghijklmnopqrstuvwxyz';
export const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const GZ = 'GHIJKLMNOPQRSTUVWXYZ';
export const hexdig = 'ABCDEF';
export const digits = '0123456789';

// allowed
export const allowed = "!#$%&'()*+,-./:;=?@[]_~";

export const unreserved = `${az}${AZ}${digits}-._~`;
export const genDelims = ':/?#[]@';
export const subDelims = "!$&'()*+,;=";
export const reserved = `${genDelims}${subDelims}`;
export const sitemapSubDelims = subDelims.replace(/[*']/g, '');

export const allowedSchemeChars = `${az}${digits}+-.`;
export const allowedDomainChars = `${az}${digits}-`;
export const allowedPercentEncodingChars = `${digits}${hexdig}`;

export const allowedUserinfoChars = `${unreserved}%${subDelims}:`;
export const allowedPathChars = `${unreserved}%${subDelims}:@/`;
export const allowedQueryOrFragmentChars = `${allowedPathChars}?`;

export const allowedSitemapUserinfoChars = `${az}${digits}-._~%${sitemapSubDelims}:`;
export const allowedSitemapPathChars = `${az}${digits}-._~%${sitemapSubDelims}:@/`;
export const allowedSitemapQueryOrFragmentChars = `${allowedSitemapPathChars}?`;

export const allowedUserinfoCharsToEncode = `${unreserved}${subDelims}:`;
export const allowedPathCharsToEncode = `${unreserved}${subDelims}:@/`;
export const allowedQueryOrFragmentCharsToEncode = `${allowedPathCharsToEncode}?`;

export const allowedSitemapUserinfoCharsToEncode = `${az}${digits}-._~${sitemapSubDelims}:`;
export const allowedSitemapPathCharsToEncode = `${az}${digits}-._~${sitemapSubDelims}:@/`;
export const allowedSitemapQueryOrFragmentCharsToEncode = `${allowedSitemapPathCharsToEncode}?`;

// disallowed
export const disallowed = '\\^`{|}<>';
export const disallowedSchemeChars = `${AZ}${disallowed}${allowed.replace(/[-+.]/g, '')}`;
export const disallowedDomainChars = `${AZ}${disallowed}${allowed.replace('-', '')}`;
export const disallowedPercentEncodingChars = `${az}${GZ}${allowed}${disallowed}`;

export const disallowedUserinfoChars = '#/?@[]';
export const disallowedPathChars = '?#[]';
export const disallowedQueryOrFragmentChars = '#[]';

export const disallowedSitemapUserinfoChars = `${disallowedUserinfoChars}${AZ}*'`;
export const disallowedSitemapPathChars = `${disallowedPathChars}${AZ}*'`;
export const disallowedSitemapQueryOrFragmentChars = `${disallowedQueryOrFragmentChars}${AZ}*'`;

export const disallowedUserinfoCharsToEncode = `${disallowedUserinfoChars}%`;
export const disallowedPathCharsToEncode = `${disallowedPathChars}%`;
export const disallowedQueryOrFragmentCharsToEncode = `${disallowedQueryOrFragmentChars}%`;

export const disallowedSitemapUserinfoCharsToEncode = `${disallowedSitemapUserinfoChars}%`;
export const disallowedSitemapPathCharsToEncode = `${disallowedSitemapPathChars}%`;
export const disallowedSitemapQueryOrFragmentCharsToEncode = `${disallowedSitemapQueryOrFragmentChars}%`;

export const disallowedOtherChars = '€°éùèàç §£';
