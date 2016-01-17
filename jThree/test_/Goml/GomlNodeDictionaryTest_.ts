/// <reference path="../../src/refs/bundle.ts" />

import PA = require('power-assert');
const assert = PA.default;

import sinon = require('sinon');

import GomlNodeDictionary = require('../../src/Goml/GomlNodeDictionary');
import TreeNodeBase = require('../../src/Goml/TreeNodeBase');
import GomlTreeNodeBase = require('../../src/Goml/GomlTreeNodeBase');

describe('GomlNodeDictionary', () => {
  it('mount, addNode, getNode', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    node1.Mounted = true;
    gnd.addNode('group1', 'node1', <GomlTreeNodeBase>node1);
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount == 1);
  });

  it('addNode, mount, getNode', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    gnd.addNode('group1', 'node1', <GomlTreeNodeBase>node1);
    node1.Mounted = true;
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount == 1);
  });

  it('addNode, getNode, mount', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    gnd.addNode('group1', 'node1', <GomlTreeNodeBase>node1);
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
    gnd.addNode('group1', 'node1', <GomlTreeNodeBase>node1);
    node1.Mounted = true;
    assert(callbackfn.lastCall.args[0] === node1);
    assert(callbackfn.callCount === 2);
  });

  it('add same Node to defferent name', () => {
    const gnd = new GomlNodeDictionary();
    const node1 = new TreeNodeBase();
    const callbackfn = sinon.spy();
    node1.Mounted = true;
    gnd.addNode('group1', 'node1', <GomlTreeNodeBase>node1);
    gnd.getNode('group1', 'node1', callbackfn);
    assert(callbackfn.lastCall.args[0] == node1);
    gnd.addNode('group1', 'node2', <GomlTreeNodeBase>node1);
    assert(callbackfn.lastCall.args[0] === null);
    assert(callbackfn.callCount == 2);
  });
});
