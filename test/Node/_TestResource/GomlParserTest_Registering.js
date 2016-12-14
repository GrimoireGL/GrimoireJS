const GrimoireInterface = require("../../../lib-es5/GrimoireInterface").default;
const sinon = require("sinon");

// Components

export function testComponent1() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent1", {
    attributes: {
      testAttr1: {
        converter: "string",
        default: null
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
};

export function testComponent2() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent2", {
    attributes: {
      testAttr2: {
        converter: "string",
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
  GrimoireInterface.registerComponent("testComponent3", {
    attributes: {
      testAttr3: {
        converter: "string",
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

export function testComponentBase() {
  const spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponentBase", {
    attributes: {
      inheritAttr: {
        converter: "string",
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
  GrimoireInterface.registerComponent("testComponentOptional", {
    attributes: {
      value: {
        converter: "string",
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
  const ns = GrimoireInterface.ns("http://testNamespace/test1");
  GrimoireInterface.registerComponent(ns("conflictComponent"), {
    attributes: {
      value: {
        converter: "string",
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
  const ns = GrimoireInterface.ns("http://testNamespace/test2");
  GrimoireInterface.registerComponent(ns("conflictComponent"), {
    attributes: {
      value: {
        converter: "string",
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
  GrimoireInterface.registerNode("goml", [], {});
};

export function testNode1() {
  GrimoireInterface.registerNode("testNode1", ["testComponent1"], null, null, null);
}

export function testNode2() {
  GrimoireInterface.registerNode("testNode2", ["testComponent2"], null, null, "testNodeBase");
};

export function testNode3() {
  GrimoireInterface.registerNode("testNode3", ["testComponent3"], {});
}

export function testNodeBase() {
  GrimoireInterface.registerNode("testNodeBase", ["testComponentBase"], null, null, null);
}

export function conflictNode1() {
  const ns = GrimoireInterface.ns("http://testNamespace/test1");
  GrimoireInterface.registerNode(ns("conflictNode"), ["testComponent2"], {
    attr1: "nodeA"
  }, null, null);
}

export function conflictNode2() {
  const ns = GrimoireInterface.ns("http://testNamespace/test2");
  GrimoireInterface.registerNode(ns("conflictNode"), ["testComponent2"], {
    attr1: "nodeB"
  }, null, null);
}


// Converters
export function stringConverter() {
  const spy = sinon.spy();
  GrimoireInterface.registerConverter("string", (arg) => {
    spy(arg);
    if (typeof arg === "string" || !arg) {
      return arg;
    }
    throw new Error("Not Implemented:" + arg);
  });
  return spy;
};
