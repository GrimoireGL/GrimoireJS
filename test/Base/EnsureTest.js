import test from 'ava';

import Ensure from '../../lib-es5/Core/Base/Ensure';
import GrimoireInterface from '../../lib-es5/Core/GrimoireInterface';
import NamespacedDictionary from '../../lib-es5/Core/Base/NamespacedDictionary';

test('Ensure passed argument should be transformed as NamespacedIdentity', (t) => {
    t.truthy(Ensure.ensureTobeNamespacedIdentity("HELLO").fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(Ensure.ensureTobeNamespacedIdentity(GrimoireInterface.ns("HTTP://GRIMOIRE.GL/NS/TEST")("HELLO2")).fqn === "HELLO2|HTTP://GRIMOIRE.GL/NS/TEST");
});

test('Ensure passed argument are transformed into number', (t) => {
    t.truthy(Ensure.ensureNumber("9") === 9);
    t.truthy(Ensure.ensureNumber(9) === 9);
    t.throws(() => Ensure.ensureNumber(() => {}));
});

test('Ensure passed argument are transformed into string', (t) => {
    t.truthy(Ensure.ensureString("9") === "9");
    t.truthy(Ensure.ensureString(9) === "9");
    t.throws(() => Ensure.ensureString(() => {}));
});

test('Ensure passed array are transformed into NamespacedIdentity[]', (t) => {
    let transformed = Ensure.ensureTobeNamespacedIdentityArray(undefined);
    const g = GrimoireInterface.ns("http://grimoire.gl/ns/test");
    t.truthy(transformed.length === 0);
    transformed = Ensure.ensureTobeNamespacedIdentityArray(["HELLO", "WORLD"]);
    t.truthy(transformed[0].fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed[1].fqn === "WORLD|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    transformed = Ensure.ensureTobeNamespacedIdentityArray(["HELLO", g("WORLD")]);
    t.truthy(transformed[0].fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed[1].fqn === "WORLD|HTTP://GRIMOIRE.GL/NS/TEST");
});

test('Ensure passed object are transformed into NamespacedDictionary', (t) => {
    let transformed = Ensure.ensureTobeNamespacedDictionary(undefined, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    const g = GrimoireInterface.ns("http://grimoire.gl/ns/test");
    t.truthy(transformed instanceof NamespacedDictionary);
    transformed = Ensure.ensureTobeNamespacedDictionary({
        "Hello": "test1",
        "World": "test2"
    }, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed instanceof NamespacedDictionary);
    t.truthy(transformed.get("Hello") === "test1");
    t.truthy(transformed.get("World") === "test2");
    transformed = Ensure.ensureTobeNamespacedDictionary(transformed, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed instanceof NamespacedDictionary);
    t.truthy(transformed.get("Hello") === "test1");
    t.truthy(transformed.get("World") === "test2");
});
