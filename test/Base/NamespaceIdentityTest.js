import test from 'ava';

import NamespacedIdentity from '../../lib-es5/Core/Base/NamespacedIdentity';
import Constants from '../../lib-es5/Core/Base/Constants';

test('Not accept to get invalid name or namespace', (t) => {
    t.throws(() => {
        new NamespacedIdentity("Wrong|Name");
    });
    t.throws(() => {
        new NamespacedIdentity("Wrong|Namespace","Name");
    });
    t.throws(() => {
        new NamespacedIdentity("Wrong.Namespace","Wrong|Name");
    });
    t.notThrows(() => {
        new NamespacedIdentity("CorrectName");
    });
    t.notThrows(() => {
        new NamespacedIdentity("CorrectNamespace","CorrectName");
    });
});

test('Transform name and ns correctly',(t)=>{
  const i = new NamespacedIdentity("http://grimoire.gl/ns","Sample");
  t.truthy(i.name === "SAMPLE");
  t.truthy(i.ns === "HTTP://GRIMOIRE.GL/NS");
});

test('Generate fqn correctly', (t) => {
    t.truthy((new NamespacedIdentity("http://ns.com","test")).fqn === "TEST|HTTP://NS.COM");
    t.truthy((new NamespacedIdentity("test")).fqn === "TEST|" + Constants.defaultNamespace);
});

test('Parse fqn correctly', (t) => {
    const parsed = NamespacedIdentity.fromFQN("TEST|HTTP://NS.COM");
    t.truthy("TEST" === parsed.name);
    t.truthy("HTTP://NS.COM" === parsed.ns);
});
