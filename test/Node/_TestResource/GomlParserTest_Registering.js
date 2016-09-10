import GrimoireInterface from "../../../lib-es5/Core/GrimoireInterface";
import sinon from "sinon";

// Components

export function testComponent1() {
  const testComponent1Spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent1", {
<<<<<<< HEAD
    testAttr1: {
      converter: "string",
      defaultValue: null
    }
  }, {
=======
    attributes:{
      testAttr1: {
        converter: "string",
        defaultValue: null
      }
    },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function(arg) {
      testComponent1Spy(arg);
    }
  });
  return testComponent1Spy;
};

export function testComponent2() {
  const testComponent2Spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent2", {
<<<<<<< HEAD
    testAttr2: {
      converter: "string",
      defaultValue: "tc2default"
    }
  }, {
=======
    attributes:{
      testAttr2: {
        converter: "string",
        defaultValue: "tc2default"
      }
    },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function(arg) {
      testComponent2Spy(arg);
    }
  });
  return testComponent2Spy;
}

export function testComponentBase() {
  const testComponentBaseSpy = sinon.spy();
<<<<<<< HEAD
  GrimoireInterface.registerComponent("testComponentBase", {
=======
  GrimoireInterface.registerComponent("testComponentBase",{
  attributes: {
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    inheritAttr: {
      converter: "string",
      defaultValue: "base"
    }
<<<<<<< HEAD
  }, {
=======
  },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function(arg) {
      testComponentBaseSpy(arg);
    }
  });
  return testComponentBaseSpy;
}

export function testComponentOptional() {
  const testComponentOptionalSpy = sinon.spy();
  GrimoireInterface.registerComponent("testComponentOptional", {
<<<<<<< HEAD
    value: {
      converter: "string",
      defaultValue: "optional"
    }
  }, {
=======
    attributes:{
      value: {
        converter: "string",
        defaultValue: "optional"
      }
    },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function(arg) {
      testComponentOptionalSpy(arg);
    }
  });
  return testComponentOptionalSpy;
}

export function conflictComponent1() {
  const spy = sinon.spy();
  const ns = GrimoireInterface.ns("http://testNamespace/test1");
  GrimoireInterface.registerComponent(ns("conflictComponent"), {
<<<<<<< HEAD
    value: {
      converter: "string",
      defaultValue: "aaa"
    }
  }, {
=======
    attributes:{
        value: {
          converter: "string",
          defaultValue: "aaa"
        }
    },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function() {
      spy(this.attributes.get("value").Value);
    }
  });
  return spy;
}

export function conflictComponent2() {
  const spy = sinon.spy();
  const ns = GrimoireInterface.ns("http://testNamespace/test2");
  GrimoireInterface.registerComponent(ns("conflictComponent"), {
<<<<<<< HEAD
    value: {
      converter: "string",
      defaultValue: "bbb"
    }
  }, {
=======
    attributes:{
      value: {
        converter: "string",
        defaultValue: "bbb"
      }
    },
>>>>>>> 90271576a775407b50eb0c66374f15427d64640b
    onTest: function() {
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
    if (typeof arg === "string") {
      return arg;
    }
    throw new Error("Not Implemented");
  });
  return spy;
};
