import "../AsyncSupport";
import "../XMLDomInit";
import xmldom from "xmldom";
import test from "ava";
import sinon from "sinon";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import Constants from "../../src/Base/Constants";
import Component from "../../src/Node/Component";
import GomlParser from "../../src/Node/GomlParser";
import GomlLoader from "../../src/Node/GomlLoader";
import NSIdentity from "../../src/Base/NSIdentity";
import Namespace from "../../src/Base/Namespace";
import GomlNode from "../../src/Node/GomlNode";

global["Node"] = {
  ELEMENT_NODE: 1
};


test.beforeEach(() => {
  GrimoireInterface.clear();
  GrimoireInterface.resolvePlugins();
});

test("ns method should generate namespace generating function correctly", (t) => {
  const g = Namespace.define("grimoire");
  t.truthy(g.for("test").fqn === "grimoire.test");
});

test("registerComponent works correctly", (t) => {
  const l = GrimoireInterface.componentDeclarations.toArray().length;
  const dec = GrimoireInterface.registerComponent("Name", {
    attributes: {
      attr: { converter: "String", default: "aaa" }
    }
  });
  t.truthy(dec.attributes["attr"].default === "aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === l + 1);
  t.throws(() => {
    GrimoireInterface.registerComponent("Name", {
      attributes: {
        attr: { converter: "String", default: undefined }
      }
    });
  });
});

test("registerComponent works correctly2", async (t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  GrimoireInterface.registerComponent("Aaa", {
    attributes: {
      testValue: {
        converter: "stringConverter",
        default: "bbb"
      }
    },
    hoge: 0,
    $test: function() {
      this.hoge += 1;
    }
  });

  const aaa = GrimoireInterface.componentDeclarations.get("Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 1);
  t.truthy(aaa.attributes.testValue);
  t.truthy(aaa.resolvedDependency); // because no inherits.
  const aaa2 = new aaa.ctor() as any;
  const aaa22 = new aaa.ctor() as any;
  t.truthy(aaa2 instanceof Component);
  t.truthy(aaa2.attributes.testValue);
  t.truthy(aaa2.enabled);
  t.truthy(aaa22.enabled);
  aaa2.enabled = false;
  t.truthy(!aaa2.enabled);
  t.truthy(aaa22.enabled);
  aaa2.$test();
  t.truthy(aaa2.hoge === 1);
  t.truthy(aaa22.hoge === 0);
  GrimoireInterface.registerComponent("Bbb", {
    attributes: {
      testValue2: {
        converter: "stringConverter",
        default: "ccc"
      }
    },
    $test2: function() {
      // do nothing.
    }
  }, "Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 2);
  const bbb = GrimoireInterface.componentDeclarations.get("Bbb");
  await GrimoireInterface.resolvePlugins();
  t.truthy(aaa.resolvedDependency);
  t.truthy(bbb.resolvedDependency);
  const bbb2 = new bbb.ctor() as any;
  t.truthy(bbb2.attributes.testValue);
  t.truthy(bbb2.attributes.testValue2);
  t.truthy(bbb.attributes.testValue);
  t.truthy(bbb.attributes.testValue2);
  t.truthy(bbb2.$test);
  t.truthy(bbb2.$test2);
});
test("registerNode/Component works correctly.", async t => {
  GrimoireInterface.registerNode("a1");
  GrimoireInterface.registerNode("a2", ["Hoge"]);
  GrimoireInterface.registerNode("a3", [], { hoge: 7 }, "a2");
  GrimoireInterface.registerComponent("Hoge", {
    attributes: {
      hoge: {
        converter: "Number",
        default: 9
      }
    }
  });
  await GrimoireInterface.resolvePlugins();
  let a1 = GrimoireInterface.nodeDeclarations.get("a1");
  let a2 = GrimoireInterface.nodeDeclarations.get("a2");
  let a3 = GrimoireInterface.nodeDeclarations.get("a3");
  t.truthy(a1.defaultComponentsActual.toArray().length === 1); // grimoireCompone
  t.truthy(a2.defaultComponentsActual.toArray().length === 2); // grimoireCompone
  t.truthy(a3.defaultComponentsActual.toArray().length === 2); // grimoireCompone

  // console.log(a2.idResolver)
  t.truthy(a2.idResolver.resolve(Namespace.define("hoge")) === "grimoirejs.Hoge.hoge");
  t.truthy(a3.idResolver.resolve(Namespace.define("hoge")) === "grimoirejs.Hoge.hoge");
});
test("throw error on attempt registerComponent/Node by duplicate name.", t => {
  GrimoireInterface.registerComponent("Aaa", { attributes: {} });
  GrimoireInterface.registerNode("node");
  t.throws(() => {
    GrimoireInterface.registerComponent("Aaa", {});
  });
  t.throws(() => {
    GrimoireInterface.registerNode("node");
  });
});

test("register and resolvePlugins works preperly", async () => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const wrapPromise: any = function(spy) {
    return () => {
      return new Promise(resolve => {
        spy();
        resolve(null);
      });
    };
  };
  const spyp = wrapPromise(spy1);
  const spyp2 = wrapPromise(spy2);
  GrimoireInterface.register(spyp);
  GrimoireInterface.register(spyp2);
  await GrimoireInterface.resolvePlugins();
  sinon.assert.callOrder(spy1, spy2);
});
