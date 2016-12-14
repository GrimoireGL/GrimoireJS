import '../AsyncSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import test from 'ava';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/GrimoireInterface";
import Constants from "../../lib-es5/Base/Constants";
import Component from "../../lib-es5/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Node/GomlParser";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import NSIdentity from "../../lib-es5/Base/NSIdentity";
import GomlNode from "../../lib-es5/Node/GomlNode";
global.Node = {
  ELEMENT_NODE: 1
};


test.beforeEach(() => {
  GrimoireInterface.clear();
});

test('ns method should generate namespace generating function correctly', (t) => {
  const g = GrimoireInterface.ns('http://grimoire.gl/ns/2');
  t.truthy(g("test").fqn === "test|HTTP://GRIMOIRE.GL/NS/2");
});

test('_ensureNameTobeConstructor is works correctly', (t) => {
  GrimoireInterface.registerComponent("aaa", {
    attributes: {
      testValue: {
        converter: "stringConverter",
        default: "bbb"
      }
    }
  });
  const ctor = GrimoireInterface._ensureNameTobeConstructor("aaa");
  t.truthy(ctor.attributes.testValue);
})

test('registerComponent works correctly', (t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  GrimoireInterface.registerComponent("aaa", {
    attributes: {
      testValue: {
        converter: "stringConverter",
        default: "bbb"
      }
    },
    $test: function () {
      //do nothing.
    }
  });
  const aaa = GrimoireInterface.componentDeclarations.get("aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 1);
  t.truthy(aaa.attributes.testValue);
  GrimoireInterface.registerComponent("bbb", {
    attributes: {
      testValue2: {
        converter: "stringConverter",
        default: "ccc"
      }
    },
    $test2: function () {
      //do nothing.
    }
  }, "aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 2);
  const bbb = GrimoireInterface.componentDeclarations.get("bbb");
  t.truthy(bbb.attributes.testValue);
  t.truthy(bbb.attributes.testValue2);
  t.truthy(bbb.ctor);
  const bbbo = new bbb.ctor();
  t.truthy(bbbo.$test);
  t.truthy(bbbo.$test2);
});
test('throw error on attempt registerComponent/Node by duplicate name.', t => {
  GrimoireInterface.registerComponent("aaa", {});
  GrimoireInterface.registerNode("node");
  t.throws(() => {
    GrimoireInterface.registerComponent("aaa", {});
  });
  t.throws(() => {
    GrimoireInterface.registerNode("node");
  });
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

// test('addRootNode/getRootNode/queryRootNodes works correctly', async(t) => {
//   const window = await jsdomAsync(require("./_TestResource/GrimoireInterfaceTest_Case1.html"));
//   global.document = window.document;
//   GrimoireInterface.registerNode("goml",[],{})
//   const node = await GomlLoader.loadForPage();
//   const scriptTag = window.document.getElementById("test");
//   const id = GrimoireInterface.addRootNode(scriptTag, node);
//   t.truthy(GrimoireInterface.rootNodes[id] === node);
//   t.truthy(id === scriptTag.getAttribute("x-rootNodeId"));
//   t.truthy(node === GrimoireInterface.getRootNode(scriptTag));
//   global.document = window.document;
//   const queriedNode = GrimoireInterface.queryRootNodes("script");
//   t.truthy(queriedNode.length === 1);
//   t.truthy(queriedNode[0] === node);
// });

test('register and resolvePlugins works preperly', async(t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const wrapPromise = function (spy) {
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

// test('function interface works correctly', async(t) => {
//   GrimoireInterface.registerNode("goml");
//   const window = await jsdomAsync(require("./_TestResource/GrimoireInterfaceTest_Case1.html"));
//   global.document = window.document;
//   global.window = window;
//   const scriptTag = window.document.getElementById("test");
//   // window.document.__proto__.querySelectorAll = (query) => {
//   //   if ("#test") {
//   //     return ""
//   //   }
//   //   return ""
//   // };
//   await GomlLoader.loadFromScriptTag(scriptTag);
//
//   const gi = GrimoireInterface("#test");
//   const nodeInterface = gi("#testId1");
//   //nodeInterface.forEach((node) => { console.log("foreach"); })
//   t.truthy(nodeInterface.count() === 1);
//   //t.truthy(GrimoireInterface.rootNodes[id] === rootNode);
//   // t.truthy(id === scriptTag.getAttributeNS(Constants.defaultNamespace, "rootNodeId"));
//
//   //t.truthy(GrimoireInterface.rootNodes[id] === rootNode);
//   // t.truthy(id === scriptTag.getAttributeNS(Constants.defaultNamespace, "rootNodeId"));
//   //t.truthy(dummyRootNode === GrimoireInterface.getRootNode(scriptTag));
//   // global.document = window.document;
//   // const queriedNode = GrimoireInterface.queryRootNodes("script");
//   // t.truthy(queriedNode.length === 1);
//   // t.truthy(queriedNode[0] === dummyRootNode);
// })
