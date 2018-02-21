import test from "ava";
import { spy } from "sinon";
import StringConverter from "../../src/Converter/StringConverter";
import Component from "../../src/Core/Component";
import { attribute, companion, watch } from "../../src/Core/Decorator";
import Environment from "../../src/Core/Environment";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";
import { NumberConverter } from "../../src/Converter/NumberConverter";
import { BooleanConverter } from "../../src/Converter/BooleanConverter";

TestEnvManager.init();

const gr = Environment.GrimoireInterface;

test.beforeEach(async() => {
    gr.clear();
});

test("@attribute generate static attributes property, and binding correctly.", async(t) => {
    class A extends Component {
        public static componentName = "Hoo";

        @attribute(StringConverter, "default value")
        public hoge = "";
    }

    t.truthy(A["attributes"]); // `attributes` must be generated.

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
    t.truthy(c.getAttribute("hoge") === c.hoge);
    c.setAttribute("hoge", "new value");
    t.truthy(c.hoge === "new value");
    c.hoge = "other value";
    t.truthy(c.getAttribute("hoge") === "other value");
});

test("attributes merging correctly", async(t) => {
    class A extends Component {
        public static componentName = "hoo";
        public static attributes = {};

        @attribute(StringConverter, "default value")
        public hoge = "";
    }
    class B extends Component {
        public static componentName = "hoo";
        public static attributes = {
            fuga: {
                converter: StringConverter,
                default: "fuga",
            },
        };

        @attribute(StringConverter, "default value")
        public hoge = "";
    }

    t.truthy(A["attributes"]);
    t.truthy(A["attributes"]["hoge"]);
    t.truthy(A["attributes"]["hoge"].default === "default value");
    t.truthy(B["attributes"]);
    t.truthy(B["attributes"]["hoge"]);
    t.truthy(B["attributes"]["hoge"].default === "default value");
    t.truthy(B["attributes"]["fuga"]);
    t.truthy(B["attributes"]["fuga"].default === "fuga");

    t.throws(() => {
        class C extends Component {
            public static componentName = "Hoo";
            public static attributes = {
                hoge: {
                    converter: StringConverter,
                    default: "fhogeuga",
                },
            };

            @attribute(StringConverter, "default value")
            public hoge = "";
        }
    });

});

test("@attribute works correctly with altanative name and additional parameters.", async(t) => {
    class A extends Component {
        public static componentName = "Hoo";

        @attribute(StringConverter, "default value", "altname", { option: "value" })
        public hoge = "";
    }

    t.truthy((A as any).attributes.altname);
    t.truthy((A as any).attributes.altname.default === "default value");
    t.truthy((A as any).attributes.altname.option === "value");
});

test("@attribute works correctly with inheritance", async(t) => {
    class A extends Component {
        public static componentName = "Hoo";

        @attribute(StringConverter, "base")
        public hoge = "";
    }
    class B extends A {
        public static componentName = "Bar";
        @attribute(StringConverter, "child")
        public fuga = "";
    }

    class C extends Component {
        public static componentName = "Foo2";

        @attribute(NumberConverter,10)
        public foo2:number;
    }

    class D extends C {
        public static componentName = "Hoge";

        @attribute(BooleanConverter,false)
        public hoge2:boolean;
    }

    gr.registerComponent(A);
    gr.registerComponent(B);
    gr.registerComponent(D);
    gr.registerNode("a", [A]);
    gr.registerNode("b", [B]);

    await gr.resolvePlugins();

    t.truthy((A as any).attributes.hoge);
    t.truthy((B as any).attributes.hoge);
    t.truthy((B as any).attributes.fuga);

    TestEnvManager.loadGoml("<a><b/></a>");

    let node;
    for (const a in gr.rootNodes) {
        node = gr.rootNodes[a];
        break;
    }
    const node2 = node.children[0];

    const a = node.getComponent(A);
    const b = node2.getComponent(B);
    const d:D = node2.addComponent(D);

    t.truthy(a.hoge === "base");
    t.truthy(b.hoge === "base");
    t.truthy(b.fuga === "child");
    b.hoge = "change";
    t.truthy(a.hoge === "base");
    t.truthy(b.hoge === "change");
    t.truthy(D["attributes"]);
    t.truthy(D["attributes"]["hoge2"]);
    t.truthy(D["attributes"]["hoge2"].default === false);
    t.truthy(C["attributes"]);
    t.truthy(C["attributes"]["foo2"]);
    t.truthy(C["attributes"]["foo2"].default === 10);
    t.truthy(d.hoge2 === false);
    t.truthy(d.foo2 === 10);
});

test("@companion works correctly", async(t) => {
    class A extends Component {
        public static componentName = "Hoo";

        @companion("hoge")
        public hoge = "def";

        @companion("fuga")
        public fuga: any;
    }

    gr.registerComponent(A);
    gr.registerNode("a", [A]);

    await gr.resolvePlugins();

    TestEnvManager.loadGoml("<a/>");

    let node;
    for (const a in gr.rootNodes) {
        node = gr.rootNodes[a];
        break;
    }

    const a = node.getComponent(A);
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    t.truthy(a.hoge === "def");
    t.truthy(a.fuga === undefined);
    a.companion.set(Identity.fromFQN("hoge"), "value");
    await sleep(300); // TODO optiomize
    t.truthy(a.hoge === "value");
    a.companion.set(Identity.fromFQN("ns.fuga"), "other");
    await sleep(300);
    t.truthy(a.fuga === "other");
});

test("@watch works correctly", async(t) => {
    const s1 = spy();
    const s2 = spy();
    const s3 = spy();
    class A extends Component {
        public static componentName = "Hoo";

        @attribute("String", "value")
        public hoge = "def";

        @watch("hoge")
        public watch1(v) {
            s1(v);
        }
        @watch("hoge", true)
        public watch2(v) {
            s2(v);
        }
        @watch("hoge", true, true)
        public watch3(v) {
            s3(v);
        }
    }

    gr.registerComponent(A);
    gr.registerNode("a", [A]);
    await gr.resolvePlugins();
    TestEnvManager.loadGoml("<a/>");
    let node;
    for (const a in gr.rootNodes) {
        node = gr.rootNodes[a];
        break;
    }
    const a = node.getComponent(A);
    t.truthy(s1.notCalled);
    t.truthy(s2.calledWith("value"));
    t.truthy(s3.calledWith("value"));
    s2.resetHistory();
    s3.resetHistory();
    a.hoge = "kkk";
    t.truthy(s1.calledWith("kkk"));
    t.truthy(s2.calledWith("kkk"));
    t.truthy(s3.calledWith("kkk"));
    s1.resetHistory();
    s2.resetHistory();
    s3.resetHistory();
    a.enabled = false;
    a.hoge = "ignore";
    t.truthy(s1.notCalled);
    t.truthy(s2.notCalled);
    t.truthy(s3.calledWith("ignore"));
});
