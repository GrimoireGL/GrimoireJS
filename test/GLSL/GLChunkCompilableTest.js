import test from 'ava';
import fs from 'fs';
import compilable from '../Tester/GLSL/GLSLCompilationTester';
test('_Packing.glsl should be compilable',(t)=>{
  t.ok(compilable(fs.readFileSync("../../lib/Core/Materials/BuiltIn/Chunk/_Packing.glsl",{encoding:"utf-8"})));
});

test('_BasicVertexTransform.glsl should be compilable',(t)=>{
  t.ok(compilable(fs.readFileSync("../../lib/Core/Materials/BuiltIn/Vertex/_BasicVertexTransform.glsl",{encoding:"utf-8"})));
});

test('_PMXVertexShader.glsl should be compilable',(t)=>{
  t.ok(compilable(fs.readFileSync("../../lib/PMX/ShaderChunk/_PMXVertexShader.glsl",{encoding:"utf-8"})));
});
