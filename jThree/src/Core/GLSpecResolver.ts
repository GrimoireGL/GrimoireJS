import GetParameterType = require("../Wrapper/GetParameterType");
import JThreeContext = require("../JThreeContext");
import CanvasManager = require("./CanvasManager");
import ContextComponents = require("../ContextComponents");
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

  private static get GLContext() {
    const canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
    if (canvasManager.canvases.length > 0) {
      return canvasManager.canvases[0].GL;
    } else {
      console.error("can't obtain the gl context to check gl spec");
    }
  }

  private static getParameterOrCached(cached: number, parameterType: GetParameterType) {
    return cached || GLSpecResolver.GLContext.getParameter(parameterType);
  }


  public static get MaxCombinedTextureUnits() {
    return GLSpecResolver.maxCombinedTextureUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxCombinedTextureUnits, GetParameterType.MaxCombinedTextureImageUnits);
  }


  public static get MaxCubeMapTextureSize() {
    return GLSpecResolver.maxCubeMapTextureSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxCubeMapTextureSize, GetParameterType.MaxCubeMapTextureSize);
  }


  public static get MaxFragmentUniformVectors() {
    return GLSpecResolver.maxFragmentUniformVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxFragmentUniformVectors, GetParameterType.MaxFragmentUniformVectors);
  }


  public static get MaxRenderbufferSize() {
    return GLSpecResolver.maxRenderbufferSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxRenderbufferSize, GetParameterType.MaxRenderbufferSize);
  }


  public static get MaxTextureImageUnits() {
    return GLSpecResolver.maxTextureImageUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxTextureImageUnits, GetParameterType.MaxTextureImageUnits);
  }


  public static get MaxTextureSize() {
    return GLSpecResolver.maxTextureSize = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxTextureSize, GetParameterType.MaxTextureSize);
  }


  public static get MaxVaryingVectors() {
    return GLSpecResolver.maxVaryingVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVaryingVectors, GetParameterType.MaxVaryingVectors);
  }


  public static get MaxVertexAttribs() {
    return GLSpecResolver.maxVertexAttribs = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexAttribs, GetParameterType.MaxVertexAttribs);
  }


  public static get MaxVertexTextureImageUnits() {
    return GLSpecResolver.maxVertexTextureImageUnits = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexTextureImageUnits, GetParameterType.MaxVertexTextureImageUnits);
  }


  public static get MaxVertexUniformVectors() {
    return GLSpecResolver.maxVertexUniformVectors = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxVertexUniformVectors, GetParameterType.MaxVertexUniformVectors);
  }


  public static get MaxViewportDims() {
    return GLSpecResolver.maxViewportDims = GLSpecResolver.getParameterOrCached(GLSpecResolver.maxViewportDims, GetParameterType.MaxViewportDims);
  }
}

export = GLSpecResolver;
