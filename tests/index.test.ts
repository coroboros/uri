import { describe, expect, it } from 'vitest';
import * as lib from '../src/index.js';

describe('#lib', () => {
  describe('when requiring lib', () => {
    it('should return the expected functions', () => {
      for (const fn of Object.values(lib)) {
        expect(typeof fn).toBe('function');
      }
    });
  });
});
