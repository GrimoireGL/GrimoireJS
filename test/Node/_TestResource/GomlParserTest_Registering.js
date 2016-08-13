import GrimoireInterface from "../../../lib-es5/Core/GrimoireInterface";
import sinon from "sinon";

// Components

export function testComponent1() {
  const testComponent1Spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent1", {
    attributes:{
      testAttr1: {
        converter: "string",
        defaultValue: null
      }
    },
    onTest: function(arg) {
      testComponent1Spy(arg);
    }
  });
  return testComponent1Spy;
};

export function testComponent2() {
  const testComponent2Spy = sinon.spy();
  GrimoireInterface.registerComponent("testComponent2", {
    attributes:{
      testAttr2: {
        converter: "string",
        defaultValue: "tc2default"
      }
    },
    onTest: function(arg) {
      testComponent2Spy(arg);
    }
  });
  return testComponent2Spy;
}

export function testComponentBase() {
  const testComponentBaseSpy = sinon.spy();
<<<<<<< HEAD
  GrimoireInterface.registerComponent("testComponentBase",{
  attributes: {
    inheritAttr: {
      converter: "string",
      defaultValue: "base"
    }
  },
=======
  GrimoireInterface.registerComponent("testComponentBase", {
    attributes: {
      inheritAttr: {
        converter: "string",
        defaultValue: "base"
      }
    },
>>>>>>> d3ca44f629e9df1f2b2aa9d13f9092981152abbc
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
    attributes:{
=======
    attributes: {
>>>>>>> d3ca44f629e9df1f2b2aa9d13f9092981152abbc
      value: {
        converter: "string",
        defaultValue: "optional"
      }
    },
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
    attributes:{
<<<<<<< HEAD
        value: {
          converter: "string",
          defaultValue: "aaa"
        }
=======
      value: {
        converter: "string",
        defaultValue: "aaa"
      }
>>>>>>> d3ca44f629e9df1f2b2aa9d13f9092981152abbc
    },
    onTest: function() {
      spy(this.attributes.get("value").Value);
    }
  });
  return spy;
}

export function conflictComponent2() {
  const spy = sinon.spy();
  const ns = GrimoireInterface.ns("http://testNamespace/test2");
<<<<<<< HEAD
  GrimoireInterface.registerComponent(ns("conflictComponent"), {
=======
  GrimoireInterface.registerComponent(ns("conflictComponent"),  {
>>>>>>> d3ca44f629e9df1f2b2aa9d13f9092981152abbc
    attributes:{
      value: {
        converter: "string",
        defaultValue: "bbb"
      }
    },
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
