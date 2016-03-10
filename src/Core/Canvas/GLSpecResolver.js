"use strict";
const JThreeContext_1 = require("../../JThreeContext");
const ContextComponents_1 = require("../../ContextComponents");
class GLSpecResolver {
    static get GL() {
        const canvasManager = JThreeContext_1.default.getContextComponent(ContextComponents_1.default.CanvasManager);
        if (canvasManager.canvases.length > 0) {
            return canvasManager.canvases[0].gl;
        }
        else {
            console.error("can't obtain the gl context to check gl spec");
        }
    }
    static _getParameterOrCached(cached, parameterType) {
        return cached || GLSpecResolver.GL.getParameter(parameterType);
    }
    static get MaxCombinedTextureUnits() {
        return GLSpecResolver._maxCombinedTextureUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxCombinedTextureUnits, WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    }
    static get MaxCubeMapTextureSize() {
        return GLSpecResolver._maxCubeMapTextureSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxCubeMapTextureSize, WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE);
    }
    static get MaxFragmentUniformVectors() {
        return GLSpecResolver._maxFragmentUniformVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxFragmentUniformVectors, WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS);
    }
    static get MaxRenderbufferSize() {
        return GLSpecResolver._maxRenderbufferSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxRenderbufferSize, WebGLRenderingContext.MAX_RENDERBUFFER_SIZE);
    }
    static get MaxTextureImageUnits() {
        return GLSpecResolver._maxTextureImageUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxTextureImageUnits, WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS);
    }
    static get MaxTextureSize() {
        return GLSpecResolver._maxTextureSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxTextureSize, WebGLRenderingContext.MAX_TEXTURE_SIZE);
    }
    static get MaxVaryingVectors() {
        return GLSpecResolver._maxVaryingVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVaryingVectors, WebGLRenderingContext.MAX_VARYING_VECTORS);
    }
    static get MaxVertexAttribs() {
        return GLSpecResolver._maxVertexAttribs = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexAttribs, WebGLRenderingContext.MAX_VERTEX_ATTRIBS);
    }
    static get MaxVertexTextureImageUnits() {
        return GLSpecResolver._maxVertexTextureImageUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexTextureImageUnits, WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    }
    static get MaxVertexUniformVectors() {
        return GLSpecResolver._maxVertexUniformVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexUniformVectors, WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS);
    }
    static get MaxViewportDims() {
        return GLSpecResolver._maxViewportDims = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxViewportDims, WebGLRenderingContext.MAX_VIEWPORT_DIMS);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GLSpecResolver;
//# sourceMappingURL=GLSpecResolver.js.map