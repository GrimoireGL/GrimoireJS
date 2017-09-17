import test from "ava";
import TestEnvManager from "../TestEnvManager";
import GrimoireInterface from "../../src/Core/GrimoireInterface";

TestEnvManager.init();

test.beforeEach(async () => {
  GrimoireInterface.clear();
});

test("componentDeclaration poperties should be initialized correctly", (t) => {
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
    }
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
    }
  }, "Super");
  const superComponent = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponent = GrimoireInterface.componentDeclarations.get("Hoge");
  t.truthy(superComponent.name.fqn === "grimoirejs.Super");
  t.truthy(hogeComponent.name.fqn === "grimoirejs.Hoge");
  t.truthy(superComponent.superComponent == null);
  t.truthy(hogeComponent.superComponent == null); // because not esolved dependency yet.
});

test("resolveDependency should works correctly", (t) => {
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
    }
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
    }
  }, "Super");
  const superComponent = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponent = GrimoireInterface.componentDeclarations.get("Hoge");
  t.truthy(hogeComponent.resolveDependency());
  t.truthy(!hogeComponent.resolveDependency()); // already resolved
  t.truthy(!superComponent.resolveDependency()); // already resolved by inheits

  t.truthy(hogeComponent.superComponent);
  t.truthy(hogeComponent.attributes["superAttr1"].default === "hoge");
  t.truthy(hogeComponent.attributes["attr1"].default === "hoge");
  t.truthy(hogeComponent.attributes["overrideAttr1"].default === "hoge");
  t.truthy(superComponent.attributes["superAttr1"].default === "hoge");
  t.truthy(superComponent.attributes["overrideAttr1"].default === "super");
  t.truthy(superComponent.attributes["attr1"] == null);
});

test("generateInstance should works correctly", (t) => {
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
    }
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
    }
  }, "Super");
  const superComponentDec = GrimoireInterface.componentDeclarations.get("Super");
  const hogeComponentDec = GrimoireInterface.componentDeclarations.get("Hoge");

  const superComponent = superComponentDec.generateInstance();
  const hogeComponent = hogeComponentDec.generateInstance();
  t.truthy(hogeComponent.getAttributeRaw("attr1"));
  t.truthy(hogeComponent.getAttributeRaw("overrideAttr1"));
  t.truthy(hogeComponent.getAttributeRaw("superAttr1"));
  t.truthy(superComponent.getAttributeRaw("superAttr1"));
  t.truthy(superComponent.getAttributeRaw("overrideAttr1"));
});
