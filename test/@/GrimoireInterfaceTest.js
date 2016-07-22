import test from 'ava';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface";
import Component from "../../lib-es5/Core/Node/Component";

test('ns method should generate namespace generating function correctly',(t)=>{
  const g = GrimoireInterface.ns('http://grimoire.gl/ns/2');
  t.truthy(g("test").fqn === "TEST|HTTP://GRIMOIRE.GL/NS/2");
});

test('_ensureTobeComponentConstructor should return valid component constructor',(t)=>{
  const testSpy = sinon.spy();
  const baseObject = {
    test:testSpy
  };
  const i = GrimoireInterface._ensureTobeComponentConstructor(baseObject);
  const io = (new i());
  t.truthy(i.prototype instanceof Component);
  t.truthy(io instanceof Component);
  io.test();
  t.truthy(testSpy.calledWith());
});
