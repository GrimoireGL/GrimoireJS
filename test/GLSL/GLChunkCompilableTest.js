import test from 'ava';
import fs from 'fs';
import compilable from '../Tester/GLSL/GLSLCompilationTester';
test('_Packing.glsl should be compilable',(t)=>{
  t.ok(compilable(require("../../lib-es5/Core/Materials/BuiltIn/Chunk/_Packing.glsl").default));
});

test('_BasicVertexTransform.glsl should be compilable',(t)=>{
  t.ok(compilable(require("../../lib-es5/Core/Materials/BuiltIn/Vertex/_BasicVertexTransform.glsl").default));
});

test('_PMXVertexShader.glsl should be compilable',(t)=>{
  t.ok(compilable(require("../../lib-es5/PMX/ShaderChunk/_PMXVertexShader.glsl").default));
});
