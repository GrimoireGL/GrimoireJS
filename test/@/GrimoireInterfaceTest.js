import '../RRSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import test from 'ava';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface";
import Constants from "../../lib-es5/Core/Base/Constants";
import Component from "../../lib-es5/Core/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Core/Node/GomlParser";
import GomlLoader from "../../lib-es5/Core/Node/GomlLoader";
import NamespacedIdentity from "../../lib-es5/Core/Base/NamespacedIdentity"

global.Node = {
  ELEMENT_NODE: 1
};


test.beforeEach(() => {
  GrimoireInterface.clear();
});

test('ns method should generate namespace generating function correctly', (t) => {
  const g = GrimoireInterface.ns('http://grimoire.gl/ns/2');
  t.truthy(g("test").fqn === "TEST|HTTP://GRIMOIRE.GL/NS/2");
});

test('_ensureTobeComponentConstructor works correctly', (t) => {
  // passing plain object
  const testSpy = sinon.spy();
  const baseObject = {
    test: testSpy
  };
  const i = GrimoireInterface._ensureTobeComponentConstructor(baseObject);
  const io = (new i());
  t.truthy(i.prototype instanceof Component);
  t.truthy(io instanceof Component);
  io.test();
  t.truthy(testSpy.calledWith());
  // passing undefined return raw component
  const raw = GrimoireInterface._ensureTobeComponentConstructor(void 0);
  t.truthy(raw === Component);
  // passing constructor not extending Component should throw exception
  const rawConstructor = () => {
    return;
  };
  t.throws(() => {
    GrimoireInterface._ensureTobeComponentConstructor(rawConstructor);
  });
  // passing a constructor extending Component should return the variable same as argument
  t.truthy(Component === GrimoireInterface._ensureTobeComponentConstructor(Component));
});

test('addRootNode/getRootNode/queryRootNodes works correctly', async(t) => {
  const window = await jsdomAsync(require("./_TestResource/GrimoireInterfaceTest_Case1.html"));
  const scriptTag = window.document.getElementById("test");
  const dummyRootNode = {
    id: "TEST"
  };

  const id = GrimoireInterface.addRootNode(scriptTag, dummyRootNode);
  t.truthy(GrimoireInterface.rootNodes[id] === dummyRootNode);
  t.truthy(id === scriptTag.getAttribute("x-rootNodeId"));
  t.truthy(dummyRootNode === GrimoireInterface.getRootNode(scriptTag));
  global.document = window.document;
  const queriedNode = GrimoireInterface.queryRootNodes("script");
  t.truthy(queriedNode.length === 1);
  t.truthy(queriedNode[0] === dummyRootNode);
});

test('register and resolvePlugins works preperly', async(t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const wrapPromise = function(spy) {
    return () => {
      return new Promise((resolve) => {
        spy();
        resolve();
      });
    }
  };
  const spyp = wrapPromise(spy1);
  const spyp2 = wrapPromise(spy2);
  GrimoireInterface.register(spyp);
  GrimoireInterface.register(spyp2);
  await GrimoireInterface.resolvePlugins();
  sinon.assert.callOrder(spy1, spy2);
});

test('function interface works correctly', async(t) => {
  GrimoireInterface.registerNode("goml");
  const window = await jsdomAsync(require("./_TestResource/GrimoireInterfaceTest_Case1.html"));

  global.document = window.document;
  global.window = window;
  const scriptTag = window.document.getElementById("test");
  window.document.__proto__.querySelectorAll = (query)=>{
    if("#test"){
      return ""
    }
    return ""
  };
  await GomlLoader.loadFromScriptTag(scriptTag);
  
  const gi = GrimoireInterface("#test");
  const nodeInterface = gi("#testId1");
  nodeInterface.forEach((node) => { console.log("foreach"); })
    // t.truthy(GrimoireInterface.rootNodes[id] === rootNode);
    // t.truthy(id === scriptTag.getAttributeNS(Constants.defaultNamespace, "rootNodeId"));
    // t.truthy(dummyRootNode === GrimoireInterface.getRootNode(scriptTag));
    // global.document = window.document;
    // const queriedNode = GrimoireInterface.queryRootNodes("script");
    // t.truthy(queriedNode.length === 1);
    // t.truthy(queriedNode[0] === dummyRootNode);
})
