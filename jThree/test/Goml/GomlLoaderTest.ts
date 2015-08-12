// import chai = require('chai');
// import sinon = require('sinon');
// import sinonChai = require('sinon-chai');
// import Jsdom = require('jsdom');
// chai.use(sinonChai);

// var expect = chai.expect;

// import GomlLoader = require('../../src/Goml/GomlLoader');

// describe('GomlLoader', () => {
//   describe('loadScriptTag', () => {
//     var instance = null;

//     before(() =>{
//     });

//     beforeEach(() => {
//       global['document'] = Jsdom.jsdom('<html><body><script></script></body></html>');
//       global['window'] = global['document'].defaultView;
//       global['navigator'] = global['window'].navigator;
//       instance = new GomlLoader();
//     });

//     it('should return goml source string when jQuery object which has src attribute is given', () => {
//       var mock = $('<script type=\'text/goml\'>{{goml}}</script>');
//       var stub = sinon.stub(instance, 'scriptLoaded');
//       stub.withArgs('{{goml}}').returns(true);
//       expect(instance.loadScriptTag(mock)).to.equal(true);
//     });
//   });
// });
