import test from 'ava';

import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface";

test('ns method should generate namespace generating function correctly',(t)=>{
  const g = GrimoireInterface.ns('http://grimoire.gl/ns/2');
  t.ok(g("test").fqn === "TEST|HTTP://GRIMOIRE.GL/NS/2");
});

test('Ensure passed argument to register~~ should be transformed as NamespacedIdentity',(t)=>{
  t.ok(GrimoireInterface._ensureTobeNamespacedIdentity("HELLO").fqn === "HELLO|HTTP://GRIMOIRE.GL/NS/DEFAULT");
  t.ok(GrimoireInterface._ensureTobeNamespacedIdentity(GrimoireInterface.ns("HTTP://GRIMOIRE.GL/NS/TEST")("HELLO2")).fqn === "HELLO2|HTTP://GRIMOIRE.GL/NS/TEST");  
});
