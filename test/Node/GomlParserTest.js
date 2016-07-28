import test from 'ava';
import GomlParser from "../../lib-es5/Core/Node/GomlParser";
import xmldom from 'xmldom';
import DefaultPluginRegister from "../../lib-es5/Core/Node/DefaultPluginRegister"
import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface"
import NamespacedIdentity from "../../lib-es5/Core/Base/NamespacedIdentity"

function loadFromTestResource(path) {
    return require("./_TestResource/" + path);
}

// Get element from test case source which is located with relative path.
function obtainElementTag(path) {
    const DOMParser = xmldom.DOMParser;
    global.Node = {
        ELEMENT_NODE: 1
    };
    const parser = new DOMParser();
    return parser.parseFromString(loadFromTestResource(path), "text/xml").documentElement;
}


function registerUserPlugin() {
    GrimoireInterface.registerNode("testNode1", ["testComponent1"], null, null, null);
    GrimoireInterface.registerNode("testNode2", ["testComponent2"], null, null, "testNodeBase");
    GrimoireInterface.registerNode("testNodeBase", ["testComponentBase"], null, null, null);

    GrimoireInterface.registerComponent("testComponent1", {
        testAttr1: {
            converter: "stringconverter",
            defaultValue: null
        }
    }, {});
    GrimoireInterface.registerComponent("testComponent2", {
        attr1: {
            converter: "stringconverter",
            defaultValue: "tc2default"
        }
    }, {});
    GrimoireInterface.registerComponent("testComponentBase", {
        inheritAttr: {
            converter: "stringconverter",
            defaultValue: "tc3default"
        }
    }, {});
    GrimoireInterface.registerComponent("testComponentOptional", {
        value: {
            converter: "stringconverter",
            defaultValue: "tc3default"
        }
    }, {});

    const ns1 = "http://testNamespace/test1";
    const ns2 = "http://testNamespace/test2";
    const id_a = new NamespacedIdentity(ns1, "conflictNode");
    const id_b = new NamespacedIdentity(ns2, "conflictNode");
    const id_a_c = new NamespacedIdentity(ns1, "conflictComponent");
    const id_b_c = new NamespacedIdentity(ns2, "conflictComponent");
    GrimoireInterface.registerNode(id_a, ["testComponent2"], {
        attr1: "nodeA"
    }, null, null);
    GrimoireInterface.registerNode(id_b, ["testComponent2"], {
        attr1: "nodeB"
    });
    GrimoireInterface.registerComponent(id_a_c, {
        value: {
            converter: "stringConverter",
            defaultValue: "aaa"
        }
    }, {
        conf1: function(obj) {
            const v = this.attributes.get("value").Value;
            obj.value = v;
            console.log("component conf1 ::" + v);
        }
    });
    GrimoireInterface.registerComponent(id_b_c, {
        value: {
            converter: "stringConverter",
            defaultValue: "bbb"
        }
    });
    GrimoireInterface.registerNode("scenes");
    GrimoireInterface.registerNode("scene");
}

DefaultPluginRegister.register();
registerUserPlugin();

test('test for parsing node hierarchy.', (t) => {
    const element = obtainElementTag("GomlParserTest_Case1.goml");
    const node = GomlParser.parse(element);
    t.truthy(node.parent === void 0);
    t.truthy(node.children.length === 1);
    const c = node.children[0];
    t.truthy(c.parent === node);
    t.truthy(c.children.length === 2);
    t.truthy(c.children[0].children.length === 0);
    t.truthy(c.children[0].parent === c);
    t.truthy(c.children[1].children.length === 0);
    t.truthy(c.children[1].parent === c);
});

test('test for send/broadcastMessage and component Attribute parsing.', (t) => {
    const element = obtainElementTag("GomlParserTest_Case2.goml");
    const node = GomlParser.parse(element);
    t.truthy(node.parent === void 0);
    node.broadcastMessage("dummyMethod", "testArgument");
});

test('test for parse user-define component.', (t) => {
    const element = obtainElementTag("GomlParserTest_Case3.goml");
    const node = GomlParser.parse(element);
});

test('test for namespace parsing.', (t) => {
    const element = obtainElementTag("GomlParserTest_Case4.goml");
    const node = GomlParser.parse(element);
    var obj = {
        value: "change to 'aaa'"
    };
    node.broadcastMessage("conf1", obj);
    t.truthy(obj.value === "aaa");
});
