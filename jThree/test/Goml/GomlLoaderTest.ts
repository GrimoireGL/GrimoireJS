import chai = require('chai');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;

describe('sample', () => {
  describe('sample', () => {
    it('sample', () => {
      expect(2 * 10).to.equal(20);
    });
  });
});
