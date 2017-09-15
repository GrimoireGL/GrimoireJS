import "../AsyncSupport";
import "../XMLDomInit";
import xmldom from "xmldom";
import test from "ava";
import sinon from "sinon";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import Constants from "../../src/Base/Constants";
import Component from "../../src/Core/Component";
import GomlParser from "../../src/Core/GomlParser";
import GomlLoader from "../../src/Core/GomlLoader";
import NSIdentity from "../../src/Base/NSIdentity";
import Namespace from "../../src/Base/Namespace";
import GomlNode from "../../src/Core/GomlNode";

declare namespace global {
  let Node: any;
  let document: any;
}

global.Node = {
  ELEMENT_NODE: 1
};
global.document = new DOMParser().parseFromString("<html></html>", "text/html");


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
  const dec = GrimoireInterface.registerComponent({
    componentName: "Name",
    attributes: {
      attr: { converter: "String", default: "aaa" }
    }
  });
  t.truthy(dec.attributes["attr"].default === "aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === l + 1);
  t.throws(() => {
    GrimoireInterface.registerComponent({
      componentName: "Name",
      attributes: {
        attr: { converter: "String", default: undefined }
      }
    });
  });

  class Hoo {
    public static componentName = "Name";
    public static attributes = {

    };
  }
  t.throws(() => {
    GrimoireInterface.registerComponent(Hoo); // because not extends Component.
  });
});

test("registerComponent by object works correctly", async (t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  GrimoireInterface.registerComponent({
    componentName: "Aaa",
    attributes: {
      testValue: {
        converter: "String",
        default: "bbb"
      },
      testOverride: {
        converter: "String",
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
  t.truthy(aaa.isDependenyResolved); // because no inherits.
  const aaa2 = aaa.generateInstance();
  const aaa22 = aaa.generateInstance();
  t.truthy(aaa2 instanceof Component);
  t.truthy(aaa2.attributes.get("testValue"));
  t.truthy(aaa2.enabled);
  t.truthy(aaa22.enabled);
  aaa2.enabled = false;
  t.truthy(!aaa2.enabled);
  t.truthy(aaa22.enabled);
  (aaa2 as any).$test();
  t.truthy((aaa2 as any).hoge === 1);
  t.truthy((aaa22 as any).hoge === 0);
  GrimoireInterface.registerComponent({
    componentName: "Bbb",
    attributes: {
      testValue2: {
        converter: "String",
        default: "ccc"
      },
      testOverride: {
        converter: "String",
        default: "ccc"
      }
    },
    $test2: function() {
      // do nothing.
    }
  }, "Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 2);
  const bbb = GrimoireInterface.componentDeclarations.get("Bbb");

  t.truthy(!bbb.isDependenyResolved); // because bbb is inherits Aaa.
  await GrimoireInterface.resolvePlugins();
  t.truthy(bbb.isDependenyResolved);

  t.truthy(bbb.attributes.testValue); // from Aaa
  t.truthy(bbb.attributes.testValue2); // from Bbb
  t.truthy(bbb.attributes.testOverride.default === "ccc"); // override attribute with inherits correctly.

  const bbb2 = bbb.generateInstance();
  t.truthy(bbb2.attributes.get("testValue")); // inherits attr from Aaa
  t.truthy(bbb2.attributes.get("testValue2")); // attr defined by Bbb
  t.truthy((bbb2 as any).$test);
  t.truthy((bbb2 as any).$test2);
});
test("registerComponent by class works correctly", async (t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;

  class Aaa extends Component {
    public static componentName = "Aaa";
    public static attributes = {
      testValue: {
        converter: "String",
        default: "bbb"
      },
      testOverride: {
        converter: "String",
        default: "bbb"
      }
    };
    public hoge = 0;
    public $test() {
      this.hoge += 1;
    }
    public overridedFunc() {
      return this.hoge;
    }
  }
  class Bbb extends Component {
    public static componentName = "Bbb";
    public static attributes = {
      testValue2: {
        converter: "String",
        default: "ccc"
      },
      testOverride: {
        converter: "String",
        default: "ccc"
      }
    };
    public fuga = 7;
    public $test2() {
      return this.fuga;
    }
    public overridedFunc() {
      return this.$test2();
    }
  }

  GrimoireInterface.registerComponent(Aaa);
  const aaa = GrimoireInterface.componentDeclarations.get("Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 1);
  t.truthy(aaa.attributes.testValue);
  t.truthy(aaa.isDependenyResolved); // because no inherits.
  const aaa2 = aaa.generateInstance();
  const aaa22 = aaa.generateInstance();
  t.truthy(aaa2 instanceof Component);
  t.truthy(aaa2.attributes.get("testValue"));
  t.truthy(aaa2.enabled);
  t.truthy(aaa22.enabled);
  aaa2.enabled = false;
  t.truthy(!aaa2.enabled);
  t.truthy(aaa22.enabled);
  (aaa2 as any).$test();
  t.truthy((aaa2 as any).hoge === 1);
  t.truthy((aaa22 as any).hoge === 0);

  GrimoireInterface.registerComponent(Bbb, "Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 2);
  const bbb = GrimoireInterface.componentDeclarations.get("Bbb");

  t.truthy(!bbb.isDependenyResolved);
  await GrimoireInterface.resolvePlugins();
  t.truthy(bbb.isDependenyResolved);

  const bbb2 = bbb.generateInstance();
  t.truthy(bbb2.attributes.get("testValue"));
  t.truthy(bbb2.attributes.get("testValue2"));
  t.truthy(bbb2.attributes.get("testOverride"));
  t.truthy(bbb.attributes.testValue);
  t.truthy(bbb.attributes.testValue2);
  t.truthy(bbb.attributes.testOverride.default === "ccc");
  t.truthy((bbb2 as any).$test);
  t.truthy((bbb2 as any).$test2);
  t.truthy((bbb2 as any).fuga === 7);
  t.truthy((bbb2 as any).hoge === 0);
  (bbb2 as any).$test();
  t.truthy((bbb2 as any).hoge === 1);

  t.truthy((bbb2 as any).overridedFunc() === 7);
});
test("registerComponent works correctly4", async (t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  class Aaa extends Component {
    public static componentName = "Aaa";
    public static attributes: { [key: string]: any } = {
      testValue: {
        converter: "String",
        default: "bbb"
      },
      testOverride: {
        converter: "String",
        default: "bbb"
      }
    };
    public hoge = 0;
    public $test() {
      this.hoge += 1;
    }
  }
  class Bbb2 extends Aaa {
    public static componentName = "Bbb";
    public static attributes = {
      testValue2: {
        converter: "String",
        default: "bbb"
      },
      testOverride: {
        converter: "String",
        default: "ccc"
      }
    };
    public fuga = 7;
    public $test2() {
      // do nothing.
    }
  }
  GrimoireInterface.registerComponent(Aaa);

  const aaa = GrimoireInterface.componentDeclarations.get("Aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 1);
  t.truthy(aaa.attributes.testValue);
  t.truthy(aaa.isDependenyResolved); // because no inherits.
  const aaa2 = aaa.generateInstance();
  const aaa22 = aaa.generateInstance();
  t.truthy(aaa2 instanceof Component);
  t.truthy(aaa2.attributes.get("testValue"));
  t.truthy(aaa2.enabled);
  t.truthy(aaa22.enabled);
  aaa2.enabled = false;
  t.truthy(!aaa2.enabled);
  t.truthy(aaa22.enabled);
  (aaa2 as any).$test();
  t.truthy((aaa2 as any).hoge === 1);
  t.truthy((aaa22 as any).hoge === 0);

  GrimoireInterface.registerComponent(Bbb2);
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === defaultComponentCount + 2);
  const bbb = GrimoireInterface.componentDeclarations.get("Bbb");
  await GrimoireInterface.resolvePlugins();
  t.truthy(aaa.isDependenyResolved);
  t.truthy(bbb.isDependenyResolved);
  const bbb2 = bbb.generateInstance();
  t.truthy(bbb2.attributes.get("testValue"));
  t.truthy(bbb.attributes.testValue);
  t.truthy(bbb.attributes.testValue2);
  t.truthy(bbb.attributes.testOverride.default === "ccc");
  t.truthy((bbb2 as any).$test);
  t.truthy((bbb2 as any).$test2);
  t.truthy((bbb2 as any).fuga === 7);
  t.truthy((bbb2 as any).hoge === 0);
  (bbb2 as any).$test();
  t.truthy((bbb2 as any).hoge === 1);
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
  GrimoireInterface.registerComponent({ componentName: "Aaa", attributes: {} });
  GrimoireInterface.registerNode("node");
  t.throws(() => {
    GrimoireInterface.registerComponent({} as any);
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
