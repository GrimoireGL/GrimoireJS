import test from 'ava';

import NSIdentity from '../../lib-es5/Base/NSIdentity';
import Constants from '../../lib-es5/Base/Constants';

test('Not accept to get invalid name or namespace', (t) => {
  t.throws(() => {
    NSIdentity.from("Wrong|Name");
  });
  t.throws(() => {
    NSIdentity.from("Wrong|Namespace", "Name");
  });
  t.throws(() => {
    NSIdentity.from("Wrong.Namespace", "Wrong|Name");
  });
  t.notThrows(() => {
    NSIdentity.from("CorrectName");
  });
  t.notThrows(() => {
    NSIdentity.from("CorrectNamespace", "CorrectName");
  });
});

test('Transform name and ns correctly', (t) => {
  const i = NSIdentity.from("http://grimoire.gl/ns", "Sample");
  t.truthy(i.name === "Sample");
  t.truthy(i.ns === "http://grimoire.gl/ns");
});

test('Generate fqn correctly', (t) => {
  t.truthy((NSIdentity.from("http://ns.com", "test")).fqn === "test|http://ns.com");
  t.truthy((NSIdentity.createOnDefaultNS("test")).fqn === "test|" + Constants.defaultNamespace);
});

test('Parse fqn correctly', (t) => {
  const parsed = NSIdentity.fromFQN("TEST|HTTPNS");
  t.truthy("TEST" === parsed.name);
  t.truthy("httpns" === parsed.ns);
});
