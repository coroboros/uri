/**
 * Internal type guards.
 *
 * - exists(thing) -> boolean
 * - is(Type, thing) -> boolean
 */

/**
 * Whether the specified value is not null, undefined or NaN.
 */
const exists = function exists<T>(thing: T): thing is NonNullable<T> {
  return !(thing === undefined || thing === null || Number.isNaN(thing as number));
};

type SupportedConstructor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor;

/**
 * Whether the specified value is from the specified type regarding its whole prototype.
 */
function is(Type: StringConstructor, thing: unknown): thing is string;
function is(Type: NumberConstructor, thing: unknown): thing is number;
function is(Type: BooleanConstructor, thing: unknown): thing is boolean;
function is(Type: ArrayConstructor, thing: unknown): thing is unknown[];
function is(Type: SupportedConstructor, thing: unknown): boolean {
  return (
    exists(Type) &&
    exists(thing) &&
    ((thing as { constructor?: unknown }).constructor === Type || thing instanceof Type)
  );
}

export { exists, is };
