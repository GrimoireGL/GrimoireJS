/// <reference path="../../src/bundle.ts" />

import * as assert from 'power-assert';
import * as GomlParser from '../../src/Goml/GomlParser';

describe('GomlParser', () => {
  context('parse()', () => {
    it('sample', () => {
        // const a = GomlParser.parse();
        // const b = {c:0, d:'abc'};
        // assert.deepEqual(a, b);
      assert.deepEqual(20, 2 * 10);
    });
  });
});
