import glFactory from 'gl';
const gl = glFactory(1,1);
global.DOMParser = function(){}
global.WebGLRenderingContext = {prototype:{}};
for(var prop in gl){
  if(typeof gl[prop] !== "number" || prop.charAt(0).toUpperCase() !== prop.charAt(0))continue;
  global.WebGLRenderingContext.prototype[prop] = gl[prop];
}

export default gl;
