import test from "ava";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

test.beforeEach(async() => {
  GrimoireInterface.clear();
});

test("component poperties should be initialized correctly", (t) => {
  GrimoireInterface.registerComponent({
    componentName: "Super",
    attributes: {
      superAttr1: {
        converter: "String",
        default: "hoge",
      },
      overrideAttr1: {
        converter: "String",
        default: "super",
      },
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "Hoge",
    attributes: {
      attr1: {
        converter: "String",
        default: "hoge",
      },
      overrideAttr1: {
        converter: "String",
        default: "hoge",
      },
    },
  }, "Super");
  const superComponentDec = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponentDec = GrimoireInterface.componentDeclarations.get("Hoge");

  const superComponent = superComponentDec.generateInstance();
  const hogeComponent = hogeComponentDec.generateInstance();

  t.truthy(hogeComponent.identity.fqn === "grimoirejs.Hoge");
  t.truthy(superComponent.identity.fqn === "grimoirejs.Super");
  t.truthy(hogeComponent.node === superComponent.node);
  t.truthy(hogeComponent.identity.fqn === "grimoirejs.Hoge");
  t.truthy(!hogeComponent.disposed);
  t.truthy(!superComponent.disposed);
});

test("get/set attribute should works correctly", (t) => {
  GrimoireInterface.registerComponent({
    componentName: "Super",
    attributes: {
      superAttr1: {
        converter: "String",
        default: "hoge",
      },
      overrideAttr1: {
        converter: "String",
        default: "super",
      },
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "Hoge",
    attributes: {
      attr1: {
        converter: "String",
        default: "hoge",
      },
      overrideAttr1: {
        converter: "String",
        default: "hoge",
      },
    },
  }, "Super");
  const superComponentDec = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponentDec = GrimoireInterface.componentDeclarations.get("Hoge");

  const superComponent = superComponentDec.generateInstance();
  const hogeComponent = hogeComponentDec.generateInstance();

  t.truthy(!hogeComponent.getAttributeRaw("notfound", false));
  t.throws(() => {
    hogeComponent.getAttributeRaw("notfound");
  });
  t.truthy(hogeComponent.getAttributeRaw("attr1"));
  t.truthy(hogeComponent.getAttributeRaw("grimoirejs.Hoge.attr1"));
  t.truthy(hogeComponent.getAttributeRaw("grimoirejs.attr1"));
  t.truthy(hogeComponent.getAttributeRaw("_grimoirejs.Hoge.attr1"));
  t.throws(() => {
    hogeComponent.getAttributeRaw("_grimoirejs.attr1");
  });
  t.truthy(hogeComponent.getAttributeRaw("Hoge.attr1"));

  hogeComponent.setAttribute("attr1", "some value");
  t.truthy(hogeComponent.getAttribute("attr1") === "some value");
  t.throws(() => {
    hogeComponent.setAttribute("notfound", "some value");
  });
});

test("get/set attribute should works correctly", (t) => {
  const fugaConverterDec = {
    name: "FugaConverter",
    convert(val): number {
      return 123;
    },
  };
  const hogeComponentDec = {
    componentName: "Hoge",
    attributes: {
      attr1: {
        converter: fugaConverterDec,
        default: "hoge",
      },
    },
  };
  GrimoireInterface.registerConverter(fugaConverterDec);
  GrimoireInterface.registerComponent(hogeComponentDec);

  const hogeComponent = GrimoireInterface.componentDeclarations.get("Hoge").generateInstance();

  t.truthy(hogeComponent.getAttributeRaw(hogeComponentDec.attributes.attr1));
  hogeComponent.setAttribute("attr1", "some value");
  t.truthy(hogeComponent.getAttribute(hogeComponentDec.attributes.attr1) === 123);

  const otherConverterDec = {
    name: "FugaConverter",
    convert(val): number {
      return 123;
    },
  };

  t.throws(() => {
    hogeComponent.getAttribute({
      converter: otherConverterDec,
      default: "hoge",
    });
  }, null, "get attribute throw if differet object reference.");
});
