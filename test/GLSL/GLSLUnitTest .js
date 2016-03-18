import test from 'ava';

import GLSLUnit from '../Tester/GLSL/GLSLUnit';

test('GLSL Unit Test',async ()=>{
  console.log(await GLSLUnit.loadFile("./Resources/PackingTest.glsl"));
});
