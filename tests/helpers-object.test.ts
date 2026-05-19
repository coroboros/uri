import { describe, expect, it } from 'vitest';
import { object } from '../src/helpers/index.js';

const { exists, is } = object;

describe('#object helper', () => {
  describe('when using exists', () => {
    it('should return true when testing a string', () => {
      expect(exists('')).toBe(true);
      expect(exists(' ')).toBe(true);
      expect(exists('x')).toBe(true);
      expect(exists('')).toBe(true);
      expect(exists(' ')).toBe(true);
      expect(exists('x')).toBe(true);
      expect(exists(new String(''))).toBe(true);
      expect(exists(new String(' '))).toBe(true);
      expect(exists(new String('x'))).toBe(true);
    });

    it('should return true when testing a number', () => {
      expect(exists(5)).toBe(true);
      expect(exists(5.5)).toBe(true);
      expect(exists(Infinity)).toBe(true);
      expect(exists(0xff)).toBe(true);
      expect(exists(0b111110111)).toBe(true);
      expect(exists(0o767)).toBe(true);
      expect(exists(new Number('5'))).toBe(true);
    });

    it('should return true when testing a boolean', () => {
      expect(exists(true)).toBe(true);
      expect(exists(false)).toBe(true);
      expect(exists(new Boolean('true'))).toBe(true);
    });

    it('should return true when testing a symbol', () => {
      expect(exists(Symbol('x'))).toBe(true);
    });

    it('should return true when testing a function', () => {
      expect(exists(function f() {})).toBe(true);
    });

    it('should return true when testing an object', () => {
      class c {}
      expect(exists({})).toBe(true);
      expect(exists({ x: 5 })).toBe(true);
      expect(exists(c)).toBe(true);
    });

    it('should return true when testing an error', () => {
      expect(exists(new Error('error'))).toBe(true);
    });

    it('should return true when testing a date', () => {
      expect(exists(Date.now())).toBe(true);
      expect(exists(new Date())).toBe(true);
    });

    it('should return true when testing an array', () => {
      expect(exists([])).toBe(true);
      expect(exists([5])).toBe(true);
      expect(exists([])).toBe(true);
      expect(exists(new Array(0))).toBe(true);
    });

    it('should return true when testing a map', () => {
      expect(exists(new Map())).toBe(true);
    });

    it('should return true when testing a set', () => {
      expect(exists(new Set())).toBe(true);
    });

    it('should return true when testing a weakmap', () => {
      expect(exists(new WeakMap())).toBe(true);
    });

    it('should return true when testing a weakset', () => {
      expect(exists(new WeakSet())).toBe(true);
    });

    it('should return false when testing undefined', () => {
      expect(exists(undefined)).toBe(false);
    });

    it('should return false when testing NaN', () => {
      expect(exists(NaN)).toBe(false);
    });

    it('should return false when testing null', () => {
      expect(exists(null)).toBe(false);
    });
  });

  describe('when using is', () => {
    it('should return true when testing a string', () => {
      expect(is(String, '')).toBe(true);
      expect(is(String, ' ')).toBe(true);
      expect(is(String, 'x')).toBe(true);
      expect(is(String, '')).toBe(true);
      expect(is(String, ' ')).toBe(true);
      expect(is(String, 'x')).toBe(true);
      expect(is(String, new String(''))).toBe(true);
      expect(is(String, new String(' '))).toBe(true);
      expect(is(String, new String('x'))).toBe(true);
    });

    it('should return true when testing a number', () => {
      expect(is(Number, 5)).toBe(true);
      expect(is(Number, 5.5)).toBe(true);
      expect(is(Number, Infinity)).toBe(true);
      expect(is(Number, 0xff)).toBe(true);
      expect(is(Number, 0b111110111)).toBe(true);
      expect(is(Number, 0o767)).toBe(true);
      expect(is(Number, new Number('5'))).toBe(true);
    });

    it('should return true when testing a boolean', () => {
      expect(is(Boolean, true)).toBe(true);
      expect(is(Boolean, false)).toBe(true);
      expect(is(Boolean, new Boolean('true'))).toBe(true);
    });

    it('should return true when testing a symbol', () => {
      expect(is(Symbol, Symbol('x'))).toBe(true);
    });

    it('should return true when testing a function', () => {
      expect(is(Function, function f() {})).toBe(true);
    });

    it('should return true when testing an object', () => {
      class c {}
      expect(is(Object, {})).toBe(true);
      expect(is(Object, { x: 5 })).toBe(true);
      expect(is(Object, c)).toBe(true);
    });

    it('should return true when testing an error', () => {
      expect(is(Error, new Error('error'))).toBe(true);
    });

    it('should return true when testing a date', () => {
      expect(is(Date, new Date())).toBe(true);
    });

    it('should return true when testing an array', () => {
      expect(is(Array, [])).toBe(true);
      expect(is(Array, [5])).toBe(true);
      expect(is(Array, [])).toBe(true);
      expect(is(Array, new Array(0))).toBe(true);
    });

    it('should return true when testing a map', () => {
      expect(is(Map, new Map())).toBe(true);
    });

    it('should return true when testing a set', () => {
      expect(is(Set, new Set())).toBe(true);
    });

    it('should return true when testing a weakmap', () => {
      expect(is(WeakMap, new WeakMap())).toBe(true);
    });

    it('should return true when testing a weakset', () => {
      expect(is(WeakSet, new WeakSet())).toBe(true);
    });

    it('should return false when testing NaN to be a Number', () => {
      expect(is(Number, NaN)).toBe(false);
    });

    it('should return false when the type does not exist', () => {
      expect(is(undefined, '')).toBe(false);
      expect(is(NaN, '')).toBe(false);
      expect(is(null, '')).toBe(false);
    });

    it('should return false when the value does not exist', () => {
      expect(is(String, undefined)).toBe(false);
      expect(is(String, NaN)).toBe(false);
      expect(is(String, null)).toBe(false);
    });

    it("should return false when both type and value don't exist", () => {
      expect(is(undefined, undefined)).toBe(false);
      expect(is(undefined, NaN)).toBe(false);
      expect(is(undefined, null)).toBe(false);
      expect(is(NaN, undefined)).toBe(false);
      expect(is(NaN, NaN)).toBe(false);
      expect(is(NaN, null)).toBe(false);
      expect(is(null, undefined)).toBe(false);
      expect(is(null, NaN)).toBe(false);
      expect(is(null, null)).toBe(false);
    });
  });
});
