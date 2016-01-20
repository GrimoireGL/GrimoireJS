import GetParameterType = require("../Wrapper/GetParameterType");
import JThreeContext = require("../JThreeContext");
import CanvasManager = require("./CanvasManager");
import ContextComponents = require("../ContextComponents");
class GLSpecManager {

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
    return cached || GLSpecManager.GLContext.getParameter(parameterType);
  }


  public static get MaxCombinedTextureUnits() {
    return GLSpecManager.maxCombinedTextureUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxCombinedTextureUnits, GetParameterType.MaxCombinedTextureImageUnits);
  }


  public static get MaxCubeMapTextureSize() {
    return GLSpecManager.maxCubeMapTextureSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxCubeMapTextureSize, GetParameterType.MaxCubeMapTextureSize);
  }


  public static get MaxFragmentUniformVectors() {
    return GLSpecManager.maxFragmentUniformVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxFragmentUniformVectors, GetParameterType.MaxFragmentUniformVectors);
  }


  public static get MaxRenderbufferSize() {
    return GLSpecManager.maxRenderbufferSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxRenderbufferSize, GetParameterType.MaxRenderbufferSize);
  }


  public static get MaxTextureImageUnits() {
    return GLSpecManager.maxTextureImageUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxTextureImageUnits, GetParameterType.MaxTextureImageUnits);
  }


  public static get MaxTextureSize() {
    return GLSpecManager.maxTextureSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxTextureSize, GetParameterType.MaxTextureSize);
  }


  public static get MaxVaryingVectors() {
    return GLSpecManager.maxVaryingVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxVaryingVectors, GetParameterType.MaxVaryingVectors);
  }


  public static get MaxVertexAttribs() {
    return GLSpecManager.maxVertexAttribs = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexAttribs, GetParameterType.MaxVertexAttribs);
  }


  public static get MaxVertexTextureImageUnits() {
    return GLSpecManager.maxVertexTextureImageUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexTextureImageUnits, GetParameterType.MaxVertexTextureImageUnits);
  }


  public static get MaxVertexUniformVectors() {
    return GLSpecManager.maxVertexUniformVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexUniformVectors, GetParameterType.MaxVertexUniformVectors);
  }


  public static get MaxViewportDims() {
    return GLSpecManager.maxViewportDims = GLSpecManager.getParameterOrCached(GLSpecManager.maxViewportDims, GetParameterType.MaxViewportDims);
  }
}

export = GLSpecManager;
