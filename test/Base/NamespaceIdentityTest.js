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
        new NamespacedIdentity("Wrong|Namespace","Wrong|Name");
    });
    t.notThrows(() => {
        new NamespacedIdentity("CorrectName");
    });
    t.notThrows(() => {
        new NamespacedIdentity("CorrectNamespace","CorrectName");
    });
});

test('Generate fqn correctly', (t) => {
    t.ok((new NamespacedIdentity("http://ns.com","test")).fqn === "TEST|HTTP://NS.COM");
    t.ok((new NamespacedIdentity("test")).fqn === "TEST|" + Constants.defaultNamespace);
});

test('Parse fqn correctly', (t) => {
    const parsed = NamespacedIdentity.fromFQN("TEST|HTTP://NS.COM");
    t.ok("TEST" === parsed.name);
    t.ok("HTTP://NS.COM" === parsed.ns);
});
