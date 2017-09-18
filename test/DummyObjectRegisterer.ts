import GrimoireInterface from "../src/Core/GrimoireInterface";
import sinon from "sinon";
import Namespace from "../src/Core/Namespace";

export function testComponent1() {
  const spy = sinon.spy();
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
      spy("onTest", arg);
    },
    $mount: function (arg) {
      spy("mount", arg);
    },
    $unmount: function (arg) {
      spy("unmount", arg);
    },
    $awake: function (arg) {
      spy("awake", arg);
    }
  });
  return spy;
}

export function testComponent2() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponent2",
    attributes: {
      testAttr2: {
        converter: "Str",
        default: "tc2default"
      }
    },
    $onTest: function (arg) {
      spy("onTest", arg);
    },
    $mount: function (arg) {
      spy("mount", arg);
    },
    $unmount: function (arg) {
      spy("unmount", arg);
    },
    $awake: function (arg) {
      spy("awake", arg);
    }
  });
  return spy;
}

export function testComponent3() {
  const spy = sinon.spy();
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
      spy("onTest", arg);
    },
    $mount: function (arg) {
      spy("mount", arg);
    },
    $unmount: function (arg) {
      spy("unmount", arg);
    },
    $awake: function (arg) {
      spy("awake", arg);
    }
  });
  return spy;
}

export function testComponentBase() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponentBase",
    attributes: {
      inheritAttr: {
        converter: "Str",
        default: "base"
      }
    },
    $onTest: function (arg) {
      spy("onTest", arg);
    },
    $mount: function (arg) {
      spy("mount", arg);
    },
    $unmount: function (arg) {
      spy("unmount", arg);
    },
    $awake: function (arg) {
      spy("awake", arg);
    }
  });
  return spy;
}

export function testComponentOptional() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent({
    componentName: "TestComponentOptional",
    attributes: {
      value: {
        converter: "Str",
        default: "optional"
      }
    },
    $onTest: function (arg) {
      spy("onTest", arg);
    },
    $mount: function (arg) {
      spy("mount", arg);
    },
    $unmount: function (arg) {
      spy("unmount", arg);
    },
    $awake: function (arg) {
      spy("awake", arg);
    }
  });
  return spy;
}

export function conflictComponent1() {
  const spy = sinon.spy();
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
      spy(this.attributes.get("value").Value);
    }
  });
  return spy;
}

export function conflictComponent2() {
  const spy = sinon.spy();
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
      spy(this.attributes.get("value").Value);
    }
  });
  return spy;
}



// Nodes
export function goml() {
  GrimoireInterface.registerNode("goml");
}

export function testNode1() {
  GrimoireInterface.registerNode("test-node1", ["TestComponent1"]);
}

export function testNode2() {
  GrimoireInterface.registerNode("test-node2", ["TestComponent2"], null, "test-node-base");
}

export function testNode3() {
  GrimoireInterface.registerNode("test-node3", ["TestComponent3"], { hoge: "AAA" });
}

export function testNodeBase() {
  GrimoireInterface.registerNode("test-node-base", ["TestComponentBase"]);
}

export function conflictNode1() {
  const ns = Namespace.define("test1");
  GrimoireInterface.registerNode(ns.for("conflict-node"), ["TestComponent2"], {
    attr1: "nodeA"
  }, null, null);
}

export function conflictNode2() {
  const ns = Namespace.define("test2");
  GrimoireInterface.registerNode(ns.for("conflict-node"), ["TestComponent2"], {
    attr1: "nodeB"
  }, null, null);
}


// Converters
export function stringConverter() {
  const spy = sinon.spy();
  GrimoireInterface.registerConverter("Str", (arg) => {
    spy(arg);
    if (typeof arg === "string" || !arg) {
      return arg;
    }
    throw new Error("Not Implemented:" + arg);
  });
  return spy;
}
