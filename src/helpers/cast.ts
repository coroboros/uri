/**
 * Type casting helpers.
 *
 * Cast a value to a specific primitive type. If the value is
 * not of this type or can not be infer from this type, undefined is returned.
 *
 * undefined is an interesting value. When stringifying an object, an undefined property
 * disappears. Useful to respect data type schemas and where null values are not allowed.
 *
 *    - num(thing, { le, ge } = {}) -> Number or undefined
 *    - int(thing, { le, ge } = {}) -> Integer Number or undefined
 */
import { exists, is } from './object.js';

type Range = { ge?: unknown; le?: unknown };

/**
 * @func number
 *
 * cast to primitive number if possible or returns undefined
 * because Number(null) returns 0 and Number(undefined|NaN) returns NaN
 * beware to call Number.isFinite only on number values
 * NOTE: only finite values
 */
const number = function number(thing: unknown): number | undefined {
  let castNum: number | undefined;

  if (exists(thing)) {
    const value = (thing as { valueOf(): unknown }).valueOf();

    if (is(Number, value)) {
      if (Number.isFinite(value)) {
        castNum = value;
      }
    } else if (is(String, value) || is(Boolean, value)) {
      const cast = Number(value);

      if (Number.isFinite(cast)) {
        castNum = cast;
      }
    }
  }

  return castNum;
};

/**
 * @func num
 *
 * cast to primitive number, with 'less or equal than'
 * or 'greater or equal than' options, or returns undefined
 * NOTE: based on "number" function
 */
const num = function num(thing: unknown, { ge, le }: Range = {}): number | undefined {
  let castNum = number(thing);

  if (castNum !== undefined) {
    const lessThan = number(le);
    const greaterThan = number(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castNum < greaterThan || castNum > lessThan) {
        castNum = undefined;
      }
    } else if (lessThan !== undefined && castNum > lessThan) {
      castNum = undefined;
    } else if (greaterThan !== undefined && castNum < greaterThan) {
      castNum = undefined;
    }
  }

  return castNum;
};

/**
 * @func integer
 *
 * cast to primitive integer number if possible or returns undefined
 * NOTE: based on "number" function, in base 10 only
 */
const integer = function integer(thing: unknown): number | undefined {
  // first cast to number to avoid some inconsistencies with hexa
  const castNum = number(thing);
  let castInt: number | undefined;

  if (castNum !== undefined) {
    const int = parseInt(String(castNum), 10);

    if (!Number.isNaN(int)) {
      castInt = int;
    }
  }

  return castInt;
};

/**
 * @func int
 *
 * cast to primitive integer number, with 'less or equal than'
 * or 'greater or equal than' options, or returns undefined
 * NOTE: based on "integer" function, in base 10 only
 */
const int = function int(thing: unknown, { ge, le }: Range = {}): number | undefined {
  let castInt = integer(thing);

  if (castInt !== undefined) {
    const lessThan = integer(le);
    const greaterThan = integer(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castInt < greaterThan || castInt > lessThan) {
        castInt = undefined;
      }
    } else if (lessThan !== undefined && castInt > lessThan) {
      castInt = undefined;
    } else if (greaterThan !== undefined && castInt < greaterThan) {
      castInt = undefined;
    }
  }

  return castInt;
};

export { int, integer, num, number };
