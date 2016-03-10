import DebuggerModuleBase from "./DebuggerModuleBase";
import GLSpecResolver from "../../Core/Canvas/GL/GLSpecResolver";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class GLSpecDebugger extends DebuggerModuleBase {
    attach(debug) {
        JThreeContext.getContextComponent(ContextComponents.CanvasManager).canvasListChanged.addListener(() => {
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
//# sourceMappingURL=GLSpecDebugger.js.map