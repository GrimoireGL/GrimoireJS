import test from 'ava';

import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface";

test('ns method should generate namespace generating function correctly',(t)=>{
  const g = GrimoireInterface.ns('http://grimoire.gl/ns/2');
  t.truthy(g("test").fqn === "TEST|HTTP://GRIMOIRE.GL/NS/2");
});
