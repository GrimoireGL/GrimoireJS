import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import GLSpecManager = require("../../Core/GLSpecManager");
import CanvasManager = require("../../Core/CanvasManager");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
class GLSpecDebugger extends DebuggerModuleBase {
  public attach(debug: Debugger) {
    JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager).canvasListChanged.addListener(() => {
      debug.setInfo("GLSPEC : Maximum combined texture unit", GLSpecManager.MaxCombinedTextureUnits);
      debug.setInfo("GLSPEC : Maximum cubemap texture size", GLSpecManager.MaxCubeMapTextureSize);
      debug.setInfo("GLSPEC : Maximum fragment uniform vectors", GLSpecManager.MaxFragmentUniformVectors);
      debug.setInfo("GLSPEC : Maximum rederbuffer size", GLSpecManager.MaxRenderbufferSize);
      debug.setInfo("GLSPEC : Maximum texture image units", GLSpecManager.MaxTextureImageUnits);
      debug.setInfo("GLSPEC : Maximum texture size", GLSpecManager.MaxTextureSize);
      debug.setInfo("GLSPEC : Maximum varying vectors", GLSpecManager.MaxVaryingVectors);
      debug.setInfo("GLSPEC : Maximum vertex attribute", GLSpecManager.MaxVertexAttribs);
      debug.setInfo("GLSPEC : Maximum VTF units", GLSpecManager.MaxVertexTextureImageUnits);
      debug.setInfo("GLSPEC : Maximum vertex uniform vectors", GLSpecManager.MaxVertexUniformVectors);
      debug.setInfo("GLSPEC : Maximum viewport dimension", GLSpecManager.MaxViewportDims);
    });
  }
}

export = GLSpecDebugger;
