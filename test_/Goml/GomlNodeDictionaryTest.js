import test from 'ava';
import sinon from 'sinon';

import GomlNodeDictionary from '../../lib-es5/Goml/GomlNodeDictionary';
import TreeNodeBase from '../../lib-es5/Goml/TreeNodeBase';

test('mount, addNode, getNode', (t) => {
  const gnd = new GomlNodeDictionary();
  const node1 = new TreeNodeBase();
  const callbackfn = sinon.spy();
  node1.Mounted = true;
  gnd.addNode('group1', 'node1', node1);
  gnd.getNode('group1', 'node1', callbackfn);
  t.truthy(callbackfn.lastCall.args[0] === node1);
  t.truthy(callbackfn.callCount === 1);
});

test('addNode, mount, getNode', (t) => {
  const gnd = new GomlNodeDictionary();
  const node1 = new TreeNodeBase();
  const callbackfn = sinon.spy();
  gnd.addNode('group1', 'node1', node1);
  node1.Mounted = true;
  gnd.getNode('group1', 'node1', callbackfn);
  t.truthy(callbackfn.lastCall.args[0] === node1);
  t.truthy(callbackfn.callCount === 1);
});

test('addNode, getNode, mount', (t) => {
  const gnd = new GomlNodeDictionary();
  const node1 = new TreeNodeBase();
  const callbackfn = sinon.spy();
  gnd.addNode('group1', 'node1', node1);
  gnd.getNode('group1', 'node1', callbackfn);
  t.truthy(callbackfn.lastCall.args[0] === null);
  node1.Mounted = true;
  t.truthy(callbackfn.lastCall.args[0] === node1);
  t.truthy(callbackfn.callCount === 2);
});

test('getNode, addNode, mount', (t) => {
  const gnd = new GomlNodeDictionary();
  const node1 = new TreeNodeBase();
  const callbackfn = sinon.spy();
  gnd.getNode('group1', 'node1', callbackfn);
  t.truthy(callbackfn.lastCall.args[0] === null);
  gnd.addNode('group1', 'node1', node1);
  node1.Mounted = true;
  t.truthy(callbackfn.lastCall.args[0] === node1);
  t.truthy(callbackfn.callCount === 2);
});

test('add same Node to defferent name', (t) => {
  const gnd = new GomlNodeDictionary();
  const node1 = new TreeNodeBase();
  const callbackfn = sinon.spy();
  node1.Mounted = true;
  gnd.addNode('group1', 'node1', node1);
  gnd.getNode('group1', 'node1', callbackfn);
  t.truthy(callbackfn.lastCall.args[0] === node1);
  gnd.addNode('group1', 'node2', node1);
  t.truthy(callbackfn.lastCall.args[0] === null);
  t.truthy(callbackfn.callCount === 2);
});
