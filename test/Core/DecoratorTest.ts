import test from "ava";
import StringConverter from "../../src/Converter/StringConverter";
import Component from "../../src/Core/Component";
import { attribute } from "../../src/Core/Decorator";
import Environment from "../../src/Core/Environment";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

const gr = Environment.GrimoireInterface;

test.beforeEach(async() => {
    gr.clear();
});

test("component poperties should be initialized correctly", async(t) => {

    class A extends Component {
        public static componentName = "hoo";

        @attribute(StringConverter, "default value")
        public hoge = "";
    }

    t.truthy(A["attributes"]);

    gr.registerComponent(A);
    gr.registerNode("hoge", [A]);

    await gr.resolvePlugins();

    TestEnvManager.loadGoml("<hoge/>");

    let node;
    for (const a in gr.rootNodes) {
        node = gr.rootNodes[a];
        break;
    }

    const c = node.getComponent(A);
    t.truthy(c.getAttributeRaw("hoge"));
    t.truthy(c.hoge);
});

// @attribute(StringConverter, "default value")
// private hoge = 0;

// // @attribute(StringConverter, "default value")
// // private test = false;

// @attribute(StringConverter, "default value", { hogehoge: 42 })
// private test2 = false;

// @companion("gl")
// private aaaa = 0;

// @watch("id")
// protected hogehogehoge(val: any) {
//   console.log("hogehoghoge:", val);
// }
