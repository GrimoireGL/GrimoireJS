import Context from "../../../Context";
import CanvasManager from "../CanvasManager";
import ContextComponents from "../../../ContextComponents";
import IGLPrecisions from "./IGLPrecisions";
class GLSpecResolver {

  private static _maxCombinedTextureUnits: number;
  private static _maxCubeMapTextureSize: number;
  private static _maxFragmentUniformVectors: number;
  private static _maxRenderbufferSize: number;
  private static _maxTextureImageUnits: number;
  private static _maxTextureSize: number;
  private static _maxVaryingVectors: number;
  private static _maxVertexAttribs: number;
  private static _maxVertexTextureImageUnits: number;
  private static _maxVertexUniformVectors: number;
  private static _maxViewportDims: number[];
  private static _allShaderPrecisionFormats: IGLPrecisions;

  private static get GL() {
    const canvasManager = Context.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
    if (canvasManager.canvases.length > 0) {
      return canvasManager.canvases[0].gl;
    } else {
      console.error("can't obtain the gl context to check gl spec");
    }
  }

  private static _getParameterOrCached(cached: number|number[], parameterType: number): number|number[] {
    return cached || GLSpecResolver.GL.getParameter(parameterType);
  }


  public static get MaxCombinedTextureUnits() {
    return GLSpecResolver._maxCombinedTextureUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxCombinedTextureUnits, WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS) as number;
  }


  public static get MaxCubeMapTextureSize() {
    return GLSpecResolver._maxCubeMapTextureSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxCubeMapTextureSize, WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE) as number;
  }


  public static get MaxFragmentUniformVectors() {
    return GLSpecResolver._maxFragmentUniformVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxFragmentUniformVectors, WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS) as number;
  }


  public static get MaxRenderbufferSize() {
    return GLSpecResolver._maxRenderbufferSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxRenderbufferSize, WebGLRenderingContext.MAX_RENDERBUFFER_SIZE) as number;
  }


  public static get MaxTextureImageUnits() {
    return GLSpecResolver._maxTextureImageUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxTextureImageUnits, WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS) as number;
  }


  public static get MaxTextureSize() {
    return GLSpecResolver._maxTextureSize = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxTextureSize, WebGLRenderingContext.MAX_TEXTURE_SIZE) as number;
  }


  public static get MaxVaryingVectors() {
    return GLSpecResolver._maxVaryingVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVaryingVectors, WebGLRenderingContext.MAX_VARYING_VECTORS) as number;
  }


  public static get MaxVertexAttribs() {
    return GLSpecResolver._maxVertexAttribs = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexAttribs, WebGLRenderingContext.MAX_VERTEX_ATTRIBS) as number;
  }


  public static get MaxVertexTextureImageUnits() {
    return GLSpecResolver._maxVertexTextureImageUnits = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexTextureImageUnits, WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS) as number;
  }


  public static get MaxVertexUniformVectors() {
    return GLSpecResolver._maxVertexUniformVectors = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxVertexUniformVectors, WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS) as number;
  }


  public static get MaxViewportDims() {
    return GLSpecResolver._maxViewportDims = GLSpecResolver._getParameterOrCached(GLSpecResolver._maxViewportDims, WebGLRenderingContext.MAX_VIEWPORT_DIMS) as number[];
  }

  public static get ShaderPrecisions() {
    return GLSpecResolver._allShaderPrecisionFormats = GLSpecResolver._allShaderPrecisionFormats || GLSpecResolver._getShaderPrecisions();
  }

  private static _getShaderPrecisions(): IGLPrecisions {
    /* For Vertex Shaders */
    const vLOW_FLOAT: WebGLShaderPrecisionFormat  = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_FLOAT);
    const vMEDIUM_FLOAT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_FLOAT);
    const vHIGH_FLOAT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_FLOAT);
    const vLOW_INT: WebGLShaderPrecisionFormat  = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_INT);
    const vMEDIUM_INT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_INT);
    const vHIGH_INT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_INT);
    const fLOW_FLOAT: WebGLShaderPrecisionFormat  = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_FLOAT);
    const fMEDIUM_FLOAT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_FLOAT);
    const fHIGH_FLOAT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_FLOAT);
    const fLOW_INT: WebGLShaderPrecisionFormat  = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_INT);
    const fMEDIUM_INT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_INT);
    const fHIGH_INT: WebGLShaderPrecisionFormat = GLSpecResolver.GL.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_INT);
    return <IGLPrecisions>{vLOW_FLOAT: vLOW_FLOAT, vMEDIUM_FLOAT: vMEDIUM_FLOAT, vHIGH_FLOAT: vHIGH_FLOAT,
            vLOW_INT  : vLOW_INT  , vMEDIUM_INT  : vMEDIUM_INT  , vHIGH_INT  : vHIGH_INT,
            fLOW_FLOAT: fLOW_FLOAT, fMEDIUM_FLOAT: fMEDIUM_FLOAT, fHIGH_FLOAT: fHIGH_FLOAT,
            fLOW_INT  : fLOW_INT  , fMEDIUM_INT  : fMEDIUM_INT  , fHIGH_INT  : fHIGH_INT
          };
  }
}

export default GLSpecResolver;
