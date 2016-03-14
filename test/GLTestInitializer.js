import glFactory from 'gl';
const gl = glFactory(1,1);

global.WebGLRenderingContext = {};
global.WebGLRenderingContext.prototype = Object.getPrototypeOf(gl);

export default gl;
