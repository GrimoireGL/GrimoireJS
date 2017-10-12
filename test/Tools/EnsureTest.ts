import test from "ava";
import Ensure from "../../src/Tools/Ensure";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import IdentityMap from "../../src/Core/IdentityMap";
import Identity from "../../src/Core/Identity";
import Namespace from "../../src/Core/Namespace";

test.beforeEach(() => {
  Identity.clear();
});

test("Ensure passed argument should be transformed as NSIdentity", (t) => {
  Identity.fromFQN("grimoirejs.HELLO");
  t.truthy(Ensure.tobeNSIdentity("HELLO").fqn === "grimoirejs.HELLO");
  t.truthy(Ensure.tobeNSIdentity(Namespace.define("test").for("WORLD")).fqn === "test.WORLD");
});

test("Ensure passed argument are transformed into number", (t) => {
  t.truthy(Ensure.tobeNumber("9") === 9);
  t.truthy(Ensure.tobeNumber(9) === 9);
  const a: any = () => {/*do nothing*/ };
  t.throws(() => Ensure.tobeNumber(a));
});

test("Ensure passed argument are transformed into string", (t) => {
  t.truthy(Ensure.tobeString("9") === "9");
  t.truthy(Ensure.tobeString(9) === "9");
  const a: any = () => {/*do nothing*/ };
  t.throws(() => Ensure.tobeString(a));
});

test("Ensure passed array are transformed into NSIdentity[]", (t) => {
  let transformed = Ensure.tobeNSIdentityArray(undefined);
  const g = Namespace.define("test");
  t.truthy(transformed.length === 0);
  Identity.fromFQN("HELLO");
  Identity.fromFQN("grimoire.WORLD");
  transformed = Ensure.tobeNSIdentityArray(["HELLO", "WORLD"]);
  t.truthy(transformed[0].fqn === "HELLO");
  t.truthy(transformed[1].fqn === "grimoire.WORLD");
  transformed = Ensure.tobeNSIdentityArray(["HELLO", g.for("WORLD")]);
  t.truthy(transformed[0].fqn === "HELLO");
  t.truthy(transformed[1].fqn === "test.WORLD");
});

test("Ensure passed object are transformed into NSDictionary", (t) => {
  let transformed = Ensure.tobeIdentityMap(void 0);
  t.truthy(transformed instanceof IdentityMap);
  const obj = {};
  obj[Identity.fromFQN("Hello").fqn] = "test1";
  obj[Identity.fromFQN("World").fqn] = "test2";
  transformed = Ensure.tobeIdentityMap(obj);
  t.truthy(transformed instanceof IdentityMap);
  t.truthy(transformed.get("Hello") === "test1");
  t.truthy(transformed.get("World") === "test2");
});

test("Ensure name tobe fqn if name start with _", t => {
  t.truthy(Ensure.tobeFQN("aaa") == null);
  t.truthy(Ensure.tobeFQN("_aaa") === "aaa");
  t.truthy(Ensure.tobeFQN("aaa.fff") == null);
  t.truthy(Ensure.tobeFQN("_aaa.fff") === "aaa.fff");
  t.truthy(Ensure.tobeFQN(Identity.fromFQN("aaa.bbb")) === "aaa.bbb");
  t.truthy(Ensure.tobeFQN(Identity.fromFQN("aaa")) === "aaa");
});
