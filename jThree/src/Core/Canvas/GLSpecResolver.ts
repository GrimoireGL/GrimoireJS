import JThreeContext from "../../JThreeContext";
import CanvasManager from "./CanvasManager";
import ContextComponents from "../../ContextComponents";
class GLSpecResolver {

  private static maxCombinedTextureUnits;
  private static maxCubeMapTextureSize;
  private static maxFragmentUniformVectors;
  private static maxRenderbufferSize;
  private static maxTextureImageUnits;
  private static maxTextureSize;
  private static maxVaryingVectors;
  private static maxVertexAttribs;
  private static maxVertexTextureImageUnits;
  private static maxVertexUniformVectors;
  private static maxViewportDims;

  private static get GL() {
    const canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
    if (canvasManager.canvases.length > 0) {
      return canvasManager.canvases[0].GL;
    } else {
      console.error("can't obtain the gl context to check gl spec");
    }
  }

  private static getParameterOrCached(cached: number, parameterType: number) {
    return cached || GLSpecResolver.GL.getParameter(parameterType);
  }


  public static get MaxCombinedTextureUnits() {
    return GLSpecResolver.maxCombinedTextureUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxCombinedTextureUnits, GLSpecResolver.GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  }


  public static get MaxCubeMapTextureSize() {
    return GLSpecResolver.maxCubeMapTextureSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxCubeMapTextureSize, GLSpecResolver.GL.MAX_CUBE_MAP_TEXTURE_SIZE);
  }


  public static get MaxFragmentUniformVectors() {
    return GLSpecResolver.maxFragmentUniformVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxFragmentUniformVectors, GLSpecResolver.GL.MAX_FRAGMENT_UNIFORM_VECTORS);
  }


  public static get MaxRenderbufferSize() {
    return GLSpecResolver.maxRenderbufferSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxRenderbufferSize, GLSpecResolver.GL.MAX_RENDERBUFFER_SIZE);
  }


  public static get MaxTextureImageUnits() {
    return GLSpecResolver.maxTextureImageUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxTextureImageUnits, GLSpecResolver.GL.MAX_TEXTURE_IMAGE_UNITS);
  }


  public static get MaxTextureSize() {
    return GLSpecResolver.maxTextureSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxTextureSize, GLSpecResolver.GL.MAX_TEXTURE_SIZE);
  }


  public static get MaxVaryingVectors() {
    return GLSpecResolver.maxVaryingVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVaryingVectors, GLSpecResolver.GL.MAX_VARYING_VECTORS);
  }


  public static get MaxVertexAttribs() {
    return GLSpecResolver.maxVertexAttribs = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexAttribs, GLSpecResolver.GL.MAX_VERTEX_ATTRIBS);
  }


  public static get MaxVertexTextureImageUnits() {
    return GLSpecResolver.maxVertexTextureImageUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexTextureImageUnits, GLSpecResolver.GL.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  }


  public static get MaxVertexUniformVectors() {
    return GLSpecResolver.maxVertexUniformVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexUniformVectors, GLSpecResolver.GL.MAX_VERTEX_UNIFORM_VECTORS);
  }


  public static get MaxViewportDims() {
    return GLSpecResolver.maxViewportDims = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxViewportDims, GLSpecResolver.GL.MAX_VIEWPORT_DIMS);
  }
}

export default GLSpecResolver;
