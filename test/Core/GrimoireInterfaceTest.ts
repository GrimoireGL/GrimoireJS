import test from "ava";
import { assert, spy } from "sinon";
import Component from "../../src/Core/Component";
import Constants from "../../src/Core/Constants";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import Namespace from "../../src/Core/Namespace";
import fs from "../fileHelper";
import jsdomAsync from "../JsDOMAsync";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

const tc1_html = fs.readFile("../_TestResource/GrimoireInterfaceTest_Case1.html");

test.beforeEach(async() => {
  GrimoireInterface.clear();
  GrimoireInterface.resolvePlugins();
});

test("properties are initialized correctly", t => {
  t.truthy(GrimoireInterface.nodeDeclarations.toArray().length > 0); // grimoire-node-base, template,,,
  t.truthy(GrimoireInterface.converters.toArray().length > 0);
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length > 0); // GrimoireComponent and more
});

test("call as function works correctly", async t => {
  GrimoireInterface.registerNode("goml");
  GrimoireInterface.resolvePlugins();
  await TestEnvManager.loadPage(tc1_html);
  t.truthy(GrimoireInterface("*")("*").count === 3);
  t.truthy(GrimoireInterface("*")("#testId1").count === 1);
  t.truthy(GrimoireInterface("*")(".class").count === 0);
});

test("call as function works correctly", async t => {
  GrimoireInterface.registerNode("goml");
  GrimoireInterface.resolvePlugins();
  await TestEnvManager.loadPage('<html><body><script type="text/goml"><goml/></script></body></html>');
  t.truthy(GrimoireInterface("*")("*").count === 1);
  t.truthy(GrimoireInterface("*")("goml").count === 1);
});

test("call as function works correctly", async t => {
  GrimoireInterface.clear();
  GrimoireInterface.registerNode("_grimoirejs.goml");
  GrimoireInterface.resolvePlugins();
  await TestEnvManager.loadPage('<html><body><script type="text/goml"><core:goml xmlns:core="grimoirejs"/></script></body></html>');
  t.truthy(GrimoireInterface("*")("*").count === 1);
});

test("registerComponent works correctly", (t) => {
  const l = GrimoireInterface.componentDeclarations.toArray().length;
  const dec = GrimoireInterface.registerComponent({
    componentName: "Name",
    attributes: {
      attr: { converter: "String", default: "aaa" },
    },
  });
  t.truthy(dec.attributes["attr"].default === "aaa");
  t.truthy(GrimoireInterface.componentDeclarations.toArray().length === l + 1);
  t.throws(() => {
    GrimoireInterface.registerComponent({
      componentName: "Name",
      attributes: {
        attr: { converter: "String", default: undefined },
      },
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

test("registerComponent by object works correctly", async(t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  GrimoireInterface.registerComponent({
    componentName: "Aaa",
    attributes: {
      testValue: {
        converter: "String",
        default: "bbb",
      },
      testOverride: {
        converter: "String",
        default: "bbb",
      },
    },
    hoge: 0,
    $test() {
      this.hoge += 1;
    },
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
        default: "ccc",
      },
      testOverride: {
        converter: "String",
        default: "ccc",
      },
    },
    $test2() {
      // do nothing.
    },
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
test("registerComponent by class works correctly", async(t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;

  class Aaa extends Component {
    public static componentName = "Aaa";
    public static attributes = {
      testValue: {
        converter: "String",
        default: "bbb",
      },
      testOverride: {
        converter: "String",
        default: "bbb",
      },
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
        default: "ccc",
      },
      testOverride: {
        converter: "String",
        default: "ccc",
      },
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
test("registerComponent works correctly4", async(t) => {
  const defaultComponentCount = GrimoireInterface.componentDeclarations.toArray().length;
  class Aaa extends Component {
    public static componentName = "Aaa";
    public static attributes: { [key: string]: any } = {
      testValue: {
        converter: "String",
        default: "bbb",
      },
      testOverride: {
        converter: "String",
        default: "bbb",
      },
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
        default: "bbb",
      },
      testOverride: {
        converter: "String",
        default: "ccc",
      },
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
  GrimoireInterface.registerComponent({
    componentName: "Hoge",
    attributes: {
      hoge: {
        converter: "Number",
        default: 9,
      },
    },
  });
  await GrimoireInterface.resolvePlugins();
  const a1 = GrimoireInterface.nodeDeclarations.get("a1");
  const a2 = GrimoireInterface.nodeDeclarations.get("a2");
  const a3 = GrimoireInterface.nodeDeclarations.get("a3");
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

test("register and resolvePlugins works preperly", async() => {
  const spy1 = spy();
  const spy2 = spy();
  const wrapPromise: any = function(s) {
    return () => {
      return new Promise(resolve => {
        s();
        resolve(null);
      });
    };
  };
  const spyp = wrapPromise(spy1);
  const spyp2 = wrapPromise(spy2);
  GrimoireInterface.register(spyp);
  GrimoireInterface.register(spyp2);
  await GrimoireInterface.resolvePlugins();
  assert.callOrder(spy1, spy2);
});

test("assert works preperly", t => {
  GrimoireInterface.lib.plugin = {
    __NAME__: "grimoirejs-plugin",
    __VERSION__: "1.2.3",
  };
  t.notThrows(() => {
    GrimoireInterface.assertPlugin("plugin");
  });
  t.throws(() => {
    GrimoireInterface.assertPlugin("notfound");
  });

  const errorMessage = "this is an error message";
  const err = t.throws(() => {
    GrimoireInterface.assertPlugin("notfound", errorMessage);
  });
  t.truthy(err.message === errorMessage);
});

test("import works preperly", async t => {
  GrimoireInterface.lib.hoge = {
    __NAME__: "grimoirejs-hoge",
    __VERSION__: "1.2.3",
  };
  const component = {
    ComponentA: 1,
    ComponentB: 2,
    ComponentC: 3,
  };
  const converter = {
    ConverterA: 4,
    ConverterB: 5,
    ConverterC: 6,
  };
  GrimoireInterface.lib.hoge.Component = component;
  GrimoireInterface.lib.hoge.Converter = converter;
  (GrimoireInterface as any).Core = { GomlNode: 7 };

  t.truthy(GrimoireInterface.import("grimoirejs-hoge/ref/Component/ComponentA") === 1);
  t.truthy(GrimoireInterface.import("grimoirejs/ref/Core/GomlNode") === 7);
  let err = t.throws(() => {
    GrimoireInterface.import("invalidpath");
  });
  t.truthy(err.message.includes("invalid"));

  err = t.throws(() => {
    GrimoireInterface.import("notfound/ref/Component/HogeComponent");
  });
  t.truthy(err.message.includes("is not registered."));

  err = t.throws(() => {
    GrimoireInterface.import("grimoirejs-hoge/ref/notfound/ComponentA");
  });
  t.truthy(err.message.includes("not found"));

  err = t.throws(() => {
    GrimoireInterface.import("grimoirejs-hoge/ref/Component/Component");
  });
  t.truthy(err.message.includes("not found"));

  err = t.throws(() => {
    GrimoireInterface.import("grimoirejs-hoge/ref/Component/ComponentA/Component");
  });
  t.truthy(err.message.includes("not found"));

});
