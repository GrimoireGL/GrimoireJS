import '../XMLDomInit'
import test from 'ava';

import Ensure from '../../lib-es5/Core/Base/Ensure';
import GrimoireInterface from '../../lib-es5/Core/GrimoireInterface';
import NSDictionary from '../../lib-es5/Core/Base/NSDictionary';

test('Ensure passed argument should be transformed as NSIdentity', (t) => {
    t.truthy(Ensure.ensureTobeNSIdentity("HELLO").fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(Ensure.ensureTobeNSIdentity(GrimoireInterface.ns("HTTP://GRIMOIRE.GL/NS/TEST")("HELLO2")).fqn === "HELLO2|HTTP://GRIMOIRE.GL/NS/TEST");
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

test('Ensure passed array are transformed into NSIdentity[]', (t) => {
    let transformed = Ensure.ensureTobeNSIdentityArray(undefined);
    const g = GrimoireInterface.ns("http://grimoire.gl/ns/test");
    t.truthy(transformed.length === 0);
    transformed = Ensure.ensureTobeNSIdentityArray(["HELLO", "WORLD"]);
    t.truthy(transformed[0].fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed[1].fqn === "WORLD|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    transformed = Ensure.ensureTobeNSIdentityArray(["HELLO", g("WORLD")]);
    t.truthy(transformed[0].fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed[1].fqn === "WORLD|HTTP://GRIMOIRE.GL/NS/TEST");
});

test('Ensure passed object are transformed into NSDictionary', (t) => {
    let transformed = Ensure.ensureTobeNSDictionary(undefined, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    const g = GrimoireInterface.ns("http://grimoire.gl/ns/test");
    t.truthy(transformed instanceof NSDictionary);
    transformed = Ensure.ensureTobeNSDictionary({
        "Hello": "test1",
        "World": "test2"
    }, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed instanceof NSDictionary);
    t.truthy(transformed.get("Hello") === "test1");
    t.truthy(transformed.get("World") === "test2");
    transformed = Ensure.ensureTobeNSDictionary(transformed, "HTTP://GRIMOIRE.GL/NS/DEFAULT");
    t.truthy(transformed instanceof NSDictionary);
    t.truthy(transformed.get("Hello") === "test1");
    t.truthy(transformed.get("World") === "test2");
});
