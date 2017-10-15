import test from "ava";
import TestEnvManager from "../TestEnvManager";
import GrimoireInterface from "../../src/Core/GrimoireInterface";

TestEnvManager.init();

test.beforeEach(async () => {
  GrimoireInterface.clear();
});

test("component poperties should be initialized correctly", (t) => {
  GrimoireInterface.registerComponent({
    componentName: "Super",
    attributes: {
      superAttr1: {
        converter: "String",
        default: "hoge"
      },
      overrideAttr1: {
        converter: "String",
        default: "super"
      }
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "Hoge",
    attributes: {
      attr1: {
        converter: "String",
        default: "hoge"
      },
      overrideAttr1: {
        converter: "String",
        default: "hoge"
      }
    },
  }, "Super");
  const superComponentDec = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponentDec = GrimoireInterface.componentDeclarations.get("Hoge");

  const superComponent = superComponentDec.generateInstance();
  const hogeComponent = hogeComponentDec.generateInstance();

  t.truthy(hogeComponent.name.fqn === "grimoirejs.Hoge");
  t.truthy(superComponent.name.fqn === "grimoirejs.Super");
  t.truthy(hogeComponent.node === superComponent.node);
  t.truthy(hogeComponent.name.fqn === "grimoirejs.Hoge");
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

  t.truthy(!hogeComponent.getAttributeRaw("notfound"));
  t.truthy(hogeComponent.getAttributeRaw("attr1"));
  t.truthy(hogeComponent.getAttributeRaw("grimoirejs.attr1"));
  t.truthy(hogeComponent.getAttributeRaw("grimoirejs.Hoge.attr1"));
  t.truthy(hogeComponent.getAttributeRaw("Hoge.attr1"));
});
