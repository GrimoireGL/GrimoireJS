import DebuggerModuleBase from "./DebuggerModuleBase";
import Debugger from "../Debugger";
import GLSpecResolver from "../../Core/Canvas/GL/GLSpecResolver";
import CanvasManager from "../../Core/Canvas/CanvasManager";
class GLSpecDebugger extends DebuggerModuleBase {
    public attach(): void {
        CanvasManager.on("canvas-list-changed", () => {
            Debugger.setInfo("GLSPEC : Maximum combined texture unit", GLSpecResolver.MaxCombinedTextureUnits);
            Debugger.setInfo("GLSPEC : Maximum cubemap texture size", GLSpecResolver.MaxCubeMapTextureSize);
            Debugger.setInfo("GLSPEC : Maximum fragment uniform vectors", GLSpecResolver.MaxFragmentUniformVectors);
            Debugger.setInfo("GLSPEC : Maximum rederbuffer size", GLSpecResolver.MaxRenderbufferSize);
            Debugger.setInfo("GLSPEC : Maximum texture image units", GLSpecResolver.MaxTextureImageUnits);
            Debugger.setInfo("GLSPEC : Maximum texture size", GLSpecResolver.MaxTextureSize);
            Debugger.setInfo("GLSPEC : Maximum varying vectors", GLSpecResolver.MaxVaryingVectors);
            Debugger.setInfo("GLSPEC : Maximum vertex attribute", GLSpecResolver.MaxVertexAttribs);
            Debugger.setInfo("GLSPEC : Maximum VTF units", GLSpecResolver.MaxVertexTextureImageUnits);
            Debugger.setInfo("GLSPEC : Maximum vertex uniform vectors", GLSpecResolver.MaxVertexUniformVectors);
            Debugger.setInfo("GLSPEC : Maximum viewport dimension", GLSpecResolver.MaxViewportDims);
        });
    }
}

export default GLSpecDebugger;
