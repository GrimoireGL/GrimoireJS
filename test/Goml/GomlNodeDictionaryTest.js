import assert from 'power-assert';
import sinon from 'sinon';

import GomlNodeDictionary from '../../lib/Goml/GomlNodeDictionary';
import TreeNodeBase from '../../lib/Goml/TreeNodeBase';

describe('GomlNodeDictionary', () => {
  it('mount, addNode, getNode', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    node1.Mounted = true;
    gnd.addNode('group1', 'node1', node1);
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount === 1);
  });

  it('addNode, mount, getNode', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    gnd.addNode('group1', 'node1', node1);
    node1.Mounted = true;
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount === 1);
  });

  it('addNode, getNode, mount', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    gnd.addNode('group1', 'node1', node1);
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === null);
    node1.Mounted = true;
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount === 2);
  });

  it('getNode, addNode, mount', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === null);
    gnd.addNode('group1', 'node1', node1);
    node1.Mounted = true;
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount === 2);
  });

  it('add same Node to defferent name', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    node1.Mounted = true;
    gnd.addNode('group1', 'node1', node1);
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === node1);
    gnd.addNode('group1', 'node2', node1);
    assert(callbackfn.lastCall.args[0] === null);
    assert(callbackfn.callCount === 2);
  });
});
