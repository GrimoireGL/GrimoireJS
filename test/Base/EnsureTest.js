import '../XMLDomInit'
import test from 'ava';

import Ensure from '../../lib-es5/Base/Ensure';
import GrimoireInterface from '../../lib-es5/GrimoireInterface';
import NSDictionary from '../../lib-es5/Base/NSDictionary';
import NSIdentity from '../../lib-es5/Base/NSIdentity';

test.beforeEach(() => {
  NSIdentity.clear();
});

test('Ensure passed argument should be transformed as NSIdentity', (t) => {
  t.truthy(Ensure.tobeNSIdentity("HELLO").fqn === "HELLO|grimoirejs");
  t.truthy(Ensure.tobeNSIdentity("HELLO|GRIMOIREJS").fqn === "HELLO|grimoirejs");
  t.truthy(Ensure.tobeNSIdentity(GrimoireInterface.ns("grimoiregltest")("HELLO2")).fqn === "HELLO2|grimoiregltest");
});

test('Ensure passed argument are transformed into number', (t) => {
  t.truthy(Ensure.tobeNumber("9") === 9);
  t.truthy(Ensure.tobeNumber(9) === 9);
  t.throws(() => Ensure.ensureNumber(() => {}));
});

test('Ensure passed argument are transformed into string', (t) => {
  t.truthy(Ensure.tobeString("9") === "9");
  t.truthy(Ensure.tobeString(9) === "9");
  t.throws(() => Ensure.tobeString(() => {}));
});

test('Ensure passed array are transformed into NSIdentity[]', (t) => {
  let transformed = Ensure.tobeNSIdentityArray(undefined);
  const g = GrimoireInterface.ns("test");
  t.truthy(transformed.length === 0);
  transformed = Ensure.tobeNSIdentityArray(["HELLO", "WORLD"]);
  t.truthy(transformed[0].fqn === "HELLO|grimoirejs");
  t.truthy(transformed[1].fqn === "WORLD|grimoirejs");
  transformed = Ensure.tobeNSIdentityArray(["HELLO", g("WORLD")]);
  t.truthy(transformed[0].fqn === "HELLO|grimoirejs");
  t.truthy(transformed[1].fqn === "WORLD|test");
});

test('Ensure passed object are transformed into NSDictionary', (t) => {
  let transformed = Ensure.tobeNSDictionary(undefined, "grimoirejs");
  t.truthy(transformed instanceof NSDictionary);
  transformed = Ensure.tobeNSDictionary({
    "Hello": "test1",
    "World": "test2"
  });
  t.truthy(transformed instanceof NSDictionary);
  t.truthy(transformed.get("Hello") === "test1");
  t.truthy(transformed.get("World") === "test2");
});
