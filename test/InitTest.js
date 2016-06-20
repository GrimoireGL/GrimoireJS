import test from 'ava';
import GLInitializer from './GLTestInitializer';

import Init from './../lib-es5/Init'

test('[Test for test env]GL constants should in WebGLRenderingContext prototype',(t)=>{
  t.ok(WebGLRenderingContext.prototype.ONE === 1);
});

test('GL constants should be copied to WebGLRenderingContext',(t)=>{
  t.ok(!WebGLRenderingContext.ONE); // Constants should not be defined yet.
  Init._copyGLConstants();
  t.ok(WebGLRenderingContext.ONE === 1);
});

export default WebGLRenderingContext;
