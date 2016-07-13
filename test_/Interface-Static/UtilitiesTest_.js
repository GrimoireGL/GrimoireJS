import test from 'ava';
import sinon from 'sinon';

import Utilities from '../../lib-es5/Interface/Static/Utilities';

import J3Object from '../../lib-es5/Interface/J3Object';
class GomlTreeNodeBaseMock {}
J3Object.__Rewire__('GomlTreeNodeBase', GomlTreeNodeBaseMock);

test('(each) itelate plain array and test call count', (t) => {
  const object = [0, 1, 2, 3, 4];
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
  const object = [0, 1, 2, 3, 4];
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.getCall(0).args[0] === 0 && callbackfn.getCall(0).args[1] === 0);
  t.ok(callbackfn.getCall(1).args[0] === 1 && callbackfn.getCall(1).args[1] === 1);
  t.ok(callbackfn.getCall(2).args[0] === 2 && callbackfn.getCall(2).args[1] === 2);
  t.ok(callbackfn.getCall(3).args[0] === 3 && callbackfn.getCall(3).args[1] === 3);
  t.ok(callbackfn.getCall(4).args[0] === 4 && callbackfn.getCall(4).args[1] === 4);
});

test('(each) itelate plain object and test the callback function argument for each times', (t) => {
  const object = {a: 0, b: 1, c: 2, d: 3, e: 4};
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.getCall(0).args[0] === 'a' && callbackfn.getCall(0).args[1] === 0);
  t.ok(callbackfn.getCall(1).args[0] === 'b' && callbackfn.getCall(1).args[1] === 1);
  t.ok(callbackfn.getCall(2).args[0] === 'c' && callbackfn.getCall(2).args[1] === 2);
  t.ok(callbackfn.getCall(3).args[0] === 'd' && callbackfn.getCall(3).args[1] === 3);
  t.ok(callbackfn.getCall(4).args[0] === 'e' && callbackfn.getCall(4).args[1] === 4);
});

test('(each) itelate J3Object object and test the callback function argument for each times', (t) => {
  const object = new J3Object([
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
  ]);
  const callbackfn = sinon.spy();
  Utilities.each(object, callbackfn);
  t.ok(callbackfn.getCall(0).args[0] === 0 && callbackfn.getCall(0).args[1] === object[0]);
  t.ok(callbackfn.getCall(1).args[0] === 1 && callbackfn.getCall(1).args[1] === object[1]);
  t.ok(callbackfn.getCall(2).args[0] === 2 && callbackfn.getCall(2).args[1] === object[2]);
  t.ok(callbackfn.getCall(3).args[0] === 3 && callbackfn.getCall(3).args[1] === object[3]);
  t.ok(callbackfn.getCall(4).args[0] === 4 && callbackfn.getCall(4).args[1] === object[4]);
});

test('(each) itelate plain array and test break loop in callback function', (t) => {
  const object = [0, 1, 2, 3, 4];
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(i, v) {
    spy1();
    if (i === 2) {
      return false;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 3);
  t.ok(spy2.callCount === 2);
});

test('(each) itelate plain object and test break loop in callback function', (t) => {
  const object = {a: 0, b: 1, c: 2, d: 3, e: 4};
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(k, v) {
    spy1();
    if (k === 'c') {
      return false;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 3);
  t.ok(spy2.callCount === 2);
});

test('(each) itelate J3Object object and test break loop in callback function', (t) => {
  const object = new J3Object([
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
  ]);
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(i, v) {
    spy1();
    if (i === 2) {
      return false;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 3);
  t.ok(spy2.callCount === 2);
});

test('(each) itelate plain array and test continue loop in callback function', (t) => {
  const object = [0, 1, 2, 3, 4];
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(i, v) {
    spy1();
    if (i === 2) {
      return true;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 5);
  t.ok(spy2.callCount === 4);
});

test('(each) itelate plain object and test continue loop in callback function', (t) => {
  const object = {a: 0, b: 1, c: 2, d: 3, e: 4};
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(k, v) {
    spy1();
    if (k === 'c') {
      return true;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 5);
  t.ok(spy2.callCount === 4);
});

test('(each) itelate J3Object object and test continue loop in callback function', (t) => {
  const object = new J3Object([
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
  ]);
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  function callbackfn(i, v) {
    spy1();
    if (i === 2) {
      return true;
    }
    spy2();
  }
  Utilities.each(object, callbackfn);
  t.ok(spy1.callCount === 5);
  t.ok(spy2.callCount === 4);
});

const TestException = {};

test('(each) itelate plain array and test exceptions inside loop in callback function', (t) => {
  const object = [0, 1, 2, 3, 4];
  const callbackfn = sinon.stub();
  callbackfn.withArgs(2, 2).throws(TestException);
  const spy = sinon.spy(Utilities.each);
  try {
    spy(object, callbackfn);
  } catch (e) {}
  t.ok(spy.threw(TestException));
});

test('(each) itelate plain object and test exceptions inside loop in callback function', (t) => {
  const object = {a: 0, b: 1, c: 2, d: 3, e: 4};
  const callbackfn = sinon.stub();
  callbackfn.withArgs('c', 2).throws(TestException);
  const spy = sinon.spy(Utilities.each);
  try {
    spy(object, callbackfn);
  } catch (e) {}
  t.ok(spy.threw(TestException));
});

test('(each) itelate J3Object object and test exceptions inside loop in callback function', (t) => {
  const object = new J3Object([
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
    new GomlTreeNodeBaseMock(),
  ]);
  const callbackfn = sinon.stub();
  callbackfn.withArgs(2, object[2]).throws(TestException);
  const spy = sinon.spy(Utilities.each);
  try {
    spy(object, callbackfn);
  } catch (e) {}
  t.ok(spy.threw(TestException));
});
