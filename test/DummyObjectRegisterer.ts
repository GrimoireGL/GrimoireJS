import GrimoireInterface from "../src/Core/GrimoireInterface";
import Namespace from "../src/Core/Namespace";
import { spy } from "sinon";

export function registerTestComponent1() {
  const s = spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponent1",
    attributes: {
      testAttr1: {
        converter: "Str",
        default: null
      },
      hoge: {
        converter: "Str",
        default: "DEFAULT"
      }
    },
    $onTest: function (arg) {
      s("onTest", arg);
    },
    $mount: function (arg) {
      s("mount", arg);
    },
    $unmount: function (arg) {
      s("unmount", arg);
    },
    $awake: function (arg) {
      s("awake", arg);
    }
  });
  return s;
}

export function registerTestComponent2() {
  const s = spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponent2",
    attributes: {
      testAttr2: {
        converter: "Str",
        default: "tc2default"
      }
    },
    $onTest: function (arg) {
      s("onTest", arg);
    },
    $mount: function (arg) {
      s("mount", arg);
    },
    $unmount: function (arg) {
      s("unmount", arg);
    },
    $awake: function (arg) {
      s("awake", arg);
    }
  });
  return s;
}

export function registerTestComponent3() {
  const s = spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponent3",
    attributes: {
      testAttr3: {
        converter: "Str",
        default: "tc2default"
      },
      hogehoge: {
        converter: "Str",
        default: "hoge"
      },
      hoge: {
        converter: "Str",
        default: "hoge"
      }
    },
    $onTest: function (arg) {
      s("onTest", arg);
    },
    $mount: function (arg) {
      s("mount", arg);
    },
    $unmount: function (arg) {
      s("unmount", arg);
    },
    $awake: function (arg) {
      s("awake", arg);
    }
  });
  return s;
}

export function registerTestComponentBase() {
  const s = spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponentBase",
    attributes: {
      inheritAttr: {
        converter: "Str",
        default: "base"
      }
    },
    $onTest: function (arg) {
      s("onTest", arg);
    },
    $mount: function (arg) {
      s("mount", arg);
    },
    $unmount: function (arg) {
      s("unmount", arg);
    },
    $awake: function (arg) {
      s("awake", arg);
    }
  });
  return s;
}

export function registerTestComponentOptional() {
  const s = spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponentOptional",
    attributes: {
      value: {
        converter: "Str",
        default: "optional"
      }
    },
    $onTest: function (arg) {
      s("onTest", arg);
    },
    $mount: function (arg) {
      s("mount", arg);
    },
    $unmount: function (arg) {
      s("unmount", arg);
    },
    $awake: function (arg) {
      s("awake", arg);
    }
  });
  return s;
}

export function registerConflictComponent1() {
  const s = spy();
  const ns = Namespace.define("test1");
  GrimoireInterface.registerComponent({
    componentName: ns.for("ConflictComponent"),
    attributes: {
      value: {
        converter: "Str",
        default: "aaa"
      }
    },
    $onTest: function () {
      s(this.attributes.get("value").Value);
    }
  });
  return s;
}

export function registerConflictComponent2() {
  const s = spy();
  const ns = Namespace.define("test2");
  GrimoireInterface.registerComponent({
    componentName: ns.for("ConflictComponent"),
    attributes: {
      value: {
        converter: "Str",
        default: "bbb"
      }
    },
    $onTest: function () {
      s(this.attributes.get("value").Value);
    }
  });
  return s;
}



// Nodes
export function registerGoml() {
  GrimoireInterface.registerNode("goml");
}

export function registerTestNode1() {
  GrimoireInterface.registerNode("test-node1", ["TestComponent1"]);
}

export function registerTestNode2() {
  GrimoireInterface.registerNode("test-node2", ["TestComponent2"], null, "test-node-base");
}

export function registerTestNode3() {
  GrimoireInterface.registerNode("test-node3", ["TestComponent3"], { hoge: "AAA" });
}

export function registerTestNodeBase() {
  GrimoireInterface.registerNode("test-node-base", ["TestComponentBase"]);
}

export function registerConflictNode1() {
  const ns = Namespace.define("test1");
  GrimoireInterface.registerNode(ns.for("conflict-node"), ["TestComponent2"], {
    attr1: "nodeA"
  }, null, null);
}

export function registerConflictNode2() {
  const ns = Namespace.define("test2");
  GrimoireInterface.registerNode(ns.for("conflict-node"), ["TestComponent2"], {
    attr1: "nodeB"
  }, null, null);
}


// Converters
export function registerStringConverter() {
  const s = spy();
  GrimoireInterface.registerConverter("Str", (arg) => {
    s(arg);
    if (typeof arg === "string" || !arg) {
      return arg;
    }
    throw new Error("Not Implemented:" + arg);
  });
  return s;
}
