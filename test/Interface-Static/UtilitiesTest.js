import test from 'ava';
import sinon from 'sinon';

import Utilities from '../../lib/Interface/Static/Utilities';

import J3Object from '../../lib/Interface/J3Object';
class GomlTreeNodeBaseMock {}
J3Object.__Rewire__('GomlTreeNodeBase', GomlTreeNodeBaseMock);

test('(each) itelate plain array and test call count', (t) => {
  const object = [1, 2, 3, 4, 5];
  const result = 5;
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.callCount === result);
});

test('(each) itelate plain object and test call count', (t) => {
  const object = {a: 0, b: 1, c: 2, d: 3, e: 4};
  const result = 5;
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.callCount === result);
});

test('(each) J3Object object and test call count', (t) => {
  const object = new J3Object([
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
  ]);
  const result = 5;
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.callCount === result);
});

test('(each) itelate plain array and test the callback function argument for each times', (t) => {
  const object = [1, 2, 3, 4, 5];
  const result = 5;
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.callCount === result);
});
