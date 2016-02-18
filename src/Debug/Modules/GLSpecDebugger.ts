import DebuggerModuleBase from "./DebuggerModuleBase";
import Debugger from "../Debugger";
import GLSpecResolver from "../../Core/Canvas/GLSpecResolver";
import CanvasManager from "../../Core/Canvas/CanvasManager";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class GLSpecDebugger extends DebuggerModuleBase {
  public attach(debug: Debugger) {
    JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager).canvasListChanged.addListener(() => {
      debug.setInfo("GLSPEC : Maximum combined texture unit", GLSpecResolver.MaxCombinedTextureUnits);
      debug.setInfo("GLSPEC : Maximum cubemap texture size", GLSpecResolver.MaxCubeMapTextureSize);
      debug.setInfo("GLSPEC : Maximum fragment uniform vectors", GLSpecResolver.MaxFragmentUniformVectors);
      debug.setInfo("GLSPEC : Maximum rederbuffer size", GLSpecResolver.MaxRenderbufferSize);
      debug.setInfo("GLSPEC : Maximum texture image units", GLSpecResolver.MaxTextureImageUnits);
      debug.setInfo("GLSPEC : Maximum texture size", GLSpecResolver.MaxTextureSize);
      debug.setInfo("GLSPEC : Maximum varying vectors", GLSpecResolver.MaxVaryingVectors);
      debug.setInfo("GLSPEC : Maximum vertex attribute", GLSpecResolver.MaxVertexAttribs);
      debug.setInfo("GLSPEC : Maximum VTF units", GLSpecResolver.MaxVertexTextureImageUnits);
      debug.setInfo("GLSPEC : Maximum vertex uniform vectors", GLSpecResolver.MaxVertexUniformVectors);
      debug.setInfo("GLSPEC : Maximum viewport dimension", GLSpecResolver.MaxViewportDims);
    });
  }
}

export default GLSpecDebugger;
