import chai = require('chai');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import Jsdom = require('jsdom');
chai.use(sinonChai);

var expect = chai.expect;

describe('GomlLoader', () => {
  describe('loadScriptTag', () => {

    before(() =>{
    });

    beforeEach(() => {
    });

    it('10 * 2 should be 20', () => {
      expect(10 * 2).to.equal(20);
    });
  });
});
